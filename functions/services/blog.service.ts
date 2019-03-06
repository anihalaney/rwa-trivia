import { Blog, CollectionConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

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
                const blogInstance = this.blogFireStoreClient.collection(CollectionConstants.BLOGS).doc(pub_date);
                batch.set(blogInstance, blog);
            }
            return await batch.commit();
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
