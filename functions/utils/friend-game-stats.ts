const friendGameStatService = require('../services/friend.service');

import {
    Game, GameStatus, GameOptions, PlayerMode, OpponentType, Stat, User, UserStats,
    LeaderBoardUser, UserStatConstants, Friends, FriendsMetadata
} from '../../projects/shared-library/src/lib/shared/model';


export class FriendGameStats {


    public calculateFriendsGameState(game: Game): Promise<any> {
        const friendPromises = [];

        friendPromises.push(this.calculateFriendStat(game.playerIds[0], game.playerIds[1], game));
        friendPromises.push(this.calculateFriendStat(game.playerIds[1], game.playerIds[0], game));

        return Promise.all(friendPromises)
            .then((friendResults) => {
                //  console.log('All Users stats are updated', userResults);
                return friendResults;
            })
            .catch((e) => {
                //  console.log('game promise error', e);
            });

    }

    private calculateFriendStat(userId: string, otherUserId: string, game: Game): Promise<string> {

        return friendGameStatService.getFriendByInvitee(userId).then(friendData => {
            const friends: Friends = friendData.data();
            if (friends) {
                let index = 0;
                let matchedIndex: number;
                let friendsMetadataMap: { [key: string]: FriendsMetadata };
                //  console.log('found friends', friends);
                //  console.log('userId', userId);
                //  console.log('otherUserId', otherUserId);
                friends.myFriends.map((friendMetaDataMap) => {
                    Object.keys(friendMetaDataMap).map((friendUserId) => {
                        if (friendUserId === otherUserId) {
                            matchedIndex = index;
                            friendsMetadataMap = friendMetaDataMap;
                        }
                    });
                    index++;
                });
                const friendsMetadata: FriendsMetadata = friendsMetadataMap[otherUserId];
                //   console.log('friendsMetadata', friendsMetadata);
                friendsMetadata.gamePlayed = (friendsMetadata.gamePlayed) ? friendsMetadata.gamePlayed + 1 : 1;
                friendsMetadata.wins = (friendsMetadata.wins) ? friendsMetadata.wins : 0;
                friendsMetadata.losses = (friendsMetadata.losses) ? friendsMetadata.losses : 0;
                if (game.winnerPlayerId) {
                    friendsMetadata.wins = (game.winnerPlayerId === otherUserId) ? friendsMetadata.wins + 1 : friendsMetadata.wins;
                    friendsMetadata.losses = (game.winnerPlayerId !== otherUserId) ? friendsMetadata.losses + 1 : friendsMetadata.losses;
                }
                friendsMetadataMap[otherUserId] = { ...friendsMetadata };
                friends.myFriends[matchedIndex] = friendsMetadataMap;
                //  console.log('friends', friends);
                return friendGameStatService.setFriend({ ...friends }, userId).then((id) => {
                    return `Friend ${userId} Stat updated`;
                });
            } else {
                return `Friend ${userId} Stat updated`;
            }
        });
    }


}
