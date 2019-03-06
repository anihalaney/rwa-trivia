import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { SocialShareConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';

export class SocialService {
    private static bucket = admin.storage().bucket();
    /**
     * generateSocialUrl
     * return ref
     */
    static async generateSocialUrl(userId: string, social_share_id: string): Promise<any> {
        const fileName = `${SocialShareConstants.SOCIAL_SHARE}${GeneralConstants.FORWARD_SLASH}${userId}${GeneralConstants.FORWARD_SLASH}${SocialShareConstants.SCORE_IMAGES}${GeneralConstants.FORWARD_SLASH}${social_share_id}`;
        const file = this.bucket.file(fileName);
        try {
            const signedUrls = await file.download();
            return signedUrls[0];
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
