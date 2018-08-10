import { SearchCriteria } from './search-criteria';
import { Question } from './question';

export class SearchResults {
  searchCriteria: SearchCriteria;
  totalCount: number;
  questions: Question[];
  categoryAggregation: { [key: number]: number };
  tagsCount: { tag: string, count: number }[];

 
}
