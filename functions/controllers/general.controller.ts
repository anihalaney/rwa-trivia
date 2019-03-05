import { Blog, RSSFeedConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { AppSettings } from '../services/app-settings.service';
import { BlogService } from '../services/blog.service';
import { GeneralService } from '../services/general.service';
const Feed = require('feed-to-json');

export class GeneralController {

    private static appSettings: AppSettings = new AppSettings();



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



}
