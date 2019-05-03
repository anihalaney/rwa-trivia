import { AccountBase } from '../../projects/shared-library/src/lib/shared/model';
import { FieldValue } from '@google-cloud/firestore';

export class AccountAtomic extends AccountBase {
    leaderBoardStats?: { [key: number]: any };
    gamePlayed?: number;
    wins?: number;
    losses?: number;
    contribution?: number;

    constructor() {
        super();
        this.leaderBoardStats = {};
    }
}
