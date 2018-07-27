import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

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
const API_PREFIX = 'app';
require('./db/firebase-functions').addMessage(functions);

app.use(cors);
app.use(cookieParser);
app.use(auth.validateFirebaseIdToken);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static(__dirname + '/../../images'));



app.use((req, res, next) => {
    if (req.url.indexOf(`/${API_PREFIX}/`) === 0) {
        req.url = req.url.substring(API_PREFIX.length + 1);
    }
    next();
});

// Routes
app.use(require('./routes/routes'))

exports.app = functions.https.onRequest(app);
