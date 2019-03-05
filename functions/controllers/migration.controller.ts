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
import { User, Account, Question } from '../../projects/shared-library/src/lib/shared/model';
import { QuestionBifurcation } from '../utils/question-bifurcation';
import { AuthUser } from '../utils/auth-user';
import { AppSettings } from '../services/app-settings.service';


export class MigrationController {

    private static appSettings: AppSettings = new AppSettings();

    /**
     * migrateCollections
     * return status
     */
    static async migrateCollections(req, res): Promise<any> {

        try {
            console.log(req.params.collectionName);
            const migration = new FirestoreMigration();

            switch (req.params.collectionName) {
                case 'categories':
                    // Migrate categories
                    console.log('Migrating categories ...');
                    res.send(await migration.migrateCategories());
                    break;
                case 'tags':
                    // Migrate Tags
                    console.log('Migrating tags ...');
                    res.send(await migration.migrateTags());
                    break;
                case 'games':
                    // Migrate games
                    console.log('Migrating games ...');
                    res.send('Game Count: ' + await migration.migrateGames('/games', 'games'));
                    break;
                case 'questions':
                    // Migrate questions
                    console.log('Migrating questions ...');
                    res.send('Question Count: ' + await migration.migrateQuestions('/questions/published', 'questions'));
                    break;
                case 'unpublished_questions':
                    // Migrate unpublished questions
                    console.log('Migrating unpublished questions ...');
                    res.send('Question Count: ' + await migration.migrateQuestions('/questions/unpublished', 'unpublished_questions'));
                    break;
            }

            res.send('Check firestore db for migration details');

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }


    /**
     * migrateProdCollectionsToDev
     * return status
     */
    static async migrateProdCollectionsToDev(req, res): Promise<any> {
        try {
            console.log(req.params.collectionName);
            res.send( await GeneralService.migrateCollection(req.params.collectionName));
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }


    /**
     * rebuildQuestionIndex
     * return status
     */
    static async rebuildQuestionIndex(req, res): Promise<any> {
        try {
            res.send(await GeneralService.rebuildQuestionIndex());
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    } 
    /**
     * generateUsersStat
     * return status
     */
    static async generateUsersStat(req, res): Promise<any> {

        try {
            const gameLeaderBoardStats: GameLeaderBoardStats = new GameLeaderBoardStats();
            await gameLeaderBoardStats.generateGameStats();
            res.send('updated stats');
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
            const gameLeaderBoardStats: GameLeaderBoardStats = new GameLeaderBoardStats();
            await gameLeaderBoardStats.calculateGameLeaderBoardStat();
            res.send('updated stats');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }

    }


    /**
     * generateUserContributionStat
     * return status
     */
    static async generateUserContributionStat(req, res): Promise<any> {

        try {
            const userContributionStat: UserContributionStat = new UserContributionStat();
            await userContributionStat.generateGameStats();
            res.send('updated user category stat');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }


    /**
     * generateSystemStat
     * return status
     */
    static async generateSystemStat(req, res): Promise<any> {
        try {
            const systemStatsCalculations: SystemStatsCalculations = new SystemStatsCalculations();
            await systemStatsCalculations.generateSystemStats();
            res.send('updated system stat');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }

    }

    /**
     * update bulk upload collection by adding isUserArchived or isAdminArchived based on user role
     * return status
     */
    static async updateBulkUploadCollection(req, res): Promise<any> {

        try {
            const bulkUploadUpdate: BulkUploadUpdate = new BulkUploadUpdate();
            await bulkUploadUpdate.getUserList();
            res.send('updated bulk upload collection');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

    /**
     * update bulk upload collection by adding isUserArchived or isAdminArchived based on user role
     * return status
     */
    static async updateQuestionCollection(req, res): Promise<any> {

        try {
            console.log(req.params.collectionName);
            const questionBifurcation: QuestionBifurcation = new QuestionBifurcation();
            switch (req.params.collectionName) {
                case 'questions':
                    console.log('Updating questions ...');
                    await questionBifurcation.getQuestionList(req.params.collectionName);
                    res.send('updated question collection');
                    break;
                case 'unpublished_questions':
                    console.log('Updating unpublished questions ...');
                    await questionBifurcation.getQuestionList(req.params.collectionName);
                    res.send('updated unpublished question collection');
                    break;
            }

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }

    }


    /**
     * dumpAuthUsersInFirestore
     * return status
     */
    static async dumpAuthUsersInFirestore(req, res): Promise<any> {

        try {
            const authUsers: User[] = [];
            const authUser: AuthUser = new AuthUser();
            const users = await authUser.getUsers(authUsers);
                console.log('users', users);
            await UserService.addUpdateAuthUsersToFireStore(users);
            res.send('dumped all the users');

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }


    /**
     * generateAllUsersProfileImages
     * return status
     */
    static async generateAllUsersProfileImages(req, res): Promise<any> {
        try {
            const profileImagesGenerator: ProfileImagesGenerator = new ProfileImagesGenerator();
            res.send(await profileImagesGenerator.fetchUsers());
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }


    /**
     * migrateUserStatToAccounts
     * return status
     */
    static async migrateUserStatToAccounts(req, res): Promise<any> {

        try {
            const migrationPromises = [];
            const users = await UserService.getUsers();
            for (const user of users.docs) {
                const userObj: User = user.data();
                if (userObj && userObj.userId) {
                    const accountObj: Account = (userObj.stats) ? userObj.stats : new Account();
                    accountObj.id = userObj.userId;
                    migrationPromises.push(AccountService.setAccount({ ...accountObj }));
                }
            }
            res.send(await Promise.all(migrationPromises));
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
            return error;
        }

    }


    /**
     * Add default number of lives to each account
     */
    static async addDefaultLives(req, res): Promise<any> {
        let isStreaming = false;
        try {
            const appSetting = await this.appSettings.getAppSettings();
            // Lives setting is enable then add default number of lives into user's account
            if (appSetting.lives.enable) {
                isStreaming = true;
                res.setHeader('Content-Type', 'text/plain');
                const users = await UserService.getUsers();
                const migrationPromises = [];
                for (const user of users.docs) {
                    const userObj: User = user.data();
                    if (userObj && userObj.userId) {
                        const accountObj: Account = new Account();
                        accountObj.id = userObj.userId;
                        migrationPromises.push(AccountService.addDefaultLives({ ...accountObj }));
                        const successMessage = `Added default lives for user :  ${accountObj.id}`;
                        console.log(successMessage);
                        res.write(successMessage);
                    }
                }

                await Promise.all(migrationPromises);
                const msg = 'Default lives added successfully';
                console.log(msg);
                return res.end(msg);

            } else {
                res.status(200).send('live feature is not enabled');
            }
        } catch (error) {
            if (isStreaming) {
                console.log('Error while adding default lives ', error.toString());
                return res.end(error.toString());

            } else {
                return res.status(500).send(error);
            }


        }
    }



    /**
     * changeQuestionCategoryIdType
     * return status
     */
    static async changeQuestionCategoryIdType(req, res): Promise<any> {
        try {
            const updatePromises = [];
            const questions = await QuestionService.getAllQuestions();

            for (const question of questions.docs) {
                const questionObj: Question = question.data();
                console.log('questionObj.categoryIds', questionObj.categoryIds);
                const categoryIds = questionObj.categoryIds;
                const updatedCategory = [];
                for (const categoryId of categoryIds) {
                    updatedCategory.push(Number(categoryId));
                }
                questionObj.categoryIds = updatedCategory;
                console.log('updatedCategory', updatedCategory);
                const dbQuestionObj = { ...questionObj };
                updatePromises.push(QuestionService.updateQuestion('questions', dbQuestionObj));
            }
            res.send(await Promise.all(updatePromises));
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

    static async removeSocialProfile(req, res): Promise<any> {
        try {
            res.status(200).send(await UserService.removeSocialProfile());
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

}
