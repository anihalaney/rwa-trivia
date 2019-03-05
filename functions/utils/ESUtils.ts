import { Question, SearchResults, SearchCriteria } from '../../projects/shared-library/src/lib/shared/model';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as ElasticSearch from 'elasticsearch';
import * as functions from 'firebase-functions';


const elasticSearchConfig = JSON.parse(readFileSync(resolve(__dirname, '../../../config/elasticsearch.config.json'), 'utf8'));

export class ESUtils {
  private static QUESTIONS_INDEX = 'questions';
  private static searchClient: ElasticSearch.Client;

  static getElasticSearchClient(): ElasticSearch.Client {
    if (!this.searchClient) {
      // cloning config object to avoid reusing the same object (same object causes error)
      this.searchClient = new ElasticSearch.Client(Object.assign({}, elasticSearchConfig));
    }
    return this.searchClient;
  };

  static getIndex(index: string): string {
    // set required prefix for different deployment environments(firebase project) using following command
    // default project in firebase is development deployment
    // firebase -P production functions:config:set ElasticSearch.index.production=true
    // After setting config variable do not forget to deploy functions
    // to see set environments firebase -P production functions:config:get
    let prefix = 'dev:';

    if (functions.config().ElasticSearch &&
      functions.config().ElasticSearch.index &&
      functions.config().ElasticSearch.index.production &&
      // tslint:disable-next-line:triple-equals
      functions.config().ElasticSearch.index.production == 'true') {

      prefix = '';
    }
    console.log(`index prefix is "${prefix}"`);
    return prefix + index;
  }

  static async createOrUpdateIndex(type: string, data: Question, key: string): Promise<any> {
    let index = this.QUESTIONS_INDEX;
    try {
      const client: ElasticSearch.Client = this.getElasticSearchClient();
      index = this.getIndex(index);
      data.createdOn = new Date(data.createdOn['_seconds'] * 1000);
      await client.index({
        index: index,
        type: type,
        id: key,
        body: data
      });
      console.log('indexed ', key);

    } catch (error) {
      console.log();
      console.log(`Error in indexing:${error}`);
      throw error;
    }

  }


  static async removeIndex(key): Promise<any> {
    let index = this.QUESTIONS_INDEX;
    try {
      const client: ElasticSearch.Client = this.getElasticSearchClient();
      index = this.getIndex(index);

      const body = await client.search({
        'index': index,
        body: {
          'query': {
            'ids': {
              'values': [key]
            }
          }
        }
      });

      const hits = body.hits.hits;
      if (hits.length === 0) {
        console.log('not found in index ', key);
        return;
      }
      const q = hits[0];
      const type = q['_type'];
      try {
        await client.delete({
          index: index,
          type: type,
          id: key
        });
        console.log('removed indexed ', key);
        return;

      } catch (error) {
        console.log(`Error in removing from index${error}`);
        throw error;
      }
    } catch (error) {
      console.log(`Error in finding item in the index${error}`);
      throw error;
    }
  }

  static async deleteIndex(index): Promise<any> {
    try {
      const client: ElasticSearch.Client = this.getElasticSearchClient();
      const indexFound = await client.indices.exists({ 'index': index });

      if (!indexFound) {
        console.log('Index does not exist. Skipping delete');
        return;
      }
      try {
        await client.indices.delete({ 'index': index });
        console.log('indexed deleted ', index);
      } catch (error) {
        console.log(`Error in deleting index${error}`);

        throw error;
      }
    } catch (error) {
      console.log(`Error in checking for index${error}`);
      throw error;
    }
  }

  static async rebuildIndex(data: { 'id': string, 'type': string, 'source': any }[]): Promise<any> {
    let index = this.QUESTIONS_INDEX;
    const client: ElasticSearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    try {
      // delete entire index
      await this.deleteIndex(index);
      // TODO: build bulk index in batches (maybe 1000 at a time)
      const arrayLength = data.length;
      const batchSize = 500;
      const batches = [];

      for (let i = 0; i < arrayLength; i += batchSize) {
        let batchData = data.slice(i, i + batchSize);
        const body = [];
        batchData.forEach(d => {
          body.push({ index: { _index: index, _type: d.type, _id: d.id } });
          body.push(d.source);
        });
        batches.push(client.bulk({ 'body': body }));
      }
      await Promise.all(batches);
      console.log('All items indexed');
    } catch (error) {
      console.log(`Error in checking for index${error}`);
      throw error;
    }

  }

  static async getQuestions(start: number, size: number, criteria: SearchCriteria): Promise<SearchResults> {

    const results = await this.getSearchResults(this.QUESTIONS_INDEX, start, size, criteria)
    const searchResults: SearchResults = new SearchResults();
    searchResults.totalCount = results.hits.total;
    searchResults.categoryAggregation = {};
    results.aggregations.category_counts.buckets.forEach(b => {
      searchResults.categoryAggregation[b.key] = b.doc_count;
    });
    searchResults.tagsCount = [];
    // tslint:disable-next-line:max-line-length
    const tag_counts = (results.aggregations.tags_in_categories) ? results.aggregations.tags_in_categories.tag_counts : results.aggregations.tag_counts;
    tag_counts.buckets.forEach(b => {
      searchResults.tagsCount.push({ 'tag': b.key, 'count': b.doc_count });
    });
    searchResults.questions = results.hits.hits.map(hit => Question.getViewModelFromES(hit));
    searchResults.searchCriteria = criteria; // send the originating criteria back with the results

    return searchResults;
  }

  static async getRandomQuestionOfTheDay(isNextQuestion: boolean): Promise<Question> {
    const date = new Date();
    const seed = date.getUTCFullYear().toString() + date.getUTCMonth().toString() + date.getUTCDate().toString();
    const hits = await this.getRandomItems(this.QUESTIONS_INDEX, 1, (isNextQuestion) ? '' : seed);
    // convert hit to Question
    return Question.getViewModelFromES(hits[0]);
  }

  static async getRandomGameQuestion(gameCategories: Array<number>, excludedQId: Array<string>): Promise<Question> {
    const hits = await this.getRandomQuestionES(this.QUESTIONS_INDEX, 1, '', gameCategories, [], excludedQId);
    return Question.getViewModelFromES(hits[0]);
  }

  static async getSearchResults(index: string, start: number, size: number, criteria: SearchCriteria): Promise<any> {
    const client: ElasticSearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    const body = {
      'aggregations': {
        'category_counts': {
          'terms': { 'field': 'categoryIds' }
        },
        'tag_counts': {
          'terms': { 'field': 'tags', 'size': 10 }
        }
      }
    };

    if (criteria) {
      let catFilter = null;
      let tagFilter = null;
      let aggs = null;
      if (criteria.categoryIds && criteria.categoryIds.length > 0) {
        catFilter = { 'terms': { 'categoryIds': criteria.categoryIds } };
        aggs = {
          'filter': {
            'terms': { 'categoryIds': criteria.categoryIds }
          },
          'aggs': {
            'tag_counts': {
              'terms': { 'field': 'tags', 'size': 10 }
            }
          }
        };
      }
      if (catFilter) {
        body['filter'] = catFilter;
      }
      if (criteria.tags && criteria.tags.length > 0) {
        tagFilter = { 'terms': { 'tags': criteria.tags } };
        body['query'] = { 'bool': { 'filter': tagFilter } };
      }

      if (aggs) {
        body['aggregations']['tags_in_categories'] = aggs;
      }

      // sortOrder
      switch (criteria.sortOrder) {
        case 'Category':
          body['sort'] = [{ 'categoryIds': { 'order': 'asc' } }];
          break;
        case 'Status':
          body['sort'] = [{ 'status': { 'order': 'asc' } }];
          break;
      }
    }
    try {
      const response = await client.search({
        'index': index,
        'from': start,
        'size': size,
        'body': body
      });

      return response;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getRandomItems(index: string, size: number, seed: string): Promise<any> {
    try {
      const client: ElasticSearch.Client = this.getElasticSearchClient();
      index = this.getIndex(index);

      const body:Elasticsearch.SearchResponse<any>  = await client.search({
        'index': index,
        'size': size,
        'body': {
          'query': {
            'function_score': {
              'functions': [
                {
                  'random_score': {
                    'seed': (seed === '') ? null : seed
                  }
                }
              ]
            }
          }
        }
      });
      return body.hits.hits;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getRandomQuestionES(index: string, size: number, seed: string,
    categories: number[], tags: string[], excludeIds: string[]): Promise<any> {
    const client: ElasticSearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    let filter = null;
    const randomSeed = (seed === '') ? null : seed;
    if (categories && categories.length > 0) {
      filter = { 'terms': { 'categoryIds': categories } };
    }

    try {
      const body: Elasticsearch.SearchResponse<any> = await client.search({
        'index': index,
        'size': size,
        'body': {
          'query': {
            'function_score': {
              'query': {
                'bool': {
                  'must': { 'match_all': {} },
                  'must_not': [{ 'ids': { 'values': excludeIds } }],
                  'filter': filter
                }
              },
              'functions': [
                {
                  'random_score': { 'seed': randomSeed }
                }
              ]
            }
          }
        }
      });
      return body.hits.hits;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getQuestionById(questionId: string): Promise<Question> {
    const hits = await this.getQuestionES(this.QUESTIONS_INDEX, questionId);
    // convert hit to Question
    return Question.getViewModelFromES(hits[0]);
  }

  static async getQuestionES(index: string, questionId: string): Promise<any> {
    const client: ElasticSearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    try {
      const body = await client.search({
        'index': index,
        'size': 1,
        'body': {
          'query': {
            'bool': {
              'must': { 'match': { '_id': questionId } }
            }
          }
        }
      });
      return body.hits.hits;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
