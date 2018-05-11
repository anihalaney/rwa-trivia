
const functions = require('firebase-functions');
const auth = require('./middlewares/auth');
const parse = require('csv').parse;
const fs = require('fs');
const path = require('path');
express = require('express');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });
const app = express();
require('./db/firebase-functions').addMessage(functions);

app.use(cors);
app.use(cookieParser);
app.use(auth.validateFirebaseIdToken);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Routes
app.use(require('./routes/routes'))


exports.app = functions.https.onRequest(app);
