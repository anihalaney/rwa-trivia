import { Game, Question, Category, SearchCriteria } from '../src/app/model';
import { ESUtils } from './ESUtils';
import { FirestoreMigration } from './firestore-migration';
import { Subscription } from './subscription';
import { GameMechanics } from './game-mechanics';




const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const parse = require('csv').parse;
const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });
const app = express();
const elasticsearch = require('elasticsearch');

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.

  const original = req.query.text;
  // Push it into the Realtime Database then send a response
  admin.database().ref('/messages').push({ original: original }).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});

// authorization middlewares
const validateFirebaseIdToken = (req, res, next) => {
  // Get user from auth headers.
  // If found set req.user
  // If not found, go to next middleware, the next middleware needs to check for req.user to allow/deny unauthorized access

  // console.log('Check if request is authorized with Firebase ID token');
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');
    // res.status(403).send('Unauthorized');
    return next();
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    return next();
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    // res.status(403).send('Unauthorized');
    return next();
  });
};

// middleware to check for authorized users
const authorizedOnly = (req, res, next) => {
  if (!req.user || !req.user.uid) {
    console.error('User not authenticated');
    res.status(403).send('Unauthorized');
  }

  console.log(req.user.uid);
  next();
};

// middleware to check for admins Only

const adminOnly = (req, res, next) => {

  if (!req.user || !req.user.uid) {
    console.error('User not authenticated');
    res.status(401).send('Unauthenticated');
  }
  console.log(req.user.uid);

  admin.firestore().doc(`/users/${req.user.uid}`)
    .get()
    .then(u => {
      const user = u.data();
      if (user.roles && user.roles.admin) {
        return next();
      } else {
        console.error('Not an admin: ', req.user.uid);
        res.status(403).send('Unauthorized');
      }
    })
    .catch(error => {
      console.error(error);
    });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Routes

// Does not need authorization
app.get('/getQuestionOfTheDay', (req, res) => {
  ESUtils.getRandomQuestionOfTheDay().then((question) => {
    res.send(question);
  });
})

app.post('/getQuestions/:start/:size', adminOnly, (req, res) => {
  // Admins can get all Qs, while authorized users can only get Qs created by them
  // TODO: For now restricting it to admins only till we add security
  const start = req.params.start;
  const size = req.params.size;
  const criteria: SearchCriteria = req.body;
  console.log(criteria);

  ESUtils.getQuestions(start, size, criteria).then((results) => {
    res.send(results);
  });
})

app.get('/getNextQuestion/:gameId', authorizedOnly, (req, res, next) => {

  // console.log(req.user.uid);
  // console.log(req.params.gameId);

  const userId = req.user.uid;
  const gameId = req.params.gameId;
  let resp = `Hello ${req.user.email} - ${req.params.gameId}`;

  // admin.database().enableLogging(true);

  let game: Game;
  admin.firestore().doc('/games/' + gameId).get().then(g => {
    // admin.database().ref("/games/" + gameId).once("value").then(g => {
    if (!g.exists) {
      // game not found
      res.status(404).send('Game not found');
      return;
    }
    game = Game.getViewModel(g.data());
    // console.log(game);
    resp += ' - Game Found !!!'

    if (game.playerIds.indexOf(userId) < 0) {
      // user not part of this game
      res.status(403).send('User not part of this game');
      return;
    }

    if (game.gameOver) {
      // gameOver
      res.status(403).send('Game over. No more Questions');
      return;
    }

    if (game.gameOptions.gameMode !== 0) {
      // Multiplayer mode - check whose turn it is. Not yet implemented
      res.status(501).send('Wait for your turn. Not yet implemented.');
      return;
    }

    ESUtils.getRandomGameQuestion().then((question) => {
      res.send(question);
    })
      .catch(error => {
        res.status(500).send('Failed to get Q');
        return;
      });
  })
    .catch(error => {
      res.status(500).send('Uncaught Error');
      return;
    });

});

app.get('/subscription/count', (req, res) => {
  const subscription: Subscription = new Subscription(admin.firestore());
  subscription.getTotalSubscription()
    .then(subscribers => res.send(subscribers))
    .catch(error => {
      console.log(error);
      res.status(500).send('Internal Server error');
    });
});

app.post('/createGame', authorizedOnly, (req, res) => {
  // console.log('body---->', req.body);
  const gameOptions = req.body.gameOptions;
  const userId = req.body.userId;

  if (!gameOptions) {
    // Game Option is not added
    res.status(403).send('Game Option is not added in request');
    return;
  }

  if (!userId) {
    // userId
    res.status(403).send('userId is not added in request');
    return;
  }

  const gameMechanics: GameMechanics = new GameMechanics(gameOptions, userId, admin.firestore());
  gameMechanics.createNewGame().then((gameId) => {
    console.log('gameId', gameId);

    res.send({ gameId: gameId });
  });


});

app.get('/migrate_to_firestore/:collection', adminOnly, (req, res) => {

  console.log(req.params.collection);

  const migration = new FirestoreMigration(admin);

  switch (req.params.collection) {
    case 'categories':
      // Migrate categories
      console.log('Migrating categories ...');
      migration.migrateCategories.then(cats => { res.send(cats) });
      break;
    case 'tags':
      // Migrate Tags
      console.log('Migrating tags ...');
      migration.migrateTags.then(tags => { res.send(tags) });
      break;
    case 'games':
      // Migrate games
      console.log('Migrating games ...');
      migration.migrateGames('/games', 'games').then(q => { res.send('Game Count: ' + q) });
      break;
    case 'questions':
      // Migrate questions
      console.log('Migrating questions ...');
      migration.migrateQuestions('/questions/published', 'questions').then(q => { res.send('Question Count: ' + q) });
      break;
    case 'unpublished_questions':
      // Migrate unpublished questions
      console.log('Migrating unpublished questions ...');
      migration.migrateQuestions('/questions/unpublished', 'unpublished_questions').then(q => { res.send('Question Count: ' + q) });
      break;
  }

  // res.send("Check firestore db for migration details");

});

app.get('/migrate_data_from_prod_dev/:collection', adminOnly, (req, res) => {
  console.log(req.params.collection);
  const sourceDB = admin.firestore();
  // set required dev configuration parameters for different deployment environments(firebase project) using following command
  // default project in firebase is development deployment
  // firebase -P production functions:config:set devconfig.param1=value
  // After setting config variable do not forget to deploy functions
  // to see set environments firebase -P production functions:config:get
  const targetAppConfig = functions.config().devconfig;
  const config = {
    'apiKey': targetAppConfig.apikey,
    'authDomain': targetAppConfig.authdomain,
    'databaseURL': targetAppConfig.databaseurl,
    'projectId': targetAppConfig.projectid,
    'storageBucket': targetAppConfig.storagebucket,
    'messagingSenderId': targetAppConfig.messagingsenderid
  }
  // console.log('targetAppConfig', targetAppConfig);
  const targetDB = admin.initializeApp(config, 'targetApp').firestore();
  sourceDB.collection(req.params.collection).get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        targetDB.collection(req.params.collection).doc(doc.id).set(doc.data());
      });
      res.send('loaded data');
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

});



// rebuild questions index
app.get('/rebuild_questions_index', adminOnly, (req, res) => {

  const questions = [];
  admin.firestore().collection('/questions').orderBy('id').get().then(qs => {
    // admin.database().ref("/questions/published").orderByKey().once("value").then(qs => {
    // console.log("Questions Count: " + qs.length);
    qs.forEach(q => {
      // console.log(q.key);
      console.log(q.data());

      const data = q.data();
      const question: { 'id': string, 'type': string, 'source': any } = { 'id': data.id, 'type': data.categoryIds['0'], 'source': data };
      questions.push(question);
    });

    ESUtils.rebuildIndex(ESUtils.QUESTIONS_INDEX, questions).then((response) => {
      res.send(`Questions indexed`);
    })
      .catch((error) => {
        res.send(error);
      })
  });
});

///////////////////////
// TEST FUNCTIONS
//
app.get('/hello', authorizedOnly, (req, res) => {
  res.send(`Hello ${req.user.email}`);
});

app.get('/getTestQuestion', authorizedOnly, (req, res, next) => {
  admin.database().ref('/questions/published').orderByKey().limitToLast(1).once('value').then(qs => {
    qs.forEach(q => {
      console.log(q.key);
      console.log(q.val());

      const question: Question = q.val();
      question.id = q.key;
      res.send(question);
      return;
    })
    return;
  })
    .catch(error => {
      res.status(500).send('Failed to get Q');
      return;
    });

});

app.get('/getGameQuestionTest', authorizedOnly, (req, res) => {
  ESUtils.getRandomGameQuestion().then((question) => {
    res.send(question);
  });
})

app.get('/testES', adminOnly, (req, res) => {

  const client = ESUtils.getElasticSearchClient();

  client.ping({
    requestTimeout: 10000,
  }, function (error) {
    if (error) {
      console.error('elasticsearch cluster is down!');
      res.send('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
      res.send(`Hello. ES is up`);
    }
  });

});
// END - TEST FUNCTIONS
///////////////////////



exports.app = functions.https.onRequest(app);
