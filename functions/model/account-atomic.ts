import { AccountBase } from '../../projects/shared-library/src/lib/shared/model';
import { FieldValue } from '@google-cloud/firestore';

export class AccountAtomic extends AccountBase {
    leaderBoardStats?: { [key: number]: any };
    gamePlayed?: number | FieldValue;
    wins?: number | FieldValue;
    losses?: number | FieldValue;
    contribution?: number | FieldValue;
    badges?: number | FieldValue;

    constructor() {
        super();
        this.leaderBoardStats = {};
    }
}
