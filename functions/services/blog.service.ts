const blogFireBaseClient = require('../db/firebase-client');
const blogFireStoreClient = blogFireBaseClient.firestore();
import { Blog } from '../../projects/shared-library/src/lib/shared/model';

/**
 * setBlog
 * return ref
 */
exports.setBlog = (blogs: Array<Blog>): Promise<any> => {
    const batch = blogFireStoreClient.batch();
    blogs.map((blog) => {
        const pub_date = new Date(blog.pubDate).getTime() + '';
        blog.id = Number(pub_date);
        const blogInstance = blogFireStoreClient.collection('blogs').doc(pub_date);
        batch.set(blogInstance, blog);
    })
    return batch.commit().then((ref) => { return ref });
};
