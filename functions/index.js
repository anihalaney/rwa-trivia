exports.app = require('./server/functions/app').app;
exports.onFirestoreQuestionWrite = require('./server/functions/db').onQuestionWrite;