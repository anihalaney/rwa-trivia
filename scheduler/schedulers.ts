import { schedulerConstants } from './constants';
import { appConstants } from 'shared-library/shared/model';

const cron = require('node-cron');
const https = require('https');

export class GameScheduler {


    constructor() {
    }


    checkGames(token: string, envAppName: string): any {

        const options = {
            host: `${schedulerConstants.domainZone}-${envAppName}${schedulerConstants.extensionName}`,
            port: schedulerConstants.port,
            method: 'POST',
            path: `/${appConstants.API_VERSION}/${schedulerConstants.gameOverApiPath}`,
            headers: {
                'token': token
            }
        };

        cron.schedule(schedulerConstants.cronExpression, function () {
            const post_request = https.request(options, (resp) => {
                console.log('STATUS: ' + resp.statusCode);

                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    console.log('data--->', data);
                });

            }).on('error', (err) => {
                console.log('Error: ' + err.message);
            });
            // post the data
            post_request.write('');
            post_request.end();
        });
    }


    changeTheTurn(token: string, envAppName: string): any {

        const options = {
            host: `${schedulerConstants.domainZone}-${envAppName}${schedulerConstants.extensionName}`,
            port: schedulerConstants.port,
            method: 'POST',
            path: `/${appConstants.API_VERSION}/${schedulerConstants.turnChangeApiPath}`,
            headers: {
                'token': token
            }
        };

        cron.schedule(schedulerConstants.turnCronExpression, function () {
            const post_request = https.request(options, (resp) => {
                console.log('STATUS: ' + resp.statusCode);

                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    console.log('data--->', data);
                });

            }).on('error', (err) => {
                console.log('Error: ' + err.message);
            });
            // post the data
            post_request.write('');
            post_request.end();
        });
    }

}
