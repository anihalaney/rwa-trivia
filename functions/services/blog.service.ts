import admin from '../db/firebase.client';
import { Blog } from '../../projects/shared-library/src/lib/shared/model';

export class BlogService {
  private static blogFireStoreClient = admin.firestore();
    /**
     * setBlog
     * return ref
     */
    static async setBlog(blogs: Array<Blog>): Promise<any> {
        try {
        const batch = this.blogFireStoreClient.batch();
        for (const blog of blogs) {
            const pub_date = new Date(blog.pubDate).getTime() + '';
            blog.id = Number(pub_date);
            const blogInstance = this.blogFireStoreClient.collection('blogs').doc(pub_date);
            batch.set(blogInstance, blog);
        }
            return await batch.commit();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
