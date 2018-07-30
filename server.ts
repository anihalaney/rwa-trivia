// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { join, resolve } from 'path';

const domino = require('domino');
const win = domino.createWindow('');

global['window'] = win;
global['document'] = win.document;
global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;

const APP_NAME = 'browser';
const DIST_FOLDER = resolve(process.cwd(), '../dist');
console.log(DIST_FOLDER);

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

app.set('views', join(DIST_FOLDER, APP_NAME));

// Point all routes to Universal
app.get('*', (req, res) => {
  res.render('index', { req });
});


exports.app = app;

