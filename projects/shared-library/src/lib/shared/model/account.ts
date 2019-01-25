export class Account {
    lives?: number;
    livesUpdatedAt?: number;
    leaderBoardStats?: { [key: number]: number };
    gamePlayed?: number;
    categories?: number;
    wins?: number;
    badges?: number;
    losses?: number;
    avgAnsTime?: number;
    contribution?: number;
    id?: string;

    constructor() {
        this.leaderBoardStats = {};
    }
}

