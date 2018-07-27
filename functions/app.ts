import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';


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



<<<<<<< HEAD
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    res.render('index', { req });
});

=======
app.use((req, res, next) => {
    if (req.url.indexOf(`/${API_PREFIX}/`) === 0) {
        req.url = req.url.substring(API_PREFIX.length + 1);
    }
    next();
});

// Routes
app.use(require('./routes/routes'))
>>>>>>> d39e369d4695e9ffd4daf5d36449e90a6a0c3270

exports.app = functions.https.onRequest(app);
