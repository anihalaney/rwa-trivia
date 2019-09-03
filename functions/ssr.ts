// These are important and needed before anything else


const ssrFunction = require('firebase-functions');
// const server = require('./server');


const ngApp = require('./../../dist/server').default;

const runtimeOpts = {
  memory: '512MB'
};

exports.ssr = ssrFunction.runWith(runtimeOpts).https.onRequest(ngApp);
