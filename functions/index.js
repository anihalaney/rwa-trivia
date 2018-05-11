exports.app = require('./server/functions/app').app;
exports.onFirestoreQuestionWrite = require('./server/functions/db/firebase-functions').onQuestionWrite;
exports.onFirestoreGameUpdate = require('./server/functions/db/firebase-functions').onGameUpdate;
exports.onFirestoreUserUpdate = require('./server/functions/db/firebase-functions').onUserUpdate;
exports.onFirestoreInvitationWrite = require('./server/functions/db/firebase-functions').onInvitationWrite;