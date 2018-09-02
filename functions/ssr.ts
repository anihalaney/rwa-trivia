// These are important and needed before anything else



const ssrFunction = require('firebase-functions');

let isProductionEnv = false;
if (ssrFunction.config().elasticsearch &&
  ssrFunction.config().elasticsearch.index &&
  ssrFunction.config().elasticsearch.index.production &&
  // tslint:disable-next-line:triple-equals
  ssrFunction.config().elasticsearch.index.production == 'true') {

  isProductionEnv = true;
}
const server = require('./server');
server.setEnvironment(isProductionEnv);

const ngApp = server.app;

const runtimeOpts = {
  memory: '512MB'
}

exports.ssr = ssrFunction.runWith(runtimeOpts).https.onRequest(ngApp);
