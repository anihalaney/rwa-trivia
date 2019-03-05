import { GeneralService } from '../services/general.service';
const blogService = require('../services/blog.service');
const Feed = require('feed-to-json');
import { RSSFeedConstants, Blog } from '../../projects/shared-library/src/lib/shared/model';


export class GeneralController {

    /**
     * helloOperation
     * return status
     */
    static helloOperation(req, res) {
        res.send(`Hello ${req.user.email}`);
    }


    /**
     * getTestQuestion
     * return status
     */
    static async getTestQuestion (req, res): Promise<any> {
        try {
            res.send(await  GeneralService.getTestQuestion());
        } catch (error) {
            console.error(error);
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
            res.send(await  GeneralService.getGameQuestionTest());
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }


    /**
     * getGameQuestionTest
     * return status
     */
    static testES (req, res) {
        GeneralService.testES(res);
    }

    /**
     * generateBlogsData
     * return status
     */
    static async generateBlogsData(req, res): Promise<any> {
        try {
            const blogs: Array<Blog> = [];

            Feed.load(RSSFeedConstants.feedURL, function (err, rss) {

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
                }
                console.log('blogs', blogs);

                const ref1 = blogService.setBlog(blogs);
                if (ref1) {
                    res.send('created feed blogs');
                } else {
                    res.status(500).send('Internal Server error');
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

}
