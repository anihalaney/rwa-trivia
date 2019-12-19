// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import * as express from 'express';
import * as domino from 'domino';
import * as compression from 'compression';
import { XMLHttpRequest } from 'xmlhttprequest';
import { join } from 'path';

const win = domino.createWindow('');

global['window'] = win;
global['window']['JSON'] = JSON;
global['window']['Promise'] = Promise;
global['document'] = win.document;
global['Node'] = win['Node'];
global['navigator'] = win.navigator;
global['XMLHttpRequest'] = XMLHttpRequest;
global['componentHandler'] = {
  register: () => {}
}
const app = express();

// console.log(process.cwd());
const DIST_FOLDER = join(process.cwd(), './dist/browser');
// console.log(DIST_FOLDER);

const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
  ngExpressEngine,
  provideModuleMap
} = require(`./functions/dist/server/main`);

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

app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y'
  })
);

// Point all routes to Universal
app.get('*', (req, res) => {
  res.render('index', { req });
});

export default app;
