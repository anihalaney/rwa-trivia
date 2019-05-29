import { appConstants } from '../projects/shared-library/src/lib/shared/model';
import * as express from 'express';
import { AuthMiddleware as auth } from './middlewares/auth';
import * as functions from 'firebase-functions';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import rootRouter from './routes/root-routes';
import { FirebaseFunctions } from './db/firebase.functions';



class App {
    public app: any;
    public appFunction: any;

    constructor() {
        FirebaseFunctions.addMessage(functions);
        this.app = express();
        this.app.use(cors({ origin: true }));
        this.app.use(cookieParser());
        this.app.use(auth.validateFirebaseIdToken);
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use('/images', express.static(__dirname + '/../../images'));
        this.app.use((req, res, next) => {

            // console.log('before', req.url);
            req.url = req.url.slice(req.url.indexOf(appConstants.API_VERSION) - 1);
            req.url = `/${appConstants.API_PREFIX}${req.url}`; // prepend '/' to keep query params if any
            // console.log('after', req.url);
            next();
        });
        // Routes
        this.app.use(rootRouter);
        this.appFunction = functions.https.onRequest(this.app);

    }
}

exports.app = new App().appFunction;

