import {
    User, Question, UserStatConstants
} from '../../projects/shared-library/src/lib/shared/model';
const userContributionQuestionService = require('../services/question.service');
const userContributionUserService = require('../services/user.service');

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

    public getUser(userId: string, count: number): Promise<string> {
        return userContributionUserService.getUserById(userId).then((user) => {
            const dbUser = user.data();
            dbUser.stats.contribution = (dbUser.stats.contribution) ? dbUser.stats.contribution + count : count;
            return this.updateUser({ ...dbUser }).then((id) => { return id });
        })
    }

    private updateUser(dbUser: any): Promise<string> {
        return userContributionUserService.setUser(dbUser).then(ref => { return dbUser.userId });
    }

}
