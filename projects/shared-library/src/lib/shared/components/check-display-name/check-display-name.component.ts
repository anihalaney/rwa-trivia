import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-check-display-name',
  templateUrl: './check-display-name.component.html',
  styleUrls: ['./check-display-name.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckDisplayNameComponent),
      multi: true,
    }
  ],
})

export class CheckDisplayNameComponent implements ControlValueAccessor {
  @Input() placeholder;
  @Input() hint;
  @Input() class;
  myValue: any = null;
  disabled: boolean;
  propagateChange = (_: any) => { };

  constructor() {
    this.disabled = false;
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
