import {
    Game, Blog, interceptorConstants, ResponseMessagesConstants, schedulerConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { BlogService } from '../services/blog.service';
import { GameService } from '../services/game.service';
import { GameMechanics } from '../utils/game-mechanics';
import { AppSettings } from '../services/app-settings.service';
import { AccountService } from '../services/account.service';
import { Utils } from '../utils/utils';
const Feed = require('feed-to-json');

export class SchedulerController {

    /* checkGameOver
    * return status
    */
    static async checkGameOver(req, res) {
        try {
            await GameMechanics.doGameOverOperations();
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.SCHEDULER_CHECK_GAME_OVER_IS_COMPLETED);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
     * checkGameTurn
     * return status
     */
    static async changeGameTurn(req, res) {
        try {
            const games: Game[] = await GameService.checkGameOver();
            const promises = [];
            for (const game of games) {
                promises.push(GameMechanics.changeTheTurn(game));
            }
            await Promise.all(promises);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.SCHEDULER_CHANGE_GAME_TURN_IS_COMPLETED);

        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    // Schedular for add lives
    static async addLives(req, res): Promise<any> {

        try {
            const appSetting = await AppSettings.Instance.getAppSettings();
            if (appSetting.lives.enable) {
                Utils.sendResponse(res, interceptorConstants.SUCCESS, await AccountService.addLives());
            } else {
                Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.LIVE_FEATURES_IS_NOT_ENABLED);
            }

        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
      * generateBlogsData
      * return status
      */
    static async generateBlogsData(req, res): Promise<any> {
        try {
            const blogs: Array<Blog> = [];

            Feed.load(Utils.getFeedUrl(), async (err, rss) => {

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
                    delete blog[schedulerConstants.DESCRIPTION];
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
                    Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.CREATED_FEED_BLOGS);
                } else {
                    Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.BLOGS_NOT_AVAILABLE);
                }
            });
        } catch (error) {
            Utils.sendError(res, error);
        }
    }
}
