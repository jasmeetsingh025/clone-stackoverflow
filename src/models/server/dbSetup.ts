import { db } from '../name';
import createAnswerCollection from './answer.collection';
import createQuestionCollection from './question.collection';
import createCommentCollection from './comment.collection';
import createVoteCollection from './vote.collection';
import { databases } from './config';

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log('Database Connection Established');
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log('Database Created');

      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);
      console.log('Collections Created');
      console.log('Database Setup Complete');
    } catch (error) {
      console.error('Error creating database or collections:', error);
    }
  }
  return databases;
}
