import { Game, Question, Category } from '../src/app/model';

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

  static createOrUpdateIndex(index: string, type: string, data: any, key: string): Promise<any> {
    let client: Elasticsearch.Client = this.getElasticSearchClient();

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
    let client: Elasticsearch.Client = this.getElasticSearchClient();

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
    let client: Elasticsearch.Client = this.getElasticSearchClient();

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
    let client: Elasticsearch.Client = this.getElasticSearchClient();

    //delete entire index
    return this.deleteIndex(index)
    .then((response) => {
      let body = [];
      //TODO: build bulk index in batches (maybe 1000 at a time)
      data.forEach(d => {
        body.push({ index:  { _index: index, _type: d.type, _id: d.id } });
        body.push(d.source);
      });
      client.bulk({"body": body});

      console.log("All items indexed");
    })
    .catch((error) => {
      console.log(error);
      throw(error);
    });   
  }

  static getRandomQuestionOfTheDay(): Promise<any> { 
    let date = new Date();
    let seed = date.getUTCFullYear().toString() + date.getUTCMonth().toString() + date.getUTCDate().toString();
    return this.getRandomItems(this.QUESTIONS_INDEX, 1, seed).then((hits)=>{
      //convert hit to Question
      return Question.getViewModelFromES(hits[0]);
    });  
  }

  static getRandomGameQuestion(): Promise<any> { 
    return this.getRandomQuestionES(this.QUESTIONS_INDEX, 1, "", [2, 5, 7, 8], [], []).then((hits)=>{
      //convert hit to Question
      return Question.getViewModelFromES(hits[0]);
    });  
  }

  static getRandomItems(index: string, size: number, seed: string): Promise<any>
  {
    let client: Elasticsearch.Client = this.getElasticSearchClient();

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
    let client: Elasticsearch.Client = this.getElasticSearchClient();

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
