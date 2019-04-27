import { AccountBase } from '../../projects/shared-library/src/lib/shared/model';

export class AccountAtomic extends AccountBase {
    leaderBoardStats?: { [key: number]: any };
    gamePlayed?: any;
    wins?: any;
    losses?: any;
    contribution?: any;
    badges?: any;

    constructor() {
        super();
        this.leaderBoardStats = {};
    }
}
