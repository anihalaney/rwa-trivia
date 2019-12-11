import {
  Input,
  OnInit,
} from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { Utils } from "shared-library/core/services";

export class CheckDisplayName implements OnInit, ControlValueAccessor {
  @Input() placeholder;
  @Input() hint;
  @Input() isProfilePage;
  myValue: any = null;
  @Input() disabled: boolean;
  propagateChange = (_: any) => {};

  constructor(public utils: Utils) {}

  ngOnInit(): void {
    this.disabled = this.isProfilePage ? true : false;
  }

  writeValue(obj: any): void {
    this.myValue = obj;
  }

  onTextChange(event) {
    this.propagateChange(event);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // do nothing
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
