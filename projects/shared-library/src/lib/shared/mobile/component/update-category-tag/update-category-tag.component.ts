import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page/page";
import { Store, select } from "@ngrx/store";
import {
  UserActions,
  CategoryActions,
  TagActions,
  coreState
} from "shared-library/core/store";
import { User, Category } from "shared-library/shared/model";
import { Observable, forkJoin } from "rxjs";
import { mergeMap, map, flatMap } from 'rxjs/operators';

@Component({
  selector: "app-update-category-tag",
  templateUrl: "./update-category-tag.component.html",
  styleUrls: ["./update-category-tag.component.scss"]
})
export class UpdateCategoryTagComponent implements OnInit {
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
  renderView = false;

  constructor(
    private routerExtensions: RouterExtensions,
    private page: Page,
    public store: Store<any>,
    public userAction: UserActions,
    public category: CategoryActions,
    private tag: TagActions,
    public cd: ChangeDetectorRef
  ) {
    // this.page.actionBarHidden = true;
  }

  ngOnInit() {
    let tempCategories = [];
    this.page.on("loaded", () => {
      this.renderView = true;
      this.cd.markForCheck();
    });
    this.categoriesObs = this.store
      .select(coreState)
      .pipe(select(s => s.categories));
    this.subscriptions.push(
      this.categoriesObs.subscribe(categories => {
        tempCategories = categories;
        this.cd.markForCheck();
      })
    );
    this.store.dispatch(this.category.loadTopCategories());
    this.topCategoriesObs = this.store
      .select(coreState)
      .pipe(select(s => s.getTopCategories));
    this.subscriptions.push(
      this.topCategoriesObs.subscribe(topCategories => {
        this.topCategories = topCategories;
        let categoryData = [];
        this.topCategories.map(topCategories => {
          tempCategories.map(category => {
            if (topCategories.key === category.id) {
              categoryData.push(category);
            }
          });
        });
        categoryData.map((category: any) => {
          category.requiredForGamePlay = false;
        });
        this.categories = categoryData;
      })
    );

    this.store.dispatch(this.tag.loadTopTags());
    this.topTagsObs = this.store
      .select(coreState)
      .pipe(select(s => s.getTopTags));
    this.subscriptions.push(
      this.topTagsObs.subscribe(topTags => {
        this.topTags = topTags;
        this.topTags.map((tag: any) => {
          tag.requiredForGamePlay = false;
        });
        this.tags = this.topTags;
      })
    );

    this.subscriptions.push(
      this.store
        .select(coreState)
        .pipe(select(s => s.user))
        .subscribe(user => {
          this.user = user;
          console.log("USERs>>",this.user.categoryIds);
          console.log("USERs>>",this.user.tags);
          this.tags = [...this.user.tags];
        })
    );

    this.store
        .select(coreState)
        .pipe(select(s => s.user))
        .pipe(map(user => this.user = user),
        flatMap(() =>this.categoriesObs),
        ).subscribe(categories => {
          console.log('catteis>>>', categories);
        })
        
        

  }

  back() {
    this.routerExtensions.back();
  }

  selectTopic(index) {
    console.log('category', index);
    const categories = this.categories[index];
    categories.requiredForGamePlay = !categories.requiredForGamePlay;
    this.categories = [...this.categories];
    this.selectedCategories = this.returnSelectedTagsOrCategories(
      this.categories
    ).length;

    console.log(this.categories);
  }

  selectTags(index) {
    console.log('tagt', index);
    const tags = this.tags[index];
    tags.requiredForGamePlay = !tags.requiredForGamePlay;
    this.tags = [...this.tags];
    console.log( this.tags);
  }

  returnSelectedTagsOrCategories(type) {
    return type.filter(s => s.requiredForGamePlay);
  }

  ngOnDestroy() {
    this.renderView = false;
    this.page.off("loaded");
  }
}
