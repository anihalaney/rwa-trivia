import { Account, Blog, Question, RSSFeedConstants, User } from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { AppSettings } from '../services/app-settings.service';
import { GeneralService } from '../services/general.service';
import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';
import { AuthUser } from '../utils/auth-user';
import { BulkUploadUpdate } from '../utils/bulk-upload-update';
import { FirestoreMigration } from '../utils/firestore-migration';
import { GameLeaderBoardStats } from '../utils/game-leader-board-stats';
import { ProfileImagesGenerator } from '../utils/profile-images-generator';
import { QuestionBifurcation } from '../utils/question-bifurcation';
import { SystemStatsCalculations } from '../utils/system-stats-calculations';
import { UserContributionStat } from '../utils/user-contribution-stat';
import { BlogService } from '../services/blog.service';
const Feed = require('feed-to-json');


export class GeneralController {

    private static appSettings: AppSettings = new AppSettings();

    /**
     * migrateCollections
     * return status
     */
    static async migrateCollections(req, res): Promise<any> {

        try {
            console.log(req.params.collectionName);

            switch (req.params.collectionName) {
                case 'categories':
                    // Migrate categories
                    console.log('Migrating categories ...');
                    res.send(await FirestoreMigration.migrateCategories());
                    break;
                case 'tags':
                    // Migrate Tags
                    console.log('Migrating tags ...');
                    res.send(await FirestoreMigration.migrateTags());
                    break;
                case 'games':
                    // Migrate games
                    console.log('Migrating games ...');
                    res.send('Game Count: ' + await FirestoreMigration.migrateGames('/games', 'games'));
                    break;
                case 'questions':
                    // Migrate questions
                    console.log('Migrating questions ...');
                    res.send('Question Count: ' + await FirestoreMigration.migrateQuestions('/questions/published', 'questions'));
                    break;
                case 'unpublished_questions':
                    // Migrate unpublished questions
                    console.log('Migrating unpublished questions ...');
                    res.send('Question Count: ' +
                        await FirestoreMigration.migrateQuestions('/questions/unpublished', 'unpublished_questions'));
                    break;
            }

            res.status(200).send('Check firestore db for migration details');

        } catch (error) {
            console.error('Error : ', error);
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
            res.status(200).send(await GeneralService.migrateCollection(req.params.collectionName));
        } catch (error) {
            console.error('Error : ', error);
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
            res.status(200).send(await GeneralService.rebuildQuestionIndex());
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }


    /**
     * helloOperation
     * return status
     */
    static helloOperation(req, res) {
        res.status(200).send(`Hello ${req.user.email}`);
    }


    /**
     * getTestQuestion
     * return status
     */
    static async getTestQuestion(req, res): Promise<any> {
        try {
            res.status(200).send(await GeneralService.getTestQuestion());
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }

    }


    /**
     * getGameQuestionTest
     * return status
     */
    static async getGameQuestionTest(req, res): Promise<any> {
        try {
            res.status(200).send(await GeneralService.getGameQuestionTest());
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }


    /**
     * getGameQuestionTest
     * return status
     */
    static testES(req, res) {
        GeneralService.testES(res);
    }


    /**
     * generateUsersStat
     * return status
     */
    static async generateUsersStat(req, res): Promise<any> {

        try {
            await GameLeaderBoardStats.generateGameStats();
            res.status(200).send('updated stats');
        } catch (error) {
            console.error('Error : ', error);
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
            res.status(200).send('updated stats');
        } catch (error) {
            console.error('Error : ', error);
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
            await UserContributionStat.generateGameStats();
            res.status(200).send('updated user category stat');
        } catch (error) {
            console.error('Error : ', error);
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
            await SystemStatsCalculations.generateSystemStats();
            res.status(200).send('updated system stat');
        } catch (error) {
            console.error('Error : ', error);
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
            await BulkUploadUpdate.getUserList();
            res.status(200).send('updated bulk upload collection');
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

    /**
     * generateBlogsData
     * return status
     */
    static async generateBlogsData(req, res): Promise<any> {
        try {
            const blogs: Array<Blog> = [];

            Feed.load(RSSFeedConstants.feedURL, async (err, rss) => {

                let index = 0;
                let viewCount = 100;
                let commentCount = 5;
                let items = rss.items.sort((itemA: Blog, itemB: Blog) => {
                    return new Date(itemB.pubDate).getTime() - new Date(itemA.pubDate).getTime();
                });
                items = items.slice(0, 3);
                for (const item of items) {
                    const blog: Blog = item;
                    blog.blogNo = index;
                    blog.commentCount = commentCount;
                    blog.viewCount = viewCount;
                    blog.share_status = false;
                    delete blog['description'];
                    const result = blog.content.match(/<p>(.*?)<\/p>/g).map((val) => {
                        return val.replace(/<\/?p>/g, '');
                    });
                    let subtitle = result[0];
                    if (subtitle.includes('<em>')) {
                        const result1 = subtitle.match(/<em>(.*?)<\/em>/g).map((val) => {
                            return val.replace(/<\/?em>/g, '');
                        });
                        subtitle = result1[0];
                    }

                    blog.subtitle = subtitle;
                    blogs.push({ ...blog });
                    index++;
                    viewCount = viewCount + Math.floor((Math.random() * 100) + 1);
                    commentCount = commentCount + Math.floor((Math.random() * 5) + 1);
                }
                console.log('blogs', blogs);

                const ref1 = await BlogService.setBlog(blogs);
                if (ref1) {
                    res.status(200).send('created feed blogs');
                } else {
                    res.status(500).send('Internal Server error');
                }
            });
        } catch (error) {
            console.error('Error : ', error);
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

            switch (req.params.collectionName) {
                case 'questions':
                    console.log('Updating questions ...');
                    await QuestionBifurcation.getQuestionList(req.params.collectionName);
                    res.status(200).send('updated question collection');
                    break;
                case 'unpublished_questions':
                    console.log('Updating unpublished questions ...');
                    await QuestionBifurcation.getQuestionList(req.params.collectionName);
                    res.status(200).send('updated unpublished question collection');
                    break;
            }

        } catch (error) {
            console.error('Error : ', error);
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
            const users = await AuthUser.getUsers(authUsers);
            console.log('users', users);
            await UserService.addUpdateAuthUsersToFireStore(users);
            res.status(200).send('dumped all the users');

        } catch (error) {
            console.error('Error : ', error);
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
            res.status(200).send(await ProfileImagesGenerator.fetchUsers());
        } catch (error) {
            console.error('Error : ', error);
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
            res.status(200).send(await Promise.all(migrationPromises));
        } catch (error) {
            console.error('Error : ', error);
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
                return res.status(200).send(msg);

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

    // Schedular for add lives
    static async addLives(req, res): Promise<any> {
        try {
            const appSetting = await this.appSettings.getAppSettings();
            if (appSetting.lives.enable) {
                return res.status(200).send(AccountService.addLives());
            }
            res.status(200).send('live feature is not enabled');
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
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
            res.status(200).send(await Promise.all(updatePromises));
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

    static async removeSocialProfile(req, res): Promise<any> {
        try {
            res.status(200).send(await UserService.removeSocialProfile());
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

}
