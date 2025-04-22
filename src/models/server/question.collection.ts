import { IndexType, Permission } from 'node-appwrite';
import { db, questionCollection } from '../name';
import { databases } from './config';

export default async function createQuestionCollection() {
  //Create the collection
  const collection = await databases.createCollection(
    db,
    questionCollection,
    questionCollection,
    [
      Permission.read('any'),
      Permission.read('users'),
      Permission.create('users'),
      Permission.update('users'),
      Permission.delete('users'),
    ]
  );
  console.log('Collection created:', collection.name);
  //Creating the indexes and attributes
  await Promise.all([
    databases.createStringAttribute(db, questionCollection, 'title', 100, true),
    databases.createStringAttribute(
      db,
      questionCollection,
      'content',
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      'authorId',
      50,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      'attachmentId',
      50,
      false
    ),
  ]);

  await Promise.all([
    databases.createIndex(
      db,
      questionCollection,
      'title',
      IndexType.Fulltext,
      ['title'],
      ['asc']
    ),
    databases.createIndex(
      db,
      questionCollection,
      'content',
      IndexType.Fulltext,
      ['content'],
      ['asc']
    ),
  ]);
  return collection;
}
