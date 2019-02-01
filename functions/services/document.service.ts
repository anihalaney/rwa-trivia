const accountFireBaseClient = require('../db/firebase-client');
const accountFireStoreClient = accountFireBaseClient.firestore();
import { Utils } from '../utils/utils';
const utils: Utils = new Utils();

exports.updateAccount = (userId): Promise<any> => {
    const docRef = accountFireStoreClient.collection(`accounts`).doc(userId);

    return docRef.get()
        .then(ref => {
            const timestamp = utils.getUTCTimeStamp();
            if (ref.exists) {
                const lives = ref.data();
                if (lives.lives === 4) {
                    lives.livesUpdatedAt = timestamp;
                }
                lives.lives += -1;
                docRef.update(lives);
            } else {
                docRef.set({ lives: 4, livesCreateAt: timestamp });
            }
        }).catch(function (error) {
            console.log(error.message);
        });
};
