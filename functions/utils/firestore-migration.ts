import { Game, Question, Category, SearchResults, SearchCriteria } from '../../projects/shared-library/src/lib/shared/model';
const migrateFireBaseClient = require('../db/firebase-client');

export class FirestoreMigration {


  migrateCategories = new Promise<Category[]>((resolve, reject) => {
    const admin = migrateFireBaseClient;
    const categories: Category[] = [];
    const catRef = admin.database().ref('/categories');
    catRef.once('value', function (cs) {
      cs.forEach(c => {
        // console.log(c.key);
        console.log(c.val());
        const category: Category = {
          'id': c.val()['id'],
          'categoryName': c.val()['categoryName'],
          'requiredForGamePlay': (c.val()['requiredForGamePlay']) ? true : false
        };
        categories.push(category);
      })

      console.log(categories);

      const batch = admin.firestore().batch();
      categories.forEach(category => {
        const doc = admin.firestore().doc('categories/' + category.id);
        console.log(doc);
        batch.set(doc, category);

        // const catCollection = admin.firestore().collection('categories');
      });
      console.log('Commiting categories batch');
      batch.commit();
      resolve(categories);
    });
  });

  migrateTags = new Promise<string[]>((resolve, reject) => {

    // const promise = new Promise<string[]>(resolve, reject);
    const admin = migrateFireBaseClient;
    const tags: string[] = [];
    const tagRef = admin.database().ref('/tagList');
    tagRef.once('value', (ts) => {
      ts.forEach(t => {
        // console.log(c.key);
        console.log(t.val());
        tags.push(t.val());
      });

      console.log(tags);

      const batch = admin.firestore().batch();
      const doc = admin.firestore().doc('lists/tags');
      console.log(doc);
      batch.set(doc, { 'tagList': tags });
      console.log('Commiting Tags batch');
      batch.commit();
      resolve(tags);
    });
  });

  migrateQuestions(sourceList, destinationCollection) {
    return new Promise<number>((resolve, reject) => {
      const admin = migrateFireBaseClient;
      const questions: Question[] = [];
      const qRef = admin.database().ref(sourceList);
      qRef.once('value', function (qs) {
        qs.forEach(q => {
          // console.log(c.key);
          console.log(q.val());
          const question: Question = q.val();
          question.id = q.key;
          questions.push(question);
        })

        console.log(questions[0]);

        firestoreBatchWrite(destinationCollection, questions, 'id', 0, admin.firestore()).then(l => {
          resolve(l);
        });
      });
    });
  }

  migrateGames(sourceList, destinationCollection) {
    return new Promise<number>((resolve, reject) => {
      const admin = migrateFireBaseClient;
      const games: Game[] = [];
      const gRef = admin.database().ref(sourceList);
      gRef.once('value', function (gs) {
        gs.forEach(g => {
          // console.log(c.key);
          const game = { 'id': g.key, ...g.val() };
          for (let i = 0; i < game.playerIds.length; i++) {
            // array to map as firestore cannot query arrays yet
            game['playerId_' + i] = game.playerIds[i];
          }
          game.gameOver = (game.gameOver) ? true : false;
          console.log(game);
          games.push(game);
        })

        console.log(games[0]);

        firestoreBatchWrite(destinationCollection, games, 'id', 0, admin.firestore()).then(l => {
          resolve(l);
        });
      });
    });
  }

}

const BATCH_SIZE = 100;
function firestoreBatchWrite(collection: string, dataItems: any[], idField: string,
  start: number, firestore: any): Promise<number> {
  const arr = dataItems.slice(start, start + BATCH_SIZE);

  if (arr.length === 0) {
    return Promise.resolve(dataItems.length);
  }

  const batch = firestore.batch();
  arr.forEach(item => {
    const doc = firestore.doc(collection + '/' + item[idField]);
    console.log(doc);
    batch.set(doc, item);
  });
  console.log('Commiting questions batch: ' + start);
  return batch.commit().then(() => {
    return firestoreBatchWrite(collection, dataItems, idField, start + BATCH_SIZE, firestore);
  });

}
