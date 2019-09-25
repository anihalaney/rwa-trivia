import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'app-render-box',
    templateUrl: './render-box.component.html',
    styleUrls: ['./render-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderBoxComponent {
    @Input() setBackgroundColor;
    constructor() { }
}
