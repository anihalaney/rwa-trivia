
export class LeaderBoardUsers {
    users: LeaderBoardUser[];

    constructor(data) {
        this.users = data.users || [];
    }
}

export class LeaderBoardUser {
    userId: string;
    score: number;
}

export class LeaderBoardStats {
    id: any;
    users: LeaderBoardUser[];
}
