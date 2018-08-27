const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const mailConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../config/mail.config.json'), 'utf8'));
import { TriggerConstants } from '../../projects/shared-library/src/lib/shared/model';

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

    sendMail() {

        // send mail with defined transport object
        this.transporter.sendMail(this.mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });

    }
}
