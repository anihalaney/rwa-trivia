import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { AppStore } from '../../../core/store/app-store';
import { Utils } from '../../../core/services';
import { Category, User } from '../../../model';

@Component({
  selector: 'bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit, OnDestroy {

  isLinear = true;
  uploadFormGroup: FormGroup;

  tagsObs: Observable<string[]>;
  categoriesObs: Observable<Category[]>;

  //Properties
  categories: Category[];
  subs: Subscription[] = [];

  tags: string[];
  filteredTags$: Observable<string[]>;
  
  constructor(private fb: FormBuilder,
              private store: Store<AppStore>) {
    this.categoriesObs = store.select(s => s.categories);
    this.tagsObs = store.select(s => s.tags);
  }

  ngOnInit() {
    this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));
    this.subs.push(this.tagsObs.subscribe(tags => this.tags = tags));

    this.uploadFormGroup = this.fb.group({
      category: ['', Validators.required],
      tagControl: ['', Validators.required],
      fileControl: ['', Validators.required]
    });

    this.filteredTags$ = this.uploadFormGroup.get('tagControl').valueChanges
        .map(val => val.length > 0 ? this.filter(val) : []);
  }

  filter(val: string): string[] {
    return this.tags.filter(option => new RegExp(Utils.regExpEscape(`${val}`), 'gi').test(option)); 
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
