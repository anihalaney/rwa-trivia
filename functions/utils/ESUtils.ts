import { Game, Question, Category, SearchResults, SearchCriteria } from '../../projects/shared-library/src/lib/shared/model';

const fs = require('fs');
const path = require('path');
const elasticsearch = require('elasticsearch');
const functions = require('firebase-functions');
const elasticsearchConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../config/elasticsearch.config.json'), 'utf8'));

export class ESUtils {
  static QUESTIONS_INDEX = 'questions';


  static searchClient: Elasticsearch.Client;

  static getElasticSearchClient(): Elasticsearch.Client {
    if (!this.searchClient) {
      // cloning config object to avoid resuing the same object (same object causes error)
      this.searchClient = new elasticsearch.Client(Object.assign({}, elasticsearchConfig));
    }
    return this.searchClient;
  };

  static getIndex(index: string): string {
    // set required prefix for different deployment environments(firebase project) using following command
    // default project in firebase is development deployment
    // firebase -P production functions:config:set elasticsearch.index.production=true
    // After setting config variable do not forget to deploy functions
    // to see set environments firebase -P production functions:config:get
    let prefix = 'dev:';

    if (functions.config().elasticsearch &&
      functions.config().elasticsearch.index &&
      functions.config().elasticsearch.index.production &&
      // tslint:disable-next-line:triple-equals
      functions.config().elasticsearch.index.production == 'true') {

      prefix = '';
    }
    console.log(`index prefix is "${prefix}"`);
    return prefix + index;
  }

  static createOrUpdateIndex(index: string, type: string, data: Question, key: string): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    data.createdOn = new Date(data.createdOn['_seconds'] * 1000);

    return client.index({
      index: index,
      type: type,
      id: key,
      body: data
    }).then((response) => {
      console.log('indexed ', key);
    })
      .catch((error) => {
        console.log('Error in indexing');
        console.log(error);
        throw (error);
      });
  }

  static removeIndex(index, key): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    return client.search({
      'index': index,
      body: {
        'query': {
          'ids': {
            'values': [key]
          }
        }
      }
    })
      .then((body) => {
        const hits = body.hits.hits;
        if (hits.length === 0) {
          console.log('not found in index ', key);
          return Promise.resolve();
        }

        const q = hits[0];
        const type = q['_type'];

        return client.delete({
          index: index,
          type: type,
          id: key
        }).then((response) => {
          console.log('removed indexed ', key);
        })
          .catch((error) => {
            console.log('Error in removing from index');
            console.log(error);
            throw (error);
          });
      })
      .catch((error) => {
        console.log('Error in finding item in the index');
        console.log(error);
        throw (error);
      });
  }

  static deleteIndex(index) {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    // index = this.getIndex(index);

    return client.indices.exists({ 'index': index })
      .then((response) => {
        console.log(response);
        if (!response) {
          // doesn't exist
          console.log('Index does not exist. Skipping delete');
          return Promise.resolve();
        }
        // if exists, then delete
        return client.indices.delete({ 'index': index })
          .then((response) => {
            console.log('indexed deleted ', index);
          })
          .catch((error) => {
            console.log('Error in deleting index');
            console.log(error);
            throw (error);
          })
      })
      .catch((error) => {
        console.log('Error in checking for index');
        console.log(error);
        throw (error);
      });
  }

  static rebuildIndex(index: string, data: { 'id': string, 'type': string, 'source': any }[]): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    // delete entire index
    return this.deleteIndex(index)
      .then((response) => {
        const body = [];
        // TODO: build bulk index in batches (maybe 1000 at a time)
        let arrayLength = data.length
        const batchSize = 500;
        for (let i = 0; i < arrayLength; i += batchSize) {
          let batchData = data.slice(i, i + batchSize);
          batchData.forEach(d => {
            body.push({ index: { _index: index, _type: d.type, _id: d.id } });
            body.push(d.source);
          });
          client.bulk({ 'body': body }).then(resp => {
            console.log('All items indexed');
          })
            .catch((error) => {
              console.log(error);
              throw (error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        throw (error);
      });
  }

  static getQuestions(start: number, size: number, criteria: SearchCriteria): Promise<SearchResults> {
    const date = new Date();
    return this.getSearchResults(this.QUESTIONS_INDEX, start, size, criteria).then((results) => {
      // convert hits to Questions
      // console.log(results);

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
    });
  }

  static getRandomQuestionOfTheDay(isNextQuestion: boolean): Promise<Question> {
    const date = new Date();
    const seed = date.getUTCFullYear().toString() + date.getUTCMonth().toString() + date.getUTCDate().toString();
    return this.getRandomItems(this.QUESTIONS_INDEX, 1, (isNextQuestion) ? '' : seed).then((hits) => {
      // convert hit to Question
      return Question.getViewModelFromES(hits[0]);
    });
  }

  static getRandomGameQuestion(gameCategories: Array<number>, excludedQId: Array<string>): Promise<Question> {
    return this.getRandomQuestionES(this.QUESTIONS_INDEX, 1, '', gameCategories, [], excludedQId).then((hits) => {
      // convert hit to Question
      return Question.getViewModelFromES(hits[0]);
    });
  }

  static getSearchResults(index: string, start: number, size: number, criteria: SearchCriteria): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
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


    return client.search({
      'index': index,
      'from': start,
      'size': size,
      'body': body
    }).then(function (body) {
      return (body);
    }, function (error) {
      console.trace(error.message);
      throw (error);
    });
  }

  static getRandomItems(index: string, size: number, seed: string): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    return client.search({
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
    }).then(function (body) {
      return (body.hits.hits);
    }, function (error) {
      console.trace(error.message);
      throw (error);
    });
  }

  static getRandomQuestionES(index: string, size: number, seed: string,
    categories: number[], tags: string[], excludeIds: string[]): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    let filter = null;
    const randomSeed = (seed === '') ? null : seed;
    if (categories && categories.length > 0) {
      filter = { 'terms': { 'categoryIds': categories } };
    }

    return client.search({
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
    }).then(function (body) {
      return (body.hits.hits);
    }, function (error) {
      console.trace(error.message);
      throw (error);
    });
  }

  static getQuestionById(questionId: string): Promise<Question> {
    return this.getQuestionES(this.QUESTIONS_INDEX, questionId).then((hits) => {
      // convert hit to Question
      return Question.getViewModelFromES(hits[0]);
    });
  }

  static getQuestionES(index: string, questionId: string): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    return client.search({
      'index': index,
      'size': 1,
      'body': {
        'query': {
          'bool': {
            'must': { 'match': { '_id': questionId } }
          }
        }
      }
    }).then(function (body) {
      return (body.hits.hits);
    }, function (error) {
      console.trace(error.message);
      throw (error);
    });
  }
}
