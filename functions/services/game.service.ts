const gameFireBaseClient = require('../db/firebase-client');
const gameFireStoreClient = gameFireBaseClient.firestore();
import { Game, GameStatus, GameOptions, PlayerMode, OpponentType } from '../../projects/shared-library/src/lib/shared/model';


/**
 * getAvailableGames
 * return games
 */
exports.getAvailableGames = (): Promise<any> => {
    return gameFireStoreClient.collection('games').where('GameStatus', '==', GameStatus.AVAILABLE_FOR_OPPONENT)
        .where('gameOver', '==', false)
        .get().then(games => { return games });
};

/**
 * getLiveGames
 * return games
 */
exports.getLiveGames = (): Promise<any> => {
    return gameFireStoreClient.collection('games')
        .where('gameOver', '==', false)
        .get().then(games => { return games });
};


/**
 * createGame
 * return ref
 */
exports.createGame = (dbGame: any): Promise<any> => {
    return gameFireStoreClient.collection('games').add(dbGame).then(ref => { return ref });
};


/**
 * getGameById
 * return game
 */
exports.getGameById = (gameId: string): Promise<any> => {
    return gameFireStoreClient.doc(`games/${gameId}`).get().then((game) => { return game });
};


/**
 * setGame
 * return ref
 */
exports.setGame = (dbGame: any): Promise<any> => {
    return gameFireStoreClient.doc('/games/' + dbGame.id).set(dbGame).then((ref) => { return ref });
};


/**
 * updateGame
 * return ref
 */
exports.updateGame = (dbGame: any): Promise<any> => {
    return gameFireStoreClient.doc('/games/' + dbGame.id).update(dbGame).then((ref) => { return ref });
};


/**
 * checkGameOver
 * return status
 */
exports.checkGameOver = (): Promise<any> => {

    return gameFireStoreClient.collection('/games').where('gameOver', '==', false)
        .get()
        .then((snapshot) => { return snapshot })
        .catch((err) => {
            console.log('Error getting documents', err);
            return err
        });

};

/**
 * getCompletedGames
 * return games
 */
exports.getCompletedGames = (): Promise<any> => {
    // console.log('completed games');
    return gameFireStoreClient.collection('/games')
        .where('gameOver', '==', true)
        .get()
        .then((games) => { return games })
        .catch((err) => {
            console.log('Error getting documents', err);
            return err
        });
};


