// These are important and needed before anything else
const ssrFunction = require('firebase-functions');
const ngApp = require('./server').app;

exports.ssr = ssrFunction.https.onRequest(ngApp);
