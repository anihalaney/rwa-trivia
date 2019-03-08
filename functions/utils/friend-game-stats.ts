import {
    Game, Friends, FriendsMetadata
} from '../../projects/shared-library/src/lib/shared/model';
import { FriendService } from '../services/friend.service';
import { Utils } from '../utils/utils';

export class FriendGameStats {


    static async calculateFriendsGameState(game: Game): Promise<any> {
        const friendPromises = [];

        try {
            friendPromises.push(FriendGameStats.calculateFriendStat(game.playerIds[0], game.playerIds[1], game));
            friendPromises.push(FriendGameStats.calculateFriendStat(game.playerIds[1], game.playerIds[0], game));

            return await Promise.all(friendPromises);
        } catch (error) {
            return Utils.throwError(error);
        }

    }

    static async calculateFriendStat(userId: string, otherUserId: string, game: Game): Promise<string> {
        try {
            const friends: Friends = await FriendService.getFriendByInvitee(userId);
            if (friends) {
                let index = 0;
                let matchedIndex: number;
                let friendsMetadataMap: { [key: string]: FriendsMetadata };
                for (const friendMetaDataMap of friends.myFriends) {
                    for (const friendUserId of Object.keys(friendMetaDataMap)) {
                        if (friendUserId === otherUserId) {
                            matchedIndex = index;
                            friendsMetadataMap = friendMetaDataMap;
                        }
                    }
                    index++;
                }

                const friendsMetadata: FriendsMetadata = friendsMetadataMap[otherUserId];
                friendsMetadata.gamePlayed = (friendsMetadata.gamePlayed) ? friendsMetadata.gamePlayed + 1 : 1;
                friendsMetadata.wins = (friendsMetadata.wins) ? friendsMetadata.wins : 0;
                friendsMetadata.losses = (friendsMetadata.losses) ? friendsMetadata.losses : 0;
                if (game.winnerPlayerId) {
                    friendsMetadata.wins = (game.winnerPlayerId === otherUserId) ? friendsMetadata.wins + 1 : friendsMetadata.wins;
                    friendsMetadata.losses = (game.winnerPlayerId !== otherUserId) ? friendsMetadata.losses + 1 : friendsMetadata.losses;
                }
                friendsMetadataMap[otherUserId] = { ...friendsMetadata };
                friends.myFriends[matchedIndex] = friendsMetadataMap;

                return await FriendService.setFriend({ ...friends }, userId);
            } else {
                return `Friend ${userId} Stat updated`;
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }


}
