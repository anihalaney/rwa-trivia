import { Game, Question, Category, SearchResults, SearchCriteria } from '../src/app/model';

const fs = require('fs');
const path = require('path');
const elasticsearch = require('elasticsearch');

const elasticsearchConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../config/elasticsearch.config.json'), 'utf8'));

export class ESUtils {
  static QUESTIONS_INDEX = "questions";

  static searchClient: Elasticsearch.Client;

  static getElasticSearchClient(): Elasticsearch.Client {
    if (!this.searchClient)
      this.searchClient = new elasticsearch.Client(Object.assign({}, elasticsearchConfig)); //cloning config object to avoid resuing the same object (same object causes error)
    return this.searchClient;
  };

  static getIndex(index: string): string {
    const prefix = 
      elasticsearchConfig['index_prefix'] 
      ? (elasticsearchConfig['index_prefix'].toString()).toLowerCase().trim()
      : '';
    return prefix + index;
  }
  
  static createOrUpdateIndex(index: string, type: string, data: any, key: string): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

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
        throw(error);
    });
  }

  static removeIndex(index, key): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    return client.search({"index": index,
        body: {
          "query": {
              "ids" : {
                  "values" : [key]
              }
          }
      }
    })
    .then((body) => {
      let hits = body.hits.hits;
      if (hits.length === 0){
        console.log('not found in index ', key);
        return Promise.resolve();
      }

      let q = hits[0];
      let type = q["_type"];

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
          throw(error);
      });
    })
    .catch((error) => {
        console.log('Error in finding item in the index');
        console.log(error);
        throw(error);
    });
  }

  static deleteIndex(index) {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    return client.indices.exists({"index": index})
    .then((response) => {
      console.log(response);
      if (!response) {
        //doesn't exist
        console.log("Index does not exist. Skipping delete");
        return Promise.resolve();
      }
      //if exists, then delete
      return client.indices.delete({"index": index})
      .then((response) => {
          console.log('indexed deleted ', index);
        })
      .catch((error) => {
          console.log('Error in deleting index');
          console.log(error);
          throw(error);
      })
    })
    .catch((error) => {
      console.log('Error in checking for index');
      console.log(error);
      throw(error);
    });
  }

  static rebuildIndex(index: string, data: {"id": string, "type": string, "source": any}[]): Promise<any> {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    console.log("reindexing ... " + index);
    //delete entire index
    return this.deleteIndex(index)
      .then((response) => {
        let body = [];
        //TODO: build bulk index in batches (maybe 1000 at a time)
        data.forEach(d => {
          body.push({ index:  { _index: index, _type: d.type, _id: d.id } });
          body.push(d.source);
        });
        client.bulk({"body": body}).then(resp => {;
          console.log("All items indexed");
        })
        .catch((error) => {
          console.log(error);
          throw(error);
        });   
      })
      .catch((error) => {
        console.log(error);
        throw(error);
      });   
  }

  static getQuestions(start: number, size: number, criteria: SearchCriteria): Promise<SearchResults> { 
    let date = new Date();
    return this.getSearchResults(this.QUESTIONS_INDEX, start, size, criteria).then((results)=>{
      //convert hits to Questions
      //console.log(results);

      let searchResults: SearchResults = new SearchResults();
      searchResults.totalCount = results.hits.total; 
      searchResults.categoryAggregation = {};
      results.aggregations.category_counts.buckets.forEach(b => {
        searchResults.categoryAggregation[b.key] = b.doc_count;
      });
      searchResults.tagsCount = [];
      let tag_counts = (results.aggregations.tags_in_categories) ? results.aggregations.tags_in_categories.tag_counts : results.aggregations.tag_counts;
      tag_counts.buckets.forEach(b => {
        searchResults.tagsCount.push({"tag": b.key, "count": b.doc_count});
      });
      searchResults.questions = results.hits.hits.map(hit => Question.getViewModelFromES(hit));
      searchResults.searchCriteria = criteria;  // send the originating criteria back with the results

      return searchResults;
    });  
  }

  static getRandomQuestionOfTheDay(): Promise<Question> { 
    let date = new Date();
    let seed = date.getUTCFullYear().toString() + date.getUTCMonth().toString() + date.getUTCDate().toString();
    return this.getRandomItems(this.QUESTIONS_INDEX, 1, seed).then((hits)=>{
      //convert hit to Question
      return Question.getViewModelFromES(hits[0]);
    });  
  }

  static getRandomGameQuestion(): Promise<Question> { 
    return this.getRandomQuestionES(this.QUESTIONS_INDEX, 1, "", [2, 5, 7, 8], [], []).then((hits)=>{
      //convert hit to Question
      return Question.getViewModelFromES(hits[0]);
    });  
  }

  static getSearchResults(index: string, start: number, size: number, criteria: SearchCriteria): Promise<any>
  {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    let body = {
      "aggregations" : {
        "category_counts" : {
          "terms": {"field": "categoryIds"}
        },
        "tag_counts" : {
          "terms": {"field": "tags", "size": 10}
        }
      }  
    };

    if (criteria) {
      let catFilter = null;
      let tagFilter = null;
      let aggs = null;
      if (criteria.categoryIds && criteria.categoryIds.length > 0) {
        catFilter = { "terms" : { "categoryIds" : criteria.categoryIds } };
        aggs = { 
                  "filter" : { 
                    "terms": { "categoryIds": criteria.categoryIds } 
                  },
                  "aggs": {
                    "tag_counts" : {
                      "terms": {"field": "tags", "size": 10}
                    }
                  }
                };
      }
      if (catFilter) {
        body["filter"] = catFilter;
      }
      if (criteria.tags && criteria.tags.length > 0) {
        tagFilter = { "terms" : { "tags" : criteria.tags } };
        body["query"] = { "bool" : { "filter": tagFilter } };
      }

      if (aggs) {
        body["aggregations"]["tags_in_categories"] = aggs;
      }

      //sortOrder
      switch (criteria.sortOrder) {
        case "Category":
          body["sort"] = [{ "categoryIds" : {"order" : "asc"} }];
          break;
        case "Status":
          body["sort"] = [{ "status" : {"order" : "asc"} }];
          break;
      }
    }


    return client.search({
      "index": index,
      "from": start,
      "size": size,
      "body": body
    }).then(function (body) {
      return(body);
    }, function (error) {
      console.trace(error.message);
      throw(error);
    });
  }

  static getRandomItems(index: string, size: number, seed: string): Promise<any>
  {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    return client.search({
      "index": index,
      "size": size,
      "body": {
        "query" : {
          "function_score": {
            "functions": [
                {
                  "random_score": {
                      "seed": (seed === "") ? null : seed
                  }
                }
            ]
          }
        }
      }
    }).then(function (body) {
      return(body.hits.hits);
    }, function (error) {
      console.trace(error.message);
      throw(error);
    });
  }

  static getRandomQuestionES(index: string, size: number, seed: string,
                            categories: number[], tags: string[], excludeIds: string[]): Promise<any>
  {
    const client: Elasticsearch.Client = this.getElasticSearchClient();
    index = this.getIndex(index);

    let filter = null;
    let randomSeed = (seed === "") ? null : seed;
    if (categories && categories.length > 0) {
      filter = { "terms" : { "categoryIds" : categories } };
    }

    return client.search({
      "index": index,
      "size": size,
      "body": {
        "query" : {
          "function_score": {
            "query": {
              "bool": {
                "must": { "match_all": {} },
                "must_not": [{ "ids": { "values": excludeIds } }],
                "filter": filter
              }
            },
            "functions": [
                {
                  "random_score": {"seed": randomSeed}
                }
            ]
          }
        }
      }
    }).then(function (body) {
      return(body.hits.hits);
    }, function (error) {
      console.trace(error.message);        
      throw(error);
    });
  }
}
