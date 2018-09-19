// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { resolve } from 'path';
import * as express from 'express';

const domino = require('domino');
const compression = require('compression')
const win = domino.createWindow('');
const app = express();
let isProductionEnv = false;

global['window'] = win;
global['document'] = win.document;
global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;

// console.log(process.cwd());
const DIST_FOLDER = resolve(process.cwd(), './dist');
// console.log(DIST_FOLDER);

// console.log('isProductionEnv', isProductionEnv);

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
app.use(compression())
// Point all routes to Universal
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=21600, s-maxage=21600');
  res.render('index', { req }, (err, html) => {
    if (isProductionEnv) {
      html += `\n<script async src="https://www.googletagmanager.com/gtag/js?id=UA-122807814-1"></script>
        <script>
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
          }, i[r].l = 1 * new Date();
          a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-122807814-1', 'auto');// add your tracking ID here.
        ga('send', 'pageview');
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'UA-122807814-1');
      </script>`;
    }
    res.send(html);
  });
});
app.setEnvironment = setEnvironment
exports.app = app;

function setEnvironment(envFlag) {
  isProductionEnv = envFlag;
}

exports.setEnvironment = setEnvironment;
