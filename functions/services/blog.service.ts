import { Blog } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';

export class BlogService {

    private static blogFireStoreClient = admin.firestore();

    /**
     * setBlog
     * return ref
     */
    static async setBlog(blogs: Array<Blog>): Promise<any> {
        const batch = this.blogFireStoreClient.batch();
        for (const blog of blogs) {
            const pub_date = new Date(blog.pubDate).getTime() + '';
            blog.id = Number(pub_date);
            const blogInstance = this.blogFireStoreClient.collection('blogs').doc(pub_date);
            batch.set(blogInstance, blog);
        }

        try {
            return await batch.commit();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }
}
