import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { AngularFire } from 'angularfire2';

import { TEST_DATA } from '../../testing';
import { Category } from '../../model';
import { CategoryService } from './category.service';

describe('Service: CategoryService', () => {
  let categoryList: Category[] = TEST_DATA.categories;
  let afDbMock = { "database": {
                    list: () => Observable.of(categoryList) } 
                  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CategoryService,
      {"provide": AngularFire, "useValue": afDbMock}
    ]
  }));

  it('Call getCategories to return Observable of Categories', 
    inject([
      CategoryService
    ],
    (service: CategoryService) => {

      let catObs = service.getCategories();

      catObs.subscribe(categories => {
        expect(categories.length).toEqual(categoryList.length);
        expect(categories[0]).toEqual(categoryList[0]);
      });

    })
  );

});
