export class AccountBase {
    enable?: boolean;
    lives?: number;
    lastLiveUpdate?: number;
    nextLiveUpdate?: number;
    categories?: number;
    avgAnsTime?: number;
    id?: string;
    bits?: number;
    bytes?: number;
    firstQuestionBitsAdded?: number;
}

export class Account extends AccountBase {
    leaderBoardStats?: { [key: number]: number };
    gamePlayed?: number;
    wins?: number;
    losses?: number;
    contribution?: number;
    badges?: number;

    constructor() {
        super();
        this.leaderBoardStats = {};
    }
}
