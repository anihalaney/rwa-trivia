import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "ns-action-bar",
    moduleId: module.id,
    templateUrl: "action-bar.component.html",
    styleUrls: ["action-bar.component.css"]
})

export class ActionBarComponent {

    @Input() title;
    @Output() open: EventEmitter<any> = new EventEmitter<any>();
}
