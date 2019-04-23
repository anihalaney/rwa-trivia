

export class Friends {
    myFriends: Array<{ [key: string]: FriendsMetadata }>;
    created_uid: string;
}

export class FriendsMetadata {
    date: number;
    created_uid: string;
    gamePlayed: any;
    losses: any;
    wins: any;
}
