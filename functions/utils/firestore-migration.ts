import { Category, Game, Question, CollectionConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class FirestoreMigration {

  static async migrateCategories(): Promise<Category[]> {
    try {
      // const admin = admin;
      const categories: Category[] = [];
      const catRef = admin.database().ref(`/${CollectionConstants.CATEGORIES}`);
      return catRef.once(GeneralConstants.VALUE, (cs) => {
        for (const c of cs) {
          // console.log(c.key);
          console.log(c.val());
          const category: Category = {
            'id': c.val()[GeneralConstants.ID],
            'categoryName': c.val()[GeneralConstants.CATEGORY_NAME],
            'requiredForGamePlay': (c.val()[GeneralConstants.Required_For_Game_Play]) ? true : false
          };
          categories.push(category);
        }

        console.log(categories);

        const batch = admin.firestore().batch();
        for (const category of categories) {
          const doc = admin.firestore().doc(`${CollectionConstants.CATEGORIES}/${category.id}`);
          console.log(doc);
          batch.set(doc, category);

          // const catCollection = admin.firestore().collection('categories');
        }
        console.log('Commiting categories batch');
        batch.commit();
        return categories;
      });
    } catch (error) {
      return Utils.throwError(error);
    }
  }

  static async migrateTags(): Promise<string[]> {
    try {
      // const promise = new Promise<string[]>(resolve, reject);
      // const admin = migrateFireBaseClient;
      const tags: string[] = [];
      const tagRef = admin.database().ref(`/${CollectionConstants.TAG_LIST}`);
      return tagRef.once(GeneralConstants.VALUE, (ts) => {
        for (const t of ts) {
          // console.log(c.key);
          console.log(t.val());
          tags.push(t.val());
        }
        console.log(tags);
        const batch = admin.firestore().batch();
        const doc = admin.firestore().doc(CollectionConstants.LISTS_FORWARD_SLASH_TAGS);
        console.log(doc);
        batch.set(doc, { 'tagList': tags });
        console.log('Commiting Tags batch');
        batch.commit();
        return tags;
      });
    } catch (error) {
      return Utils.throwError(error);
    }
  }

  static async migrateQuestions(sourceList, destinationCollection): Promise<number> {
    try {
      // const admin = migrateFireBaseClient;
      const questions: Question[] = [];
      const qRef = admin.database().ref(sourceList);
      return qRef.once(GeneralConstants.VALUE, async (qs) => {
        for (const q of qs) {
          // console.log(c.key);
          console.log(q.val());
          const question: Question = q.val();
          question.id = q.key;
          questions.push(question);
        }

        console.log(questions[0]);

        const l = await FirestoreMigration.firestoreBatchWrite(destinationCollection, questions, GeneralConstants.ID, 0, admin.firestore());
        return l;
      });
    } catch (error) {
      return Utils.throwError(error);
    }
  }

  static async migrateGames(sourceList, destinationCollection): Promise<number> {
    try {
      // const admin = migrateFireBaseClient;
      const games: Game[] = [];
      const gRef = admin.database().ref(sourceList);
      return gRef.once(GeneralConstants.VALUE, async (gs) => {
        for (const g of gs) {
          // console.log(c.key);
          const game = { 'id': g.key, ...g.val() };
          for (let i = 0; i < game.playerIds.length; i++) {
            // array to map as firestore cannot query arrays yet
            game[`${GeneralConstants.PLAYER_ID_}${i}`] = game.playerIds[i];
          }
          game.gameOver = (game.gameOver) ? true : false;
          console.log(game);
          games.push(game);
        }

        console.log(games[0]);

        return await FirestoreMigration.firestoreBatchWrite(destinationCollection, games, GeneralConstants.ID, 0, admin.firestore());

      });
    } catch (error) {
      return Utils.throwError(error);
    }
  }

  private static async firestoreBatchWrite(collection: string, dataItems: any[], idField: string,
    start: number, firestore: any): Promise<number> {
    const BATCH_SIZE = 100;
    try {
      const arr = dataItems.slice(start, start + BATCH_SIZE);

      if (arr.length === 0) {
        return await dataItems.length;
      }

      const batch = await firestore.batch();
      for (const item of arr) {
        const doc = await firestore.doc(`${collection}/${item[idField]}`);
        console.log(doc);
        batch.set(doc, item);
      }
      console.log('Commiting questions batch: ' + start);
      await batch.commit();
      return await FirestoreMigration.firestoreBatchWrite(collection, dataItems, idField, start + BATCH_SIZE, firestore);
    } catch (error) {
      return Utils.throwError(error);
    }

  }

}



