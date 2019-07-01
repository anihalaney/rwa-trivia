import admin from '../db/firebase.client';

export class AuthMiddleware {

    static async validateFirebaseIdToken(req, res, next) {

        // Get user from auth headers.
        // If found set req.user
        // If not found, go to next middleware, the next middleware needs to check for req.user to allow/deny unauthorized access

        // console.log('Check if request is authorized with Firebase ID token');
        if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
            !req.cookies.__session && !req.headers.token) {
            console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
                'Make sure you authorize your request by providing the following HTTP header:',
                'Authorization: Bearer <Firebase ID Token>',
                'or by passing a "__session" cookie.');
            // res.status(403).send('Unauthorized');
            return next();
        }

        let idToken;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            console.log('Found "Authorization" header');
            // Read the ID Token from the Authorization header.
            idToken = req.headers.authorization.split('Bearer ')[1];
        } else if (req.headers.token || req.body.token) {
            console.log('token', req.headers.token);
            return next();
        } else {
            console.log('Found "__session" cookie');
            // Read the ID Token from cookie.
            idToken = req.cookies.__session;
        }

        if (idToken) {
            try {
                const decodedIdToken = await admin.auth().verifyIdToken(idToken);
                console.log('ID Token correctly decoded', decodedIdToken);
                req.user = decodedIdToken;
                return next();

            } catch (error) {
                console.error('Error while verifying Firebase ID token:', error);
               return res.status(419).send('Token Expired');
            }
        }
    }

    static async authTokenOnly(req, res, next) {
        const token = req.headers.token || req.body.token;
        if (!token) {
            return res.status(401).send('Unauthorized');
        }
        try {
            const snapshot = await admin.firestore().collection('scheduler_auth_tokens')
                .where('token', '==', token).get();

            if (snapshot.size > 0) {
                return next();
            } else {
                return res.status(401).send('Unauthorized');
            }

        } catch (error) {
            console.error('Error : ', error);
            return res.status(401).send('Unauthorized');
        }
    }


    // middleware to check for authorized users

    /**
     *  Route middleware to ensure user is authenticated.
     */
    static authorizedOnly(req, res, next) {
        if (!req.user || !req.user.uid) {
            console.error('User not authenticated');
            return res.status(403).send('Unauthorized');
        }
        return next();
    }

    /**
     *  Route middleware to ensure user is admin only.
     */
    static async adminOnly(req, res, next) {
        if (!req.user || !req.user.uid) {
            console.error('User not authenticated');
            return res.status(401).send('Unauthenticated');
        }
        try {
            const user = (await admin.firestore().doc(`/users/${req.user.uid}`).get()).data();
            if (user.roles && user.roles.admin) {
                return next();
            } else {
                console.error('Not an admin: ', req.user.uid);
                return res.status(403).send('Unauthorized');
            }

        } catch (error) {
            console.error('Error : ', error);
            return res.status(403).send('Unauthorized');
        }
    }

}




