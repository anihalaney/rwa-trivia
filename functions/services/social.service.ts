import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { SocialShareConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';

export class SocialService {

    private static bucket: any;
    private static FS = GeneralConstants.FORWARD_SLASH;
    private static SI = SocialShareConstants.SCORE_IMAGES;
    private static SS = SocialShareConstants.SOCIAL_SHARE;

    /**
     * generateSocialUrl
     * return ref
     */
    static async generateSocialUrl(userId: string, social_share_id: string): Promise<any> {
        const fileName = `${SocialService.SS}${SocialService.FS}${userId}${SocialService.FS}${SocialService.SI}${SocialService.FS}${social_share_id}`;
        SocialService.bucket = admin.storage().bucket();
        const file = SocialService.bucket.file(fileName);
        try {
            const signedUrls = await file.download();
            return signedUrls[0];
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
