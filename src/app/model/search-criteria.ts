export class SearchCriteria {
  categoryIds: number[];
  tags: string[];
  status: string; //QuestionStatus
  searchInput: string;
  sortOrder: string;
  constructor() {
    this.categoryIds = [];
    this.tags = [];
  }
}
