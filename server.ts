// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';


// DOM libs required for Firebase
// (global as any).WebSocket = require('ws');
// (global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { join } from 'path';
import { readFileSync } from 'fs';


const domino = require('domino');
const DIST_FOLDER = join(process.cwd(), 'dist');
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
const win = domino.createWindow(template);

global['window'] = win;
global['document'] = win.document;
global['WebSocket'] = require('ws');
global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;

const PORT = process.env.PORT || 4000;
const APP_NAME = 'browser';


const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require(`./dist/server/main`);

enableProdMode();

const app = express();

// Set the engine
app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);

app.set('view engine', 'html');

app.get('/**/*', (req, res) => {
  res.render(join(DIST_FOLDER, APP_NAME, 'index'), {
    req,
    res
  });
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, APP_NAME));

// Static Assets
app.get('*.*', express.static(join(DIST_FOLDER, APP_NAME)));

// Point all routes to Universal
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
