import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { TriggerConstants } from '../../projects/shared-library/src/lib/shared/model';

const mailConfig = JSON.parse(readFileSync(resolve(__dirname, '../../../config/mail.config.json'), 'utf8'));
export class MailClient {

    transporter: any;
    mailOptions: any;

    constructor(private to: string, private subject: string, private text?: string, private html?: any) {

        // create reusable transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport(Object.assign({}, mailConfig));


        // setup email data with unicode symbols
        this.mailOptions = {
            from: TriggerConstants.fromUser, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
        };

        if (text) {
            this.mailOptions.text = text;
        }

        if (html) {
            this.mailOptions.html = html;

        }

    }

    async sendMail(): Promise<any> {

        try {
            // send mail with defined transport object
            return await this.transporter.sendMail(this.mailOptions);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }

    }
}
