import { Component, Input } from "@angular/core";
import { Answer } from "shared-library/shared/model";

@Component({
    selector: 'render-answer',
    templateUrl: 'render-answer.component.html',
    styleUrls: ['render-answer.component.css']
})

export class RenderAnswerComponent {

    @Input() answer: Answer;
    @Input() questionIndex: number;

}
