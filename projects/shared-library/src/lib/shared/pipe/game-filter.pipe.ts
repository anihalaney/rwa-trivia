import { PipeTransform, Pipe } from '@angular/core';
import { Game } from 'shared-library/shared/model';
@Pipe({
    name: 'gameFilter',
    pure: false
})
export class GameFilterPipe implements PipeTransform {
    transform(items: any[], gameFilter: (item: Game) => boolean): any {
        if (!items || !gameFilter) {
            return items;
        }
        return items.filter(item => gameFilter(item));
    }
}
