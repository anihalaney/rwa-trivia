import { Component, Input, Output, OnInit, OnChanges, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../core/store/app-store';
import { User, Category } from '../../model';

@Component({
  selector: 'matrix-animation',
  templateUrl: './matrix-animation.component.html',
  styleUrls: ['./matrix-animation.component.scss']
})
export class MatrixAnimationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() categories: Category[];
  @Input() tags: string[];

  @ViewChild("matrix", { read: ElementRef })
  private matrixDiv: ElementRef;

  constructor(private store: Store<AppStore>,
              private router: Router) {
  }

  lines = [];
  ngOnInit() {}
  ngOnChanges() {
    console.log(this.tags);

    if (!this.tags || !this.categories)
      return;

    let categoryTexts = this.categories.map(c => c.categoryName);
    let tags = this.tags;
    let width = this.matrixDiv.nativeElement.offsetWidth;

    const lines: any = {};  //note the use of any, typescript complains on the spread operator if not specified

    lines[Symbol.iterator] = function* (): IterableIterator<IRow> { //iterator function
      var index = 0;
      var left = 0;

      while(left < width) {
        index ++;
        left = left + getRandomInt(1, 8) * 5;

        let text: string;
        let r: number;
        if (index % 2 === 0 && categoryTexts.length > 0) {
          r = getRandomInt(0, categoryTexts.length - 1);
          text = categoryTexts.splice(r, 1)[0];
        }
        else {
          r = getRandomInt(0, tags.length - 1);
          text = tags.splice(r, 1)[0];
        }

        r = getRandomInt(0, tags.length - 1);
        text += "  " + tags.splice(r, 1)[0];

        let row: IRow = {
          text: text,
          left : left,
          duration: getRandomInt(1, 4),
          delay: getRandomInt(1, 5),  //20 % of the times
          fontSize: getRandomInt(1, 2),
          color: getRandomInt(0, 1),
          classes: {}
        };
        row.classes[`d${row.duration}`] = true;
        row.classes["delay"] = row.delay === 1 ? true : false;
        
        yield row;
      }
    }

    this.lines = [...lines];  //spread operator on object
  }

  ngOnDestroy() {
  }

}

export interface IRow {
  text: string;
  left: number;
  duration: number;
  delay: number;
  fontSize: number;
  color: number;
  classes: {[key:string]: boolean}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}