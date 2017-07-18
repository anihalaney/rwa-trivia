import { Game, Question, Category } from '../src/app/model';
import { ESUtils } from './ESUtils';

const functions = require('firebase-functions');

exports.onQuestionWrite = functions.database.ref('/questions/published/{questionId}').onWrite(event => {
  //console.log(event.params.questionId);
  //console.log(event.params);
  //console.log(event.data);
  //console.log(event);

  //let esUtils = new ESUtils();
  //getCategories().then(function (categories: Category[]) {
    //console.log(categories);
    if (event.data.exists()) 
      //add or update
      ESUtils.createOrUpdateIndex(ESUtils.QUESTIONS_INDEX, event.data.val().categoryIds["0"], event.data.val(), event.params.questionId);
    else
      //delete
      ESUtils.removeIndex(ESUtils.QUESTIONS_INDEX, event.params.questionId);
  //});
});

