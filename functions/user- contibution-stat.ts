import {
    Game, GameStatus, GameOptions, PlayerMode, OpponentType, Stat, User, UserStats,
    LeaderBoardUser, UserStatConstants,
    Question
} from '../src/app/model';


export class UserContributionStat {


    private db: any


    constructor(private firebaseDB?: any) {
        this.db = firebaseDB;
    }


    generateGameStats(): Promise<any> {
        return this.db.collection('questions')
            .get()
            .then(questions => {
                const userDict = [];
                questions.docs.map(question => {
                    const mappedQuestion: Question = question.data();
                    const created_uid = mappedQuestion.created_uid;
                    userDict[created_uid] = (userDict[created_uid]) ? userDict[created_uid] + 1 : 1;
                });
                return userDict;
            })
            .then(userDict => {
                const userDictPromises = [];
                Object.keys(userDict).map(userId => {
                    userDictPromises.push(this.getUser(userId, userDict[userId]))
                });

                return Promise.all(userDictPromises)
                    .then((userDictResults) => {
                        return userDictResults;
                    })
                    .catch((e) => {
                        console.log('user categories stats promise error', e);
                    });
            });


    }

    private getUser(userId: string, count: number): Promise<string> {
        return this.db.doc(`/users/${userId}`).get().then((user) => {
            const dbUser = user.data();
            dbUser.stats.contribution = count;
            return this.updateUser({ ...dbUser }).then((id) => {
                return id
            });
        })
    }

    private updateUser(dbUser: any): Promise<string> {
        return this.db.doc('/users/' + dbUser.userId).set(dbUser).then(ref => {
            return dbUser.userId;
        });
    }

}
