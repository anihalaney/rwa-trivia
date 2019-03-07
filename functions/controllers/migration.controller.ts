import { GeneralService } from '../services/general.service';
import { UserService } from '../services/user.service';
import { QuestionService } from '../services/question.service';
import { AccountService } from '../services/account.service';
import { FirestoreMigration } from '../utils/firestore-migration';
import { GameLeaderBoardStats } from '../utils/game-leader-board-stats';
import { UserContributionStat } from '../utils/user-contribution-stat';
import { SystemStatsCalculations } from '../utils/system-stats-calculations';
import { ProfileImagesGenerator } from '../utils/profile-images-generator';
import { BulkUploadUpdate } from '../utils/bulk-upload-update';
import {
    User, Account, Question, interceptorConstants,
    GeneralConstants, CollectionConstants, ResponseMessagesConstants, MigrationConstants, HeaderConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { QuestionBifurcation } from '../utils/question-bifurcation';
import { AuthUser } from '../utils/auth-user';
import { appSettings } from '../services/app-settings.service';
import { GameService } from '../services/game.service';
import { Utils } from '../utils/utils';

export class MigrationController {


    private static FS = GeneralConstants.FORWARD_SLASH;
    private static QC = CollectionConstants.QUESTIONS;

    /**
     * migrateCollections
     * return status
     */
    static async migrateCollections(req, res): Promise<any> {

        try {
            console.log(req.params.collectionName);

            switch (req.params.collectionName) {
                case MigrationConstants.CATEGORIES:
                    // Migrate categories
                    console.log('Migrating categories ...');
                    Utils.sendResponse(res, interceptorConstants.SUCCESS, await FirestoreMigration.migrateCategories());
                    break;
                case MigrationConstants.TAGS:
                    // Migrate Tags
                    console.log('Migrating tags ...');
                    Utils.sendResponse(res, interceptorConstants.SUCCESS, await FirestoreMigration.migrateTags());
                    break;
                case MigrationConstants.GAMES:
                    // Migrate games
                    console.log('Migrating games ...');
                    Utils.sendResponse(res, interceptorConstants.SUCCESS,
                        'Game Count: ' + await FirestoreMigration.
                            migrateGames(`${this.FS}${CollectionConstants.GAMES}`, CollectionConstants.GAMES));
                    break;
                case MigrationConstants.QUESTIONS:
                    // Migrate questions
                    console.log('Migrating questions ...');
                    Utils.sendResponse(res, interceptorConstants.SUCCESS,
                        await FirestoreMigration.
                            migrateQuestions(`${this.FS}${this.QC}${this.FS}${CollectionConstants.PUBLISHED}`,
                                this.QC));
                    break;
                case MigrationConstants.UNPUBLISHED_QUESTIONS:
                    // Migrate unpublished questions
                    console.log('Migrating unpublished questions ...');
                    Utils.sendResponse(res, interceptorConstants.SUCCESS,
                        await FirestoreMigration.migrateQuestions(`${this.FS}${this.QC}${this.FS}${CollectionConstants.UNPUBLISHED}`,
                            CollectionConstants.UNPUBLISHED_QUESTIONS));
                    break;
            }

            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.CHECK_FIRESTORE_DB_FOR_MIGRATION_DETAILS);

        } catch (error) {
            Utils.sendError(res, error);
        }
    }


    /**
     * migrateProdCollectionsToDev
     * return status
     */
    static async migrateProdCollectionsToDev(req, res): Promise<any> {
        try {
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await GeneralService.migrateCollection(req.params.collectionName));
        } catch (error) {
            Utils.sendError(res, error);
        }
    }


    /**
     * rebuildQuestionIndex
     * return status
     */
    static async rebuildQuestionIndex(req, res): Promise<any> {
        try {
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await GeneralService.rebuildQuestionIndex());
        } catch (error) {
            Utils.sendError(res, error);
        }
    }
    /**
     * generateUsersStat
     * return status
     */
    static async generateUsersStat(req, res): Promise<any> {

        try {
            await GameLeaderBoardStats.generateGameStats();
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.UPDATED_STATS);
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
            return error;
        }

    }


    /**
     * generateLeaderBoardStat
     * return status
     */
    static async generateLeaderBoardStat(req, res): Promise<any> {
        try {
            await GameLeaderBoardStats.calculateGameLeaderBoardStat();
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.UPDATED_STATS);
        } catch (error) {
            Utils.sendError(res, error);
        }

    }


    /**
     * generateUserContributionStat
     * return status
     */
    static async generateUserContributionStat(req, res): Promise<any> {
        try {
            await UserContributionStat.generateGameStats();
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.UPDATED_USER_CATEGORY_STAT);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }


    /**
     * generateSystemStat
     * return status
     */
    static async generateSystemStat(req, res): Promise<any> {
        try {
            await SystemStatsCalculations.generateSystemStats();
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.UPDATED_SYSTEM_STAT);
        } catch (error) {
            Utils.sendError(res, error);
        }

    }

    /**
     * update bulk upload collection by adding isUserArchived or isAdminArchived based on user role
     * return status
     */
    static async updateBulkUploadCollection(req, res): Promise<any> {

        try {
            await BulkUploadUpdate.getUserList();
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.UPDATED_BULK_UPLOAD_COLLECTION);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
     * update bulk upload collection by adding isUserArchived or isAdminArchived based on user role
     * return status
     */
    static async updateQuestionCollection(req, res): Promise<any> {

        try {
            console.log(req.params.collectionName);
            switch (req.params.collectionName) {
                case MigrationConstants.QUESTIONS:
                    console.log('Updating questions ...');
                    await QuestionBifurcation.getQuestionList(req.params.collectionName);
                    Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.UPDATED_QUESTION_COLLECTION);
                    break;
                case MigrationConstants.UNPUBLISHED_QUESTIONS:
                    console.log('Updating unpublished questions ...');
                    await QuestionBifurcation.getQuestionList(req.params.collectionName);
                    Utils.
                        sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.UPDATED_UNPUBLISHED_QUESTION_COLLECTION);
                    break;
            }
        } catch (error) {
            Utils.sendError(res, error);
        }

    }


    /**
     * dumpAuthUsersInFirestore
     * return status
     */
    static async dumpAuthUsersInFirestore(req, res): Promise<any> {

        try {
            const authUsers: User[] = [];
            const users = await AuthUser.getUsers(authUsers);
            console.log('users', users);
            await UserService.addUpdateAuthUsersToFireStore(users);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.DUMPED_ALL_USERS);

        } catch (error) {
            Utils.sendError(res, error);
        }
    }


    /**
     * generateAllUsersProfileImages
     * return status
     */
    static async generateAllUsersProfileImages(req, res): Promise<any> {
        try {
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await ProfileImagesGenerator.fetchUsers());
        } catch (error) {
            Utils.sendError(res, error);
        }
    }


    /**
     * migrateUserStatToAccounts
     * return status
     */
    static async migrateUserStatToAccounts(req, res): Promise<any> {

        try {
            const migrationPromises = [];
            const users: User[] = await UserService.getUsers();
            for (const user of users) {
                if (user && user.userId) {
                    const accountObj: Account = (user.stats) ? user.stats : new Account();
                    accountObj.id = user.userId;
                    migrationPromises.push(AccountService.setAccount({ ...accountObj }));
                }
            }
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await Promise.all(migrationPromises));
        } catch (error) {
            Utils.sendError(res, error);
        }

    }


    /**
     * Add default number of lives to each account
     */
    static async addDefaultLives(req, res): Promise<any> {
        try {
            const appSetting = await appSettings.getAppSettings();
            // Lives setting is enable then add default number of lives into user's account
            if (appSetting.lives.enable) {

                res.setHeader(HeaderConstants.CONTENT_DASH_TYPE, HeaderConstants.TEXT_FORWARD_SLASH_PLAIN);
                const users: User[] = await UserService.getUsers();
                const migrationPromises = [];
                for (const user of users) {
                    if (user && user.userId) {
                        const accountObj: Account = new Account();
                        accountObj.id = user.userId;
                        migrationPromises.push(AccountService.addDefaultLives({ ...accountObj }));
                    }
                }

                await Promise.all(migrationPromises);
                Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.DEFAULT_LIVES_ADDED);

            } else {
                Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.LIVE_FEATURES_IS_NOT_ENABLED);
            }
        } catch (error) {
            Utils.sendError(res, error);
        }
    }



    /**
     * changeQuestionCategoryIdType
     * return status
     */
    static async changeQuestionCategoryIdType(req, res): Promise<any> {
        try {
            const updatePromises = [];
            const questions: Question[] = await QuestionService.getAllQuestions();

            for (const question of questions) {

                const categoryIds = question.categoryIds;
                const updatedCategory = [];
                for (const categoryId of categoryIds) {
                    updatedCategory.push(Number(categoryId));
                }
                question.categoryIds = updatedCategory;

                const dbQuestionObj = { ...question };
                updatePromises.push(QuestionService.updateQuestion(MigrationConstants.QUESTIONS, dbQuestionObj));
            }
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await Promise.all(updatePromises));
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    static async removeSocialProfile(req, res): Promise<any> {
        try {
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await UserService.removeSocialProfile());
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
     * updateAllGame
     * return status
     */
    static async updateAllGame(req, res) {
        try {
            await GameService.updateStats();
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.LOADED_DATA);

        } catch (error) {
            Utils.sendError(res, error);
        }
    }
}
