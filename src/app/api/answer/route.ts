import { answerCollection, db } from '@/models/name';
import { databases, users } from '@/models/server/config';
import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';
import { UserPrefs } from '@/store/Auth';

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();
    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      { content: answer, questionId, authorId }
    );
    // Inc author reputation
    const prefs = await users.getPrefs<UserPrefs>(authorId);
    await users.updatePrefs<UserPrefs>(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error creating answer' },
      { status: error?.status || 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();
    const isAnswerExists = await databases.getDocument(
      db,
      answerCollection,
      answerId
    );
    if (!isAnswerExists) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }
    const response = await databases.deleteDocument(
      db,
      answerCollection,
      answerId
    );
    // Dec author reputation
    const prefs = await users.getPrefs<UserPrefs>(isAnswerExists.authorId);
    await users.updatePrefs<UserPrefs>(isAnswerExists.authorId, {
      reputation: Number(prefs.reputation) - 1,
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error deleting answer' },
      { status: error?.status || error?.code || 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { answerID, answer } = await request.json();
    const isAnswerExists = await databases.getDocument(
      db,
      answerCollection,
      answerID
    );
    if (!isAnswerExists) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }
    const response = await databases.updateDocument(
      db,
      answerCollection,
      answerID,
      { content: answer }
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error updating answer' },
      { status: error?.status || 500 }
    );
  }
}
