// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { resolve } from 'path';
import * as express from 'express';

const domino = require('domino');
const compression = require('compression');
const win = domino.createWindow('');
const app = express();

const path = require('path');
let index;

global['window'] = win;
global['document'] = win.document;
global['Node'] = win.Node;
global['navigator'] = win.navigator;
global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;


// console.log(process.cwd());
const DIST_FOLDER = resolve(process.cwd(), './dist');
// console.log(DIST_FOLDER);


const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require(`./functions/dist/server/main`);

enableProdMode();


// Set the engine
app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);
app.use(compression());
// Point all routes to Universal
app.get('*', (req, res) => {
  // console.log('ssr url---->', req.url);
  res.setHeader('Cache-Control', 'public, max-age=21600, s-maxage=21600');

  if (req.url.includes('index.html')) {

    index = (!index) ? require('fs')
      .readFileSync(resolve(process.cwd(), './dist/index.html'), 'utf8')
      .toString() : index;
    // console.log('cached html---->', index);
    res.send(index);
  } else {
    res.render('index', { req }, (err, html) => {
      res.send(html);
    });
  }

});

exports.app = app;

