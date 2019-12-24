import {
  Component,
  forwardRef,
  SimpleChanges,
  OnChanges,
  ElementRef,
  ViewChild
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { CheckDisplayName } from "./check-display-name";
import { Utils } from "shared-library/core/services";

@Component({
  selector: "app-check-display-name",
  templateUrl: "./check-display-name.component.html",
  styleUrls: ["./check-display-name.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckDisplayNameComponent),
      multi: true
    }
  ]
})
export class CheckDisplayNameComponent extends CheckDisplayName implements OnChanges {
  @ViewChild("textField", { static: false }) textField: ElementRef;

  constructor(public utils: Utils) {
    super(utils);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled && changes.disabled.currentValue && this.textField) {
      this.utils.focusTextField(this.textField);
    }
  }
}
