// start scheduler of game to check game over of users

import { GameScheduler } from './schedulers';
import { schedulerConstants } from './constants';

const envCommand = process.argv[2];
const envAppName = (envCommand === schedulerConstants.prod) ?
    schedulerConstants.prodFunctionsAppName : schedulerConstants.devFunctionsAppName;
const gameScheduler: GameScheduler = new GameScheduler();
gameScheduler.checkGames(schedulerConstants.authToken, envAppName);
gameScheduler.changeTheTurn(schedulerConstants.authToken, envAppName);
