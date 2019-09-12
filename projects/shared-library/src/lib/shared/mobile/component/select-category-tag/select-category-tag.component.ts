import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { UserActions, CategoryActions, TagActions } from 'shared-library/core/store';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { coreState } from '../../../../core/store';
import { User } from 'shared-library/shared/model/user';
import { Category } from 'shared-library/shared/model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-category-tag',
  templateUrl: './select-category-tag.component.html',
  styleUrls: ['./select-category-tag.component.scss']
})
@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class SelectCategoryTagComponent implements OnInit, OnDestroy {
  user: User;
  subscriptions = [];
  categoriesObs: Observable<Category[]>;
  categories: Category[];
  topCategoriesObs: Observable<any[]>;
  topCategories = [];
  topTagsObs: Observable<any[]>;
  topTags = [];
  tags = [];
  selectedCategories: number = 0;
  constructor(
    private routerExtension: RouterExtensions,
    public store: Store<any>,
    public userAction: UserActions,
    public category: CategoryActions,
    private tag: TagActions,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    let tempCategories = [];
    this.categoriesObs = this.store.select(coreState).pipe(select(s => s.categories));
    this.subscriptions.push(this.categoriesObs.subscribe(categories => { tempCategories = categories; this.cd.markForCheck(); }));
    this.store.dispatch(this.category.loadTopCategories());
    this.topCategoriesObs = this.store.select(coreState).pipe(select(s => s.getTopCategories));
    this.subscriptions.push(this.topCategoriesObs.subscribe(topCategories => {
      this.topCategories = topCategories;
      let categoryData = [];
      this.topCategories.map((topCategories) => {
        tempCategories.map((category) => {
          if (topCategories.key === category.id) {
            categoryData.push(category);
          }
        });
      });
      categoryData.map((category: any) => {
        category.requiredForGamePlay = false;
      });
      this.categories = categoryData;
    }));

    this.store.dispatch(this.tag.loadTopTags());
    this.topTagsObs = this.store.select(coreState).pipe(select(s => s.getTopTags));
    this.subscriptions.push(this.topTagsObs.subscribe(topTags => {
      this.topTags = topTags;
      this.topTags.map((tag: any) => {
        tag.requiredForGamePlay = false;
      });
      this.tags = this.topTags;
    }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
    }));
  }

  selectTopic(args) {
    const categories = this.categories[args.index];
    categories.requiredForGamePlay = !categories.requiredForGamePlay;
    this.categories = [... this.categories];
    this.selectedCategories = this.returnSelectedTagsOrCategories(this.categories).length;
  }

  selectTags(args) {
    const tags = this.tags[args.index];
    tags.requiredForGamePlay = !tags.requiredForGamePlay;
    this.tags = [... this.tags];
  }

  continueToFirstQuestion() {
    const categoryIds = [];
    const tags = [];
    const selectedTopics = this.returnSelectedTagsOrCategories(this.categories);
    selectedTopics.map((categories) => {
      categoryIds.push(categories.id);
    });
    const selectedTags = this.returnSelectedTagsOrCategories(this.tags);
    selectedTags.map((tag) => {
      tags.push(tag.key);
    });
    this.user.categoryIds = categoryIds;
    this.user.tags = tags;
    this.user.isCategorySet = true;
    this.store.dispatch(this.userAction.addUserProfile(this.user, false));
    this.routerExtension.navigate(['/first-question'], { clearHistory: true });
  }

  returnSelectedTagsOrCategories(type) {
    return type.filter((s) => s.requiredForGamePlay);
  }

  ngOnDestroy() {

  }

}
