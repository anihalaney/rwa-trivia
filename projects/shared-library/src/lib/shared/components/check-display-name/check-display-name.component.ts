import { Component, forwardRef, Input, OnInit } from '@angular/core';
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

export class CheckDisplayNameComponent implements OnInit, ControlValueAccessor {

  @Input() placeholder;
  @Input() hint;
  @Input() isProfilePage;
  myValue: any = null;
  disabled: boolean;
  propagateChange = (_: any) => { };

  constructor() {
  }

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
