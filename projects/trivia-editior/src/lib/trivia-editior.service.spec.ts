import { TestBed } from '@angular/core/testing';

import { TriviaEditiorService } from './trivia-editior.service';

describe('TriviaEditiorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TriviaEditiorService = TestBed.get(TriviaEditiorService);
    expect(service).toBeTruthy();
  });
});
