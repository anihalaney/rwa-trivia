import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  ContentChild,
  AfterContentInit
} from "@angular/core";
import { screen } from "tns-core-modules/platform";
import { Utils } from "shared-library/core/services";

@Component({
  selector: "app-animation-box",
  templateUrl: "./animation-box.component.html",
  styleUrls: ["./animation-box.component.scss"]
})
export class AnimationBoxComponent implements OnInit, AfterContentInit {
  @ViewChild("nameLabel", { static: false }) nameLabel: ElementRef;
  @ViewChild("nameField", { static: false }) nameField: ElementRef;
  @ViewChild("nameLabelField", { static: false }) nameLabelField: ElementRef;
  @ViewChild("textBoxContainer", { static: false })
  textBoxContainers: ElementRef;

  @ContentChild("textFieldContent", { static: false }) textFieldContent;

  @Input("fieldName") fieldName: string;
  @Input("fieldValue") fieldValue: string;
  @Input("isValid") isValid;
  @Input("isDisplay") isDisplay;
  @Input("type") type;

  @Output() formSubmitted = new EventEmitter();
  @Output() formEditOpen = new EventEmitter();
  @Output() getCurrentLocation = new EventEmitter();
  showEdit: boolean;

  constructor(private utils: Utils) {
    this.showEdit = false;
  }

  ngOnInit() {
    console.log('eid<>>', this.type);
    if (this.isDisplay === undefined || this.isDisplay) {
      this.isDisplay = true;
    }
  }

  editField() {
    const nativeElement = this.textBoxContainers.nativeElement;
    const nameField = this.nameField;
    const nameLabel = this.nameLabel;
    const nameLabelField = this.nameLabelField;

    const reduceSize = screen.mainScreen.widthDIPs - 30;

    if (nativeElement.width === reduceSize) {
      nameField.nativeElement.visibility = "collapsed";
      nameLabel.nativeElement.visibility = "visible";
      nameLabelField.nativeElement.visibility = "visible";
      nameLabel.nativeElement.animate({
        translate: { x: 0, y: 0 },
        opacity: 1,
        duration: 100
      });
      nameLabel.nativeElement.visibility = "visible";
      nameLabelField.nativeElement.visibility = "visible";

      nameLabelField.nativeElement.animate({
        translate: { x: 0, y: 0 },
        opacity: 1,
        duration: 100
      });

      nativeElement.animate({
        width: "auto",
        duration: 100
      });
      this.formSubmitted.emit(this.fieldName);
    } else {
      if (this.fieldValue) {
        nameLabelField.nativeElement.visibility = "hidden";

        nativeElement.animate({
          width: reduceSize,
          duration: 100
        });
        nameLabel.nativeElement.animate({
          translate: { x: 4, y: -7 },
          opacity: 0.8,
          duration: 100
        });

        nameLabel.nativeElement.visibility = "collapsed";
        nameLabelField.nativeElement.visibility = "collapsed";
        nameField.nativeElement.visibility = "visible";
        this.utils.focusTextField(this.textFieldContent);
      } else {
        nameLabel.nativeElement.visibility = "hidden";
        nameLabelField.nativeElement.animate({
          translate: { x: 4, y: 7 },
          opacity: 0.8,
          duration: 100
        });

        nameLabelField.nativeElement.visibility = "collapsed";
        nameLabel.nativeElement.visibility = "collapsed";
        nameField.nativeElement.visibility = "visible";

        nativeElement.animate({
          width: reduceSize,
          duration: 100
        });
      }
      this.formEditOpen.emit(this.fieldName);
    }

    this.showEdit = !this.showEdit;
  }

  ngAfterContentInit(): void {
    if (this.textFieldContent !== undefined) {
      if (this.showEdit) {
        this.utils.focusTextField(this.textFieldContent);
      }
    }
  }

  location(){
    console.log('location');
    this.getCurrentLocation.emit();
  }
}
