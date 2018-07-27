const socialFireBaseClient = require('../db/firebase-client');
const bucket = socialFireBaseClient.storage().bucket();


/**
 * generateSocialUrl
 * return ref
 */
exports.generateSocialUrl = (userId: string, social_share_id: string): Promise<any> => {
    const fileName = `social_share/${userId}/score_images/${social_share_id}`;
    const file = bucket.file(fileName);
    return file.download().then(signedUrls => {
        return signedUrls[0];
    }).catch(error => {
        console.log('error', error);
        return error;
    })
};
