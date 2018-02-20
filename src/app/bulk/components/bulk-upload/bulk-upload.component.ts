import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { AppState, appState } from '../../../store';
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
              private store: Store<AppState>) {
    this.categoriesObs = store.select(appState.coreState).select(s => s.categories);
    this.tagsObs = store.select(appState.coreState).select(s => s.tags);
  }

  ngOnInit() {
    this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));
    this.subs.push(this.tagsObs.subscribe(tags => this.tags = tags));

    this.uploadFormGroup = this.fb.group({
      category: ['', Validators.required],
      tagControl: [''] ,
      csvFile: null
    });

    this.filteredTags$ = this.uploadFormGroup.get('tagControl').valueChanges
        .map(val => val.length > 0 ? this.filter(val) : []);
  }

  filter(val: string): string[] {
    return this.tags.filter(option => new RegExp(Utils.regExpEscape(`${val}`), 'gi').test(option)); 
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.uploadFormGroup.get('csvFile').setValue(file);
      /*reader.readAsText(file);
      reader.onload = () => {
        console.log(file);
        console.log(reader.result);
      };*/
    }
  }

  private prepareUpload(): any {
    let input = new FormData();
    
    input.append('category', this.uploadFormGroup.get('category').value);
    input.append('tag', this.uploadFormGroup.get('tagControl').value);
    input.append('csvFile', this.uploadFormGroup.get('csvFile').value);
    return input;
  }

  onUploadSubmit() {
    //validate
    if (!this.uploadFormGroup.valid) 
      return;

    const formModel = this.prepareUpload();

    //dispatch action
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
