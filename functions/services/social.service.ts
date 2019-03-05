import admin from '../db/firebase.client';


export class SocialService {
    private static bucket = admin.storage().bucket();
    
    /**
     * generateSocialUrl
     * return ref
     */
    static async generateSocialUrl(userId: string, social_share_id: string): Promise<any> {
        const fileName = `social_share/${userId}/score_images/${social_share_id}`;
        const file = this.bucket.file(fileName);
        try {
            let signedUrls = await file.download();
            return signedUrls[0];
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    };

}