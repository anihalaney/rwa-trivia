import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input, ContentChild, AfterContentInit } from '@angular/core';
import { screen, isAndroid } from "tns-core-modules/platform";
import { Utils } from 'shared-library/core/services';

@Component({
  selector: 'app-animation-box',
  templateUrl: './animation-box.component.html',
  styleUrls: ['./animation-box.component.scss']
})
export class AnimationBoxComponent implements OnInit, AfterContentInit {

  @ViewChild("nameLabel", { static: false }) nameLabel: ElementRef;
  @ViewChild("nameField", { static: false }) nameField: ElementRef;
  @ViewChild("nameLabelField", { static: false }) nameLabelField: ElementRef;
  @ViewChild('textBoxContainer', { static: false }) textBoxContainers: ElementRef;

  @ContentChild("textFieldContent", { static: false }) textFieldContent;

  @Input('fieldName') fieldName: string;
  @Input('fieldValue') fieldValue: string;
  @Input('isValid') isValid;
  @Input('isDisplay') isDisplay;

  fieldValueTemp: string;

  @Output() formSubmitted = new EventEmitter();
  @Output() formEditOpen = new EventEmitter();
  showEdit: boolean;

  constructor(private utils: Utils) {
    this.showEdit = false;
  }

  ngOnInit() {
    if (this.isDisplay === undefined || this.isDisplay) {
      this.isDisplay = true;
    }
  }

  editSingleFieldTns() {
    const nativeElement = this.textBoxContainers.nativeElement;
    const nameField = this.nameField;
    const nameLabel = this.nameLabel;
    const nameLabelField = this.nameLabelField;

    const reduceSize = (screen.mainScreen.widthDIPs - 30);

    if (nativeElement.width === reduceSize) {
      nameField.nativeElement.visibility = 'collapsed';
      nameLabel.nativeElement.visibility = "visible";
      nameLabelField.nativeElement.visibility = "visible";
      nameLabel.nativeElement.animate({
        translate: { x: 0, y: 0 },
        opacity: 1,
        duration: 100
      }).then(() => {
        nameLabelField.nativeElement.animate({
          translate: { x: 0, y: 0 },
          opacity: 1,
          duration: 100
        }).then(() => {

        });
        nameLabel.nativeElement.visibility = "visible";
        nameLabelField.nativeElement.visibility = "visible";
      });
      nativeElement.animate({
        width: 'auto',
        duration: 100
      }).then(() => { }, () => { });
    } else {

      if (this.fieldValue) {
        nameLabelField.nativeElement.visibility = "hidden";
        nameLabel.nativeElement.animate({
          translate: { x: 4, y: -7 },
          opacity: .8,
          duration: 100
        }).then(() => {
          nameLabel.nativeElement.visibility = "collapsed";
          nameLabelField.nativeElement.visibility = "collapsed";
          nameField.nativeElement.visibility = 'visible';
          this.utils.focusTextField(this.textFieldContent);
        });
        nativeElement.animate({
          width: reduceSize,
          duration: 100
        }).then(() => { }, () => {
        });

      } else {
        nameLabel.nativeElement.visibility = "hidden";
        nameLabelField.nativeElement.animate({
          translate: { x: 4, y: 7 },
          opacity: .8,
          duration: 100
        }).then(() => {
          nameLabelField.nativeElement.visibility = "collapsed";
          nameLabel.nativeElement.visibility = "collapsed";
          nameField.nativeElement.visibility = 'visible';
          // this.cd.detectChanges();
        });
        nativeElement.animate({
          width: reduceSize,
          duration: 100
        }).then(() => { }, () => { });
      }

    }

    this.showEdit = !this.showEdit
    this.formEditOpen.emit(this.fieldName)
  }

  onSubmit() {
    this.editSingleFieldTns();
    this.formSubmitted.emit(this.fieldName);
  }

  ngAfterContentInit(): void {
    if (this.textFieldContent !== undefined) {
      this.fieldValueTemp = this.textFieldContent.nativeElement.text;
      if (this.showEdit) {
        setTimeout(() => {
          this.textFieldContent.nativeElement.focus();
        }, 0);
      }
    }

  }

}
