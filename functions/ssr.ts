const ssrFunctions = require('firebase-functions');
const url = require('url');
const nodeFetch = require('node-fetch');
const ssrApp = require('express')();

let appUrl = 'bitwiser.io';

if (ssrFunctions.config().elasticsearch &&
  ssrFunctions.config().elasticsearch.index &&
  ssrFunctions.config().elasticsearch.index.production &&
  ssrFunctions.config().elasticsearch.index.production === 'true') {
  appUrl = 'bitwiser.io'
} else {
  appUrl = 'rwa-trivia-dev-e57fc.firebaseapp.com'
}

const renderUrl = 'https://render-tron.appspot.com/render';

function generateUrl(request) {
  return url.format({
    protocol: request.protocol,
    host: appUrl,
    pathname: request.originalUrl
  })
}

function detectBot(userAgent: string): boolean {
  const bots = [
    //search engines:
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    //social media:
    'twitterbot',
    'linkedinbot',
    'facebookexternalhit',
    'embedly',
    'baiduspider',
    'pinterest',
    'slackbot',
    'vkShare',
    'facebot',
    'outbrain',
    'W3C_Validator'
  ];

  const agent: string = userAgent.toLowerCase();

  for (const bot of bots) {
    if (agent.indexOf(bot) > -1) {
      console.log('bot detected: ' + bot);
      return true;
    }
  }
  return false;
}

ssrApp.get('*', (req, res) => {
  const isBot = detectBot(req.headers['user-agent']);
  if (isBot) {
    const botUrl = generateUrl(req);
    nodeFetch(`${renderUrl}/${botUrl}`)
      .then(res => res.text())
      .then(body => {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.set('Vary', 'User-Agent');
        //console.log(body.toString());
        res.send(body.toString());
      });
  } else {
    //console.log(`Standard: https://${appUrl}`);
    nodeFetch(`https://${appUrl}`)
      .then(res => res.text())
      .then(body => {
        res.send(body.toString());
      });
  }
});


exports.ssr = ssrFunctions.https.onRequest(ssrApp);
