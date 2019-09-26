import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'render-box',
    templateUrl: './render-box.component.html',
    styleUrls: ['./render-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderBoxComponent  {
    @Input() setBackgroundColor;
    @Input() theme;
    constructor() { }
}
