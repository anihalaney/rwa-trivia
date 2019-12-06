import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { screen } from "tns-core-modules/platform";


@Component({
  selector: 'app-animation-box',
  templateUrl: './animation-box.component.html',
  styleUrls: ['./animation-box.component.scss']
})
export class AnimationBoxComponent implements OnInit {

  @ViewChild("namelabel", { static: false }) namelabel: ElementRef;
  @ViewChild("nameField", { static: false }) nameField: ElementRef;
  @ViewChild("nameLabelField", { static: false }) nameLabelField: ElementRef;
  @ViewChild('textBoxContainer', { static: false }) textBoxContainers: ElementRef;

  @Output() formSubmitted = new EventEmitter();

  showEdit: boolean;

  constructor() {
    this.showEdit = false;
  }

  ngOnInit() {
  }

  editSingleFieldTns(name, index) {
    console.log('EDIT CALLED');
    const nativeElement = this.textBoxContainers.nativeElement;
    const nameField = this.nameField;
    const namelabel = this.namelabel;
    const nameLabelField = this.nameLabelField;

    const reduceSize = (screen.mainScreen.widthDIPs - 30);

    if (nativeElement.width === reduceSize) {
      nameField.nativeElement.visibility = 'collapsed';
      namelabel.nativeElement.visibility = "visible";
      nameLabelField.nativeElement.visibility = "visible";
      namelabel.nativeElement.animate({
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
        namelabel.nativeElement.visibility = "visible";
        nameLabelField.nativeElement.visibility = "visible";
      });
      nativeElement.animate({
        width: 'auto',
        duration: 100
      }).then(() => { }, () => { });
    } else {
      nameLabelField.nativeElement.visibility = "hidden";
      namelabel.nativeElement.animate({
        translate: { x: 4, y: -7 },
        opacity: .8,
        duration: 100
      }).then(() => {
        namelabel.nativeElement.visibility = "collapsed";
        nameLabelField.nativeElement.visibility = "collapsed";
        nameField.nativeElement.visibility = 'visible';
      });
      nativeElement.animate({
        width: reduceSize,
        duration: 100
      }).then(() => { }, () => { });
    }

    // if (nameField.nativeElement.text) {
    //   if (nativeElement.width === reduceSize) {
    //     nameField.nativeElement.visibility = 'collapsed';
    //     namelabel.nativeElement.visibility = "visible";
    //     nameLabelField.nativeElement.visibility = "visible";
    //     namelabel.nativeElement.animate({
    //       translate: { x: 0, y: 0 },
    //       opacity: 1,
    //       duration: 100
    //     }).then(() => {

    //       nameLabelField.nativeElement.animate({
    //         translate: { x: 0, y: 0 },
    //         opacity: 1,
    //         duration: 100
    //       }).then(() => {

    //       });
    //       namelabel.nativeElement.visibility = "visible";
    //       nameLabelField.nativeElement.visibility = "visible";
    //     });
    //     nativeElement.animate({
    //       width: 'auto',
    //       duration: 100
    //     }).then(() => { }, () => { });
    //   } else {
    //     nameLabelField.nativeElement.visibility = "hidden";
    //     namelabel.nativeElement.animate({
    //       translate: { x: 4, y: -7 },
    //       opacity: .8,
    //       duration: 100
    //     }).then(() => {
    //       namelabel.nativeElement.visibility = "collapsed";
    //       nameLabelField.nativeElement.visibility = "collapsed";
    //       nameField.nativeElement.visibility = 'visible';
    //       // this.cd.detectChanges();
    //     });
    //     nativeElement.animate({
    //       width: reduceSize,
    //       duration: 100
    //     }).then(() => { }, () => { });
    //   }

    // } else {
    //   if (nativeElement.width === reduceSize) {
    //     nameField.nativeElement.visibility = 'collapsed';
    //     namelabel.nativeElement.visibility = "visible";
    //     nameLabelField.nativeElement.visibility = "visible";
    //     namelabel.nativeElement.animate({
    //       translate: { x: 0, y: 0 },
    //       opacity: 1,
    //       duration: 100
    //     }).then(() => {
    //       namelabel.nativeElement.visibility = "visible";
    //       nameLabelField.nativeElement.visibility = "visible";
    //     });
    //     nativeElement.animate({
    //       width: 'auto',
    //       duration: 100
    //     }).then(() => { }, () => { });
    //   } else {
    //     namelabel.nativeElement.visibility = "hidden";
    //     nameLabelField.nativeElement.animate({
    //       translate: { x: 4, y: 7 },
    //       opacity: .8,
    //       duration: 100
    //     }).then(() => {
    //       nameLabelField.nativeElement.visibility = "collapsed";
    //       namelabel.nativeElement.visibility = "collapsed";
    //       nameField.nativeElement.visibility = 'visible';
    //       // this.cd.detectChanges();
    //     });
    //     nativeElement.animate({
    //       width: reduceSize,
    //       duration: 100
    //     }).then(() => { }, () => { });
    //   }
    // }
    this.showEdit = !this.showEdit
  }

  onSubmit(value, name, index) {
    this.editSingleFieldTns('name', 1);
    

    console.log('SUBMIT  USER');
  }

}
