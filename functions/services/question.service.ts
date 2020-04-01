import { CollectionConstants, Question, GeneralConstants, QuestionsConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class QuestionService {

  private static fireStoreClient = admin.firestore();
  private static QC = CollectionConstants.QUESTIONS;
  private static UQC = CollectionConstants.UNPUBLISHED_QUESTIONS;
  private static bucket: any = Utils.getFireStorageBucket(admin);

  /**
   * getAllQuestions
   * return questions
   */
  static async getAllQuestions(): Promise<any> {
    try {
      return Utils.getValesFromFirebaseSnapshot(await QuestionService.fireStoreClient.collection(QuestionService.QC).get());
    } catch (error) {
      return Utils.throwError(error);
    }
  }

  /**
   * getQuestionById
   * return question
   */
  static async getQuestionById(questionId): Promise<any> {
    try {
      const questionResult = await QuestionService.fireStoreClient
        .doc(`/${QuestionService.QC}/${questionId}`)
        .get();
      let question = questionResult.data();
      if (question) {
        question['id'] = (question['id']) ? question['id'] : questionResult['id'];
      } else {
        question = new Question();
      }

      return Question.getViewModelFromDb(question);
    } catch (error) {
      return Utils.throwError(error);
    }
  }

  /**
   * getAllUnpublishedQuestions
   * return questions
   */
  static async getQuestion(collectionName): Promise<any> {
    try {
      return Utils.getValesFromFirebaseSnapshot(await QuestionService.fireStoreClient.collection(`${collectionName}`).get());
    } catch (error) {
      return Utils.throwError(error);
    }
  }

  /**
   * setQuestion
   * return ref
   */
  static async updateQuestion(collectionName: string, question: any, merge: boolean = true): Promise<any> {
    try {
      return await QuestionService.fireStoreClient
        .doc(`/${collectionName}/${question.id}`)
        .set(question, { merge: merge });
    } catch (error) {
      return Utils.throwError(error);
    }
  }


  /**
   * getAllUnpublished Questions
   * return questions
   */
  static async getAllUnpublishedQuestions(): Promise<any> {
    try {
      return Utils.getValesFromFirebaseSnapshot(await QuestionService.fireStoreClient.collection(QuestionService.UQC).get());
    } catch (error) {
      return Utils.throwError(error);
    }
  }


  static async uploadImage(image: String, imageName: number, userId:string): Promise<any> {

    let filePath =
      `questions`;
    const imageBase64 = image.replace(/^data:image\/\w+;base64,/, '');
    let bufferStream = new Buffer(imageBase64, GeneralConstants.BASE64);
    try {
      await QuestionService.uploadQImage(bufferStream, 'image/jpeg', filePath, imageName, userId);
      return;

    } catch (error) {
      return Utils.throwError(error);
    }
  }

  /**
  * upload Question Image
  * return status
 */
  static async uploadQImage(data: any, mimeType: any, filePath: string, imageName: number,userId: string): Promise<any> {
    const stream = require('stream');
    const file = QuestionService.bucket.file(`${filePath}/${imageName}`);
    const dataStream = new stream.PassThrough();
    dataStream.push(data);
    dataStream.push(null);
    mimeType = (mimeType) ? mimeType : dataStream.mimetype;

    return new Promise((resolve, reject) => {
      dataStream.pipe(file.createWriteStream({
        metadata: {
          contentType: mimeType,
          metadata: {
            custom: QuestionsConstants.META_DATA,
            userId: userId,
          }
        }
      }))
        .on(GeneralConstants.ERROR, (error) => {
          Utils.throwError(error);
        })
        .on(GeneralConstants.FINISH, () => {
          resolve(QuestionsConstants.UPLOAD_FINISHED);
        });
    });
  }

  /**
     * generate Quesiton Image
     * return stream
     */
  static async generateQuesitonImage(imageName): Promise<string> {

    const fileName = `questions/${imageName}`;

    const file = QuestionService.bucket.file(fileName);
    try {
      const streamData = await file.download();
      return streamData[0];
    } catch (error) {
      return Utils.throwError(error);
    }

  }

  static async migrateStats(): Promise<any> {
    try {
      const promises = [];
      const questions = await QuestionService.getAllQuestions();
      for (const question of questions) {
        const updateQuestion = { ...question };
        updateQuestion.stats = {
          appeared: updateQuestion.appeared ? updateQuestion.appeared : 0,
          correct: updateQuestion.correct ? updateQuestion.correct : 0,
          wrong: updateQuestion.wrong ? updateQuestion.wrong : 0,
          reactionsCount: updateQuestion.reactionsCount
            ? updateQuestion.reactionsCount
            : { dislike: 0, like: 0 }
        };

        delete question.appeared;
        delete question.correct;
        delete question.wrong;
        delete question.reactionsCount;

        promises.push(
          QuestionService.updateQuestion(QuestionService.QC, updateQuestion, false)
        );
      }

      return await Promise.all(promises);
    } catch (error) {
      return Utils.throwError(error);
    }
  }

  static async deleteQuestionImage(imageName: string, userId: string) {
    const file = QuestionService.bucket.file(`questions/${imageName}`);
    const metaData = await file.getMetadata();
    if(metaData && metaData[0].metadata.userId && metaData[0].metadata.userId === userId){
      file.delete();
      return {'message': 'Deleted !!!'};
    } else{
       return {'message': 'Your have no permission to delete image'};
    }
  }

}

