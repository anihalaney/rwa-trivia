import admin from '../db/firebase.client';
const blogFireStoreClient = admin.firestore();
import { Blog } from '../../projects/shared-library/src/lib/shared/model';

export class BlogService {

    /**
     * setBlog
     * return ref
     */
    static async setBlog(blogs: Array<Blog>): Promise<any> {
        const batch = blogFireStoreClient.batch();
        for (const blog of blogs) {
            const pub_date = new Date(blog.pubDate).getTime() + '';
            blog.id = Number(pub_date);
            const blogInstance = blogFireStoreClient.collection('blogs').doc(pub_date);
            batch.set(blogInstance, blog);
        }

        try {
            return await batch.commit();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}