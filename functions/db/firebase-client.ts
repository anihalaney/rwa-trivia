const admin = require('firebase-admin');
const fs1 = require('fs');
const path1 = require('path');
const serviceAccount = JSON.parse(fs1.readFileSync
    (path1.resolve(__dirname, '../../../config/rwa-trivia-dev-e57fc-firebase-adminsdk-ksltx-ccd27f44a3.json')
    , 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://rwa-trivia-dev-e57fc.firebaseio.com'
});

module.exports = admin;
