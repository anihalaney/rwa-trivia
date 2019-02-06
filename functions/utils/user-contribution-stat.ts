import {
    User, Question, UserStatConstants
} from '../../projects/shared-library/src/lib/shared/model';
const userContributionQuestionService = require('../services/question.service');
const userContributionUserService = require('../services/user.service');
const userContributionAccountService = require('../services/account.service');

export class UserContributionStat {


    private userDict: { [key: string]: number };

    constructor() {
        this.userDict = {};
    }

    generateGameStats(): Promise<any> {
        return userContributionQuestionService.getAllQuestions()
            .then(questions =>
                questions.docs.map(question =>
                    this.userDict[question.data().created_uid] = (this.userDict[question.data().created_uid]) ?
                        this.userDict[question.data().created_uid] + UserStatConstants.initialContribution :
                        UserStatConstants.initialContribution
                )
            )
            .then(userDict => {
                const userDictPromises = [];
                Object.keys(this.userDict).map(userId => {
                    userDictPromises.push(this.getUser(userId, this.userDict[userId]))
                });

                return Promise.all(userDictPromises)
                    .then((userDictResults) => userDictResults)
                    .catch((e) => {
                        console.log('user categories stats promise error', e);
                    });
            });

    }

    public getUser(id: string, count: number): Promise<string> {
        return userContributionAccountService.getAccountById(id).then((account) => {
            const dbAccount = account.data();
            dbAccount.contribution = (dbAccount.contribution) ? dbAccount.contribution + count : count;
            return this.updateAccount({ ...dbAccount }).then((accountId) => { return accountId });
        });
    }

    private updateAccount(dbAccount: any): Promise<string> {
        return userContributionAccountService.setAccount(dbAccount).then(ref => { return dbAccount.id });
    }



}
