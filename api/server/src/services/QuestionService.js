import isEmpty from 'lodash/isEmpty';
import sequelize, { Op } from 'sequelize';

import database from '../models';

class QuestionService {

  static async getLanguageQuestions(id, excludedQuestion, limit) {
    console.info('excludedQuestion2!!!', excludedQuestion);
    if (Number(id) === Number(process.env.ALL_LANGUAGES_ID)) {
      if (isEmpty(excludedQuestion)) {
        const languageQuestions = database.Question.findAll({
          order: sequelize.literal('random()'),
          include: [
            {
              model: database.Language,
            },
            {
              model: database.QuestionTag,
              include: {
                model: database.Tag,
              }
            }
          ],
          limit
        });
        return languageQuestions;
      }

      const languageQuestions = database.Question.findAll({
        where: {
          [ Op.not ]:[
            {
              id: excludedQuestion
            }
          ]
        },
        include: {
          model: database.Language,
        },
        order: sequelize.literal('random()'),
        limit
      });
      console.info('languageQuestions!!!', languageQuestions);
      return languageQuestions;
    }
    if (isEmpty(excludedQuestion)) {
      const languageQuestions = database.Question.findAll({
        where: {
          LanguageId: Number(id),
        },
        include: {
          model: database.Language,
        },
        order: sequelize.literal('random()'),
        limit
      });
      return languageQuestions;
    }

    const languageQuestions = database.Question.findAll({
      where: {
        LanguageId: Number(id),
        [ Op.not ]:[
          {
            id: excludedQuestion
          }
        ]
      },
      include: {
        model: database.Language,
      },
      order: sequelize.literal('random()'),
      limit
    });
    console.info('languageQuestions!!!', languageQuestions);
    return languageQuestions;
  }

  static async createQuestion(newQuestion) {
    const createdQuestion = await database.Question.create(newQuestion);
    console.info('createdQuestion in service!!!!', createdQuestion);
    return createdQuestion;
  }

  static async updateQuestion(updatedQuestion, id) {
    const questionToUpdate = await database.Question.findOne({
      where: {id: Number(id)}
    });
    if (questionToUpdate) {
      await database.Question.update(updatedQuestion, {
        where: {id: Number(id)}
      });
      return updatedQuestion;
    }
    return null;
  }

}

export default QuestionService;

