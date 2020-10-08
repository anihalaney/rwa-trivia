import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page/page';
import { Store, select } from "@ngrx/store";
import { UserActions, CategoryActions, TagActions, coreState } from 'shared-library/core/store';
import { User, Category } from 'shared-library/shared/model';
import { Observable } from 'rxjs';
import { map, flatMap, filter } from 'rxjs/operators';
import { Utils } from './../../../../core/services/utils';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';


@Component({
  selector: 'app-update-category-tag',
  templateUrl: './update-category-tag.component.html',
  styleUrls: ['./update-category-tag.component.scss']
})

@AutoUnsubscribe({ arrayName: 'subscriptions' })
export class UpdateCategoryTagComponent implements OnInit, OnDestroy {
  user: User;
  subscriptions = [];
  categoriesObs: Observable<Category[]>;
  categories: Category[];
  tempCategories: Category[];
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
    public cd: ChangeDetectorRef,
    private utils: Utils
  ) { }

  ngOnInit() {

    this.page.on("loaded", () => {
      this.renderView = true;
      this.cd.markForCheck();
    });

    this.categoriesObs = this.store.select(coreState).pipe(select(s => s.categories));

    this.store.dispatch(this.category.loadTopCategories());
    this.topCategoriesObs = this.store.select(coreState).pipe(select(s => s.getTopCategories));

    this.store.dispatch(this.tag.loadTopTags());
    this.topTagsObs = this.store.select(coreState).pipe(select(s => s.getTopTags));

    this.store.select(coreState).pipe(select(s => s.user),
      filter(u => {
        return u !== null;
      }),
      map(user => { this.user = user; }),
      flatMap(() =>
        this.categoriesObs.pipe(map(categories => {
          this.categories = categories;
          this.tempCategories = categories;
        })
        )
      ),
      flatMap(() =>
        this.topCategoriesObs.pipe(
          map(topCategories => {
            if (topCategories) {
              this.topCategories = topCategories;
              let categoryData = [];
              this.topCategories.map(topCategories => {
                this.tempCategories.map(category => {
                  if (topCategories.key === category.id) {
                    categoryData.push(category);
                  }
                });
              });
              categoryData.map((category: any) => {
                category.requiredForGamePlay = this.user.categoryIds.some(
                  categoryIds => categoryIds == category.id
                );
              });
              this.categories = categoryData;
            }

          })
        )
      ),
      flatMap(() =>
        this.topTagsObs.pipe(
          map(topTags => {
            if (topTags) {
              this.topTags = topTags;
              this.topTags.map((tag: any) => {
                tag.requiredForGamePlay = this.user.tags.some(
                  t => t == tag.key
                );
              });
              this.tags = this.topTags;

              const filteredTags = [...this.user.tags];
              this.tags.map(data => {
                if (filteredTags.indexOf(data.key) >= 0) {
                  filteredTags.splice(filteredTags.indexOf(data.key), 1);
                }
              });
              this.tags = [...this.tags, ...filteredTags.map(data => { const newid = { key: data, requiredForGamePlay: true }; return newid; })];

            }
          })
        )
      )
    )
      .subscribe();

    this.subscriptions.push(
      this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus))
        .subscribe(status => {
          if (status === 'SUCCESS') {
            this.utils.showMessage(
              'success',
              'Topics updated successfully'
            );
          }
          this.cd.markForCheck();
        })
    );
  }

  back() {
    this.routerExtensions.back();
  }

  selectTopic(index) {
    const categories = this.categories[index];
    categories.requiredForGamePlay = !categories.requiredForGamePlay;
    this.categories = [...this.categories];
    this.selectedCategories = this.returnSelectedTagsOrCategories(
      this.categories
    ).length;
  }

  selectTags(index) {
    const tags = this.tags[index];
    tags.requiredForGamePlay = !tags.requiredForGamePlay;
    this.tags = [...this.tags];
  }

  returnSelectedTagsOrCategories(type) {
    if (type) {
      return type.filter((s) => s.requiredForGamePlay);
    }
    return [];
  }

  ngOnDestroy() {
    this.renderView = false;
    this.page.off("loaded");
  }

  updateCategoryTap() {
    const categoryIds = [];
    const tags = [];
    const selectedTopics = this.returnSelectedTagsOrCategories(this.categories);
    selectedTopics.map(categories => {
      categoryIds.push(categories.id);
    });
    const selectedTags = this.returnSelectedTagsOrCategories(this.tags);
    selectedTags.map(tag => {
      tags.push(tag.key);
    });
    this.user.categoryIds = categoryIds;
    this.user.tags = tags;
    this.user.isCategorySet = true;
    this.store.dispatch(this.userAction.addUserProfile(this.user, false));
  }
}