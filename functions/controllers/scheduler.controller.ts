import {
    Game, Blog, RSSFeedConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { BlogService } from '../services/blog.service';
import { GameService } from '../services/game.service';
import { GameMechanics } from '../utils/game-mechanics';
import { AppSettings } from '../services/app-settings.service';
import { AccountService } from '../services/account.service';
const Feed = require('feed-to-json');
export class SchedulerController {

    private static appSettings: AppSettings = new AppSettings();
    /* checkGameOver
    * return status
    */
    static async checkGameOver(req, res) {
        try {
            await GameMechanics.doGameOverOperations();
        } catch (error) {
            console.error('Error', error);
            return res.status(500).send('There was error running Game OVer scheduler');
        }
        return res.status(200).send('scheduler check game over is completed');
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
        } catch (error) {
            console.error('Error', error);
            return res.status(500).send('There was error running change turn scheduler');
        }
        return res.status(200).send('scheduler change game turn is completed');
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
            console.error('Error', error);
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
            console.error('Error', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }
}
