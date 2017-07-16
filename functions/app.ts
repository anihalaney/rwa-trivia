import { Game, Question, Category } from '../src/app/model';
import { ESUtils } from './ESUtils';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const parse = require('csv').parse;
const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();
const elasticsearch = require('elasticsearch');

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

//authorization middlewares
const validateFirebaseIdToken = (req, res, next) => {
  //Get user from auth headers. 
  //If found set req.user
  //If not found, go to next middleware, the next middleware needs to check for req.user to allow/deny unauthorized access

  //console.log('Check if request is authorized with Firebase ID token');
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    //res.status(403).send('Unauthorized');
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
    //res.status(403).send('Unauthorized');
    return next();
  });
};

//middleware to check for authorized users
const authorizedOnly = (req, res, next) => { 
  if (!req.user || !req.user.uid) {
    console.error('User not authenticated');
    res.status(403).send('Unauthorized');
  }

  console.log(req.user.uid);
  next();
};

//middleware to check for admins Only
const adminOnly = (req, res, next) => { 

  if (!req.user || !req.user.uid) {
    console.error('User not authenticated');
    res.status(401).send('Unauthenticated');
  }
  console.log(req.user.uid);

  admin.database().ref("/users/" + req.user.uid + "/roles").once("value").then(r => { 
    console.log(r.val());
    if (r.val().admin)
      //check if user is admin
      next();
    else {
      console.error('Not an admin: ', req.user.uid);
      res.status(403).send('Unauthorized');
    }

  });

};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

//Routes

//Does not need authorization
app.get('/getQuestionOfTheDay', (req, res) => { 
  ESUtils.getRandomQuestionOfTheDay().then((question) => {
    res.send(question);
  });
})

app.get('/getNextQuestion/:gameId', authorizedOnly, (req, res, next) => {

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

//rebuild questions index
app.get('/rebuild_questions_index', adminOnly, (req, res) => {

  let questions = [];
  admin.database().ref("/questions/published").orderByKey().once("value").then(qs => {
    //console.log("Questions Count: " + qs.length);
    qs.forEach(q => {
      //console.log(q.key);
      //console.log(q.val());

      let question: {"id": string, "type": string, "source": any} = {"id": q.key, "type": q.val().categoryIds["0"], "source": q.val()};
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
//TEST FUNCTIONS
//
app.get('/hello', authorizedOnly, (req, res) => {
  res.send(`Hello ${req.user.email}`);
});

app.get('/getTestQuestion', authorizedOnly, (req, res, next) => {
    admin.database().ref("/questions/published").orderByKey().limitToLast(1).once("value").then(qs => {
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
  
});

app.get('/getGameQuestionTest', authorizedOnly, (req, res) => { 
  ESUtils.getRandomGameQuestion().then((question) => {
    res.send(question);
  });
})

app.get('/testES', adminOnly, (req, res) => {

  let client = ESUtils.getElasticSearchClient();

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

//END - TEST FUNCTIONS
///////////////////////

exports.app = functions.https.onRequest(app);





/*
app.get('/parseCsv', adminOnly, (req, res, next) => {

    let categories: Category[] = [];
    let catRef = admin.database().ref("/categories");
    catRef.once("value", function(cs) {
      cs.forEach(c => {
        //console.log(c.key);
        //console.log(c.val());
        let category: Category = { "id": c.key, "categoryName": c.val()["categoryName"]};
        categories.push(category);
        return;
      })

      console.log(categories);

      let ouput = [];
      let parser = parse({delimiter: ':'});
      
      fs.readFile('C:\\Users\\Akshay\\Dropbox\\Blog\\Real World Angular\\Question Data\\Question Format_batch - Akshay.csv', (err, data) => {
        if (err) throw err;

        parse(data, {"columns": true, "skip_empty_lines": true}, 
          function(err, output){
            let questions: Question [] =
            output.map(element => {
              let question: Question = new Question();
              question.questionText = element["Question"];
              question.answers = [
                { "id": 1, "answerText": element["Option 1"], correct: false },
                { "id": 2, "answerText": element["Option 2"], correct: false },
                { "id": 3, "answerText": element["Option 3"], correct: false },
                { "id": 4, "answerText": element["Option 4"], correct: false } 
              ]
              question.answers[element["Answer Index"] - 1].correct = true;
              question.id = "0";

              question.tags = [];
              for (let i = 1; i < 10; i++)
              {
                if (element["Tag " + i] && element["Tag " + i] != "")
                  question.tags.push(element["Tag " + i]);
              }
              question.categoryIds = [];
              let category = categories.find(c => c.categoryName == element["Category"]);
              if (category)
                question.categoryIds.push(category.id);

              question.published = false;
              //validations
              if (element["Status"] != "Approved")
                //status - not approved
                question.explanation = "status - not approved";
              else if (question.categoryIds.length == 0)
                //No Category Found
                question.explanation = "No Category Found";
              else if (question.tags.length < 2)
                //Not enough tags
                question.explanation = "Not enough tags";
              else if (question.answers.filter(a => a.correct).length !== 1)
                //Must have exactly one correct answer
                question.explanation = "Must have exactly one correct answer";
              else if (question.answers.filter(a => !a.answerText || a.answerText.trim() === "").length > 0)
                //Missing Answer
                question.explanation = "Missing Answer";
              else if (!question.questionText || question.questionText.trim() === "")
                //Missing Question
                question.explanation = "Missing Question";
              else
                question.published = true;

              return question;
            });

            let ref = admin.database().ref("/testQ"); // /questions/published
            questions.filter(q => q.published).forEach(q => {
              ref.push(q);
            });
            //res.send(output);
            res.send(questions);
        });
      });

    });

});
*/

