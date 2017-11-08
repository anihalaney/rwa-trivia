import { Game, Question, Category, SearchResults, SearchCriteria } from '../src/app/model';

export class FirestoreMigration {
  constructor(private admin: any) {}

  migrateCategories = new Promise<Category[]>((resolve, reject) => {
    let admin = this.admin;
    let categories: Category[] = [];
    let catRef = admin.database().ref("/categories");
    catRef.once("value", function(cs) {
      cs.forEach(c => {
        //console.log(c.key);
        console.log(c.val());
        let category: Category = { 
          "id": c.val()["id"], 
          "categoryName": c.val()["categoryName"], 
          "requiredForGamePlay": (c.val()["requiredForGamePlay"]) ? true : false
        };
        categories.push(category);
      })
  
      console.log(categories);
  
      let batch = admin.firestore().batch();
      categories.forEach (category => {
        let doc = admin.firestore().doc("categories/" + category.id);
        console.log(doc);
        batch.set(doc, category);
  
        //let catCollection = admin.firestore().collection("categories");
      });
      console.log("Commiting categories batch");
      batch.commit();
      resolve(categories);
    });
  });

  migrateTags = new Promise<string[]>((resolve, reject) => {
    
    //let promise = new Promise<string[]>(resolve, reject);
    let admin = this.admin;
    let tags: string[] = [];
    let tagRef = admin.database().ref("/tagList");
    tagRef.once("value", (ts) => {
      ts.forEach(t => {
        //console.log(c.key);
        console.log(t.val());
        tags.push(t.val());
      });
  
      console.log(tags);
  
      let batch = admin.firestore().batch();
      let doc = admin.firestore().doc("lists/tags");
      console.log(doc);
      batch.set(doc, {"tagList": tags});
      console.log("Commiting Tags batch");
      batch.commit();
      resolve(tags);
    });
  });

  migrateQuestions(sourceList, destinationCollection) {
    return new Promise<number>((resolve, reject) => {
      let admin = this.admin;
      let questions: Question[] = [];
      let qRef = admin.database().ref(sourceList);
      qRef.once("value", function(qs) {
        qs.forEach(q => {
          //console.log(c.key);
          console.log(q.val());
          let question: Question = q.val();
          question.id = q.key;
          questions.push(question);
        })
    
        console.log(questions[0]);
    
        firestoreBatchWrite(destinationCollection, questions, 0, admin.firestore()).then(l => {
          resolve(l);
        });
      });
    });
  }
}

function firestoreBatchWrite(collection: string, questions: Question[], start: number, firestore: any): Promise<number> {
  let arr = questions.slice(start, start + 100);

  if (arr.length === 0) {
    return Promise.resolve(questions.length);
  }

  let batch = firestore.batch();
  arr.forEach (question => {
    let doc = firestore.doc(collection + "/" + question.id);
    console.log(doc);
    batch.set(doc, question);
  });
  console.log("Commiting questions batch: " + start);
  return batch.commit().then(() => {
    return firestoreBatchWrite(collection, questions, start + 100, firestore);
  });

}
