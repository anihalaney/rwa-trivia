exports.app = require('./server/functions/app').app;
exports.onFirestoreQuestionWrite = require('./server/functions/db').onQuestionWrite;
exports.onFirestoreGameUpdate = require('./server/functions/db').onGameUpdate;
exports.onFirestoreUserUpdate = require('./server/functions/db').onUserUpdate;