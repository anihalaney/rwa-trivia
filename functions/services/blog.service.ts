const blogFireBaseClient = require('../db/firebase-client');
const blogFireStoreClient = blogFireBaseClient.firestore();
import { Blog } from '../../src/app/model';

/**
 * setBlog
 * return ref
 */
exports.setBlog = (blogs: Array<Blog>): Promise<any> => {
    const batch = blogFireStoreClient.batch();
    blogs.map((blog) => {
        const pub_date = new Date(blog.pubDate).getTime() + '';
        const blogInstance = blogFireStoreClient.collection('blogs').doc(pub_date);
        batch.set(blogInstance, blog);
    })
    return batch.commit().then((ref) => { return ref });
};


exports.deleteBlog = (): Promise<any> => {
    const batch = blogFireStoreClient.batch();
    return blogFireStoreClient.collection('blogs').get().then((qs) => {
        qs.forEach(doc => batch.delete(doc.ref));
        return batch.commit().then((res) => { return res });
    });
};
