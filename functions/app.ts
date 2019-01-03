import { appConstants } from '../projects/shared-library/src/lib/shared/model';
import * as express from 'express';
const functions = require('firebase-functions');
const auth = require('./middlewares/auth');
const parse = require('csv').parse;
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });
const app = express();
require('./db/firebase-functions').addMessage(functions);

app.use(cors);
app.use(cookieParser);
app.use(auth.validateFirebaseIdToken);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static(__dirname + '/../../images'));




app.use((req, res, next) => {
    //  console.log('before', req.url);
    if (req.url.indexOf(`/${appConstants.API_PREFIX}/`) === -1) {
        req.url = `/${appConstants.API_PREFIX}${req.url}`; // prepend '/' to keep query params if any
    }
    //  console.log('after', req.url);
    next();
});

// Routes
app.use(require('./routes/routes'));

exports.app = functions.https.onRequest(app);
