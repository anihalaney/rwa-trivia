import { PipeTransform, Pipe } from '@angular/core';
import { Game, User } from 'shared-library/shared/model';
@Pipe({
    name: 'gameFilter',
    pure: false
})
export class GameFilterPipe implements PipeTransform {
    transform(games: Game[], gameFilter: (game: Game) => boolean): Game[] {
        if (!games || !gameFilter) {
            return games;
        }
        return games.filter(game => gameFilter(game));
    }
}
