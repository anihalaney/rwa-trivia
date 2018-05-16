
const generalService = require('../services/general.service');
import { FirestoreMigration } from '../utils/firestore-migration';
import { GameLeaderBoardStats } from '../utils/game-leader-board-stats';
import { UserContributionStat } from '../utils/user-contribution-stat';

/**
 * migrateCollections
 * return status
 */
exports.migrateCollections = (req, res) => {
    console.log(req.params.collectionName);

    const migration = new FirestoreMigration();

    switch (req.params.collectionName) {
        case 'categories':
            // Migrate categories
            console.log('Migrating categories ...');
            migration.migrateCategories.then(cats => { res.send(cats) });
            break;
        case 'tags':
            // Migrate Tags
            console.log('Migrating tags ...');
            migration.migrateTags.then(tags => { res.send(tags) });
            break;
        case 'games':
            // Migrate games
            console.log('Migrating games ...');
            migration.migrateGames('/games', 'games').then(q => { res.send('Game Count: ' + q) });
            break;
        case 'questions':
            // Migrate questions
            console.log('Migrating questions ...');
            migration.migrateQuestions('/questions/published', 'questions').then(q => { res.send('Question Count: ' + q) });
            break;
        case 'unpublished_questions':
            // Migrate unpublished questions
            console.log('Migrating unpublished questions ...');
            migration.migrateQuestions('/questions/unpublished', 'unpublished_questions').then(q => { res.send('Question Count: ' + q) });
            break;
    }

    res.send('Check firestore db for migration details');
};


/**
 * migrateProdCollectionsToDev
 * return status
 */
exports.migrateProdCollectionsToDev = (req, res) => {
    console.log(req.params.collectionName);
    generalService.migrateCollection(req.params.collectionName).then((status) => {
        res.send(status);
    });
};


/**
 * rebuildQuestionIndex
 * return status
 */
exports.rebuildQuestionIndex = (req, res) => {
    generalService.rebuildQuestionIndex().then((status) => {
        res.send(status);
    });
};


/**
 * helloOperation
 * return status
 */
exports.helloOperation = (req, res) => {
    res.send(`Hello ${req.user.email}`);
};


/**
 * getTestQuestion
 * return status
 */
exports.getTestQuestion = (req, res) => {
    generalService.getTestQuestion().then((question) => {
        res.send(question);
    });
};


/**
 * getGameQuestionTest
 * return status
 */
exports.getGameQuestionTest = (req, res) => {
    generalService.getGameQuestionTest().then((question) => {
        res.send(question);
    });
};


/**
 * getGameQuestionTest
 * return status
 */
exports.testES = (req, res) => {
    generalService.testES(res);
};


/**
 * generateUsersStat
 * return status
 */
exports.generateUsersStat = (req, res) => {
    const gameLeaderBoardStats: GameLeaderBoardStats = new GameLeaderBoardStats();
    gameLeaderBoardStats.generateGameStats().then((gameResults) => {
        res.send('updated stats');
    });
};


/**
 * generateLeaderBoardStat
 * return status
 */
exports.generateLeaderBoardStat = (req, res) => {
    const gameLeaderBoardStats: GameLeaderBoardStats = new GameLeaderBoardStats();
    gameLeaderBoardStats.calculateGameLeaderBoardStat().then((gameResults) => {
        res.send('updated stats');
    });
};


/**
 * generateUserContributionStat
 * return status
 */
exports.generateUserContributionStat = (req, res) => {
    const userContributionStat: UserContributionStat = new UserContributionStat();
    userContributionStat.generateGameStats().then((userDictResults) => {
        res.send('updated user category stat');
    });
};
