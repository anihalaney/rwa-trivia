const socialFireBaseClient = require('../db/firebase-client');
const bucket = socialFireBaseClient.storage().bucket();


/**
 * setBlog
 * return ref
 */
exports.generateSocialUrl = (userId: string, social_share_id: string): Promise<string> => {
    const fileName = `social_share/${userId}/score_images/${social_share_id}`;
    const file = bucket.file(fileName);
    return file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    }).then(signedUrls => {
        return signedUrls[0];
    })
};
