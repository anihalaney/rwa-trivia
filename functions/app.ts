import { appConstants } from '../projects/shared-library/src/lib/shared/model';
import * as express from 'express';
import { AuthMiddleware as auth} from './middlewares/auth';
import * as functions from 'firebase-functions';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { router } from './routes/routes';
require('./db/firebase-functions').addMessage(functions);

const app = express();

app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(auth.validateFirebaseIdToken);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static(__dirname + '/../../images'));




app.use((req, res, next) => {
    //  console.log('before', req.url);
    if (req.url.indexOf(`/${appConstants.API_PREFIX}/`) === -1) {
        req.url = `/${appConstants.API_PREFIX}${req.url}`; // prepend '/' to keep query params if any
    }
    //  console.log('after', req.url);
    next();
});

// Routes
app.use(router);

exports.app = functions.https.onRequest(app);
