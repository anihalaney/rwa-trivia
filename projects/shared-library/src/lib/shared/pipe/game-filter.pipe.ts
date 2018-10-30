import { PipeTransform, Pipe } from '@angular/core';
import { GameStatus } from 'shared-library/shared/model';
@Pipe({
    name: 'gamefilter',
    pure: false
})
export class GameFilterPipe implements PipeTransform {
    gameStatus: any = GameStatus;

    transform(items: any[], gamefilter: (item: any, gameStatus) => boolean): any {
        if (!items || !gamefilter) {
            return items;
        }
        return items.filter(item => gamefilter(item, this.gameStatus));
    }
}