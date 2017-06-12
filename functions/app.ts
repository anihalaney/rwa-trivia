import { Game, Question } from '../src/app/model';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  
  const original = req.query.text;
  // Push it into the Realtime Database then send a response
  admin.database().ref('/messages').push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});

const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
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
    next();
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};

app.use(cors);
app.use(cookieParser);
//app.use(validateFirebaseIdToken);
app.get('/hello', validateFirebaseIdToken, (req, res) => {
  res.send(`Hello ${req.user.email}`);
});

app.get('/getNextQuestion/:gameId', validateFirebaseIdToken, (req, res, next) => {

  console.log(req.user.uid);
  console.log(req.params.gameId);

  let userId = req.user.uid;
  let gameId = req.params.gameId;
  let resp = `Hello ${req.user.email} - ${req.params.gameId}`;

  //admin.database().enableLogging(true);

  let game: Game;
  admin.database().ref("/games/" + gameId).once("value").then(g => {
    if (!g.exists()) {
      //game not found
      res.status(404).send('Game not found');
      return;
    }
    game = Game.getViewModel(g.val());
    console.log(game);
    resp += " - Game Found !!!"

    if (game.playerIds.indexOf(userId) < 0) {
      //user not part of this game
      res.status(403).send('User not part of this game');
      return;
    }

    if (game.gameOver) {
      //gameOver
      res.status(403).send('Game over. No more Questions');
      return;
    }

    if (game.gameOptions.gameMode !== 0) {
      //Multiplayer mode - check whose turn it is. Not yet implemented
      res.status(501).send('Wait for your turn. Not yet implemented.');
      return;
    }

    admin.database().ref("/questions/published").orderByKey().limitToLast(1).once("value").then(qs => {
      console.log(qs.key);
      console.log(qs.val());
      qs.forEach(q => {
        console.log(q.key);
        console.log(q.val());

        let question: Question = q.val();
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
  })
  .catch(error => {
    res.status(500).send('Uncaught Error');
    return;
  });
  
});

exports.app = functions.https.onRequest(app);
