import {
    User, Question, UserStatConstants
} from '../src/app/model';

export class UserContributionStat {

    private db: any
    private userDict: { [key: string]: number };

    constructor(private firebaseDB?: any) {
        this.db = firebaseDB;
        this.userDict = {};
    }

    generateGameStats(): Promise<any> {
        return this.db.collection('questions')
            .get()
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
        return this.db.doc(`/users/${userId}`).get().then((user) => {
            const dbUser = user.data();
            dbUser.stats.contribution = (dbUser.stats.contribution) ? dbUser.stats.contribution + count : count;
            return this.updateUser({ ...dbUser }).then((id) => { return id });
        })
    }

    private updateUser(dbUser: any): Promise<string> {
        return this.db.doc(`/users/${dbUser.userId}`).set(dbUser).then(ref => { return dbUser.userId });
    }

}
