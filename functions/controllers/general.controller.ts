
const generalService = require('../services/general.service');
const blogService = require('../services/blog.service');
const generalUserService = require('../services/user.service');
const Feed = require('feed-to-json');
import { FirestoreMigration } from '../utils/firestore-migration';
import { GameLeaderBoardStats } from '../utils/game-leader-board-stats';
import { UserContributionStat } from '../utils/user-contribution-stat';
import { SystemStatsCalculations } from '../utils/system-stats-calculations';
import { ProfileImagesGenerator } from '../utils/profile-images-generator';
import { BulkUploadUpdate } from '../utils/bulk-upload-update';
import { RSSFeedConstants, Blog, User } from '../../projects/shared-library/src/lib/shared/model';
import { QuestionBifurcation } from '../utils/question-bifurcation';
import { AuthUser } from '../utils/auth-user';

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


/**
 * generateSystemStat
 * return status
 */
exports.generateSystemStat = (req, res) => {
    const systemStatsCalculations: SystemStatsCalculations = new SystemStatsCalculations();
    systemStatsCalculations.generateSystemStats().then((stats) => {
        res.send('updated system stat');
    });
};

/**
 * update bulk upload collection by adding isUserArchived or isAdminArchived based on user role
 * return status
 */
exports.updateBulkUploadCollection = (req, res) => {
    const bulkUploadUpdate: BulkUploadUpdate = new BulkUploadUpdate();
    bulkUploadUpdate.getUserList().then((bulkUploadResults) => {
        res.send('updated bulk upload collection');
    });

}

/**
 * generateBlogsData
 * return status
 */
exports.generateBlogsData = (req, res) => {
    const blogs: Array<Blog> = [];

    Feed.load(RSSFeedConstants.feedURL, function (err, rss) {

        let index = 0;
        let viewCount = 100;
        let commentCount = 5;
        let items = rss.items.sort((itemA: Blog, itemB: Blog) => {
            return new Date(itemB.pubDate).getTime() - new Date(itemA.pubDate).getTime()
        });
        items = items.slice(0, 3);
        items.map((item) => {
            const blog: Blog = item;
            blog.blogNo = index;
            blog.commentCount = commentCount;
            blog.viewCount = viewCount;
            blog.share_status = false;
            delete blog['description'];
            const result = blog.content.match(/<p>(.*?)<\/p>/g).map(function (val) {
                return val.replace(/<\/?p>/g, '');
            });
            let subtitle = result[0];
            if (subtitle.includes('<em>')) {
                const result1 = subtitle.match(/<em>(.*?)<\/em>/g).map(function (val) {
                    return val.replace(/<\/?em>/g, '');
                });
                subtitle = result1[0];
            }

            blog.subtitle = subtitle;
            blogs.push({ ...blog });
            index++;
            viewCount = viewCount + Math.floor((Math.random() * 100) + 1);
            commentCount = commentCount + Math.floor((Math.random() * 5) + 1);
        });
        console.log('blogs', blogs);

        blogService.setBlog(blogs).then((ref1) => {
            res.send('created feed blogs');
        });
    });
};

/**
 * update bulk upload collection by adding isUserArchived or isAdminArchived based on user role
 * return status
 */
exports.updateQuestionCollection = (req, res) => {
    console.log(req.params.collectionName);
    const questionBifurcation: QuestionBifurcation = new QuestionBifurcation();
    switch (req.params.collectionName) {
        case 'questions':
            console.log('Updating questions ...');
            questionBifurcation.getQuestionList(req.params.collectionName).then((bulkUploadResults) => {
                res.send('updated question collection');
            });
            break;
        case 'unpublished_questions':
            console.log('Updating unpublished questions ...');
            questionBifurcation.getQuestionList(req.params.collectionName).then((bulkUploadResults) => {
                res.send('updated unpublished question collection');
            });
            break;
    }

}


/**
 * dumpAuthUsersInFirestore
 * return status
 */
exports.dumpAuthUsersInFirestore = (req, res) => {
    const authUsers: User[] = [];
    const authUser: AuthUser = new AuthUser()
    authUser.getUsers(authUsers).then((users) => {
        console.log('users', users);
        generalUserService.addUpdateAuthUsersToFireStore(users).then((ref) => {
            res.send('dumped all the users');
        });
    })
};


/**
 * generateAllUsersProfileImages
 * return status
 */
exports.generateAllUsersProfileImages = (req, res) => {
    const profileImagesGenerator: ProfileImagesGenerator = new ProfileImagesGenerator();
    profileImagesGenerator.
        fetchUsers().then((status) => {
            res.send(status);
        })
};
