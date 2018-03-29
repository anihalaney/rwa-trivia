// start scheduler of game to check game over of users

import { GameScheduler } from './schedulers';
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const firebaseConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../config/firebase-config.json'), 'utf8'));


admin.initializeApp(firebaseConfig.config);

const gameScheduler: GameScheduler = new GameScheduler();
gameScheduler.checkGames(admin.firestore());
