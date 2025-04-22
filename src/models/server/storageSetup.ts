import { IndexType, Permission } from 'node-appwrite';
import { questionAttachmentBucket } from '../name';
import { storage } from './config';

export default async function getOrCreateStorage() {
  try {
    const bucket = await storage.getBucket(questionAttachmentBucket);
    console.log('Bucket already exists:', bucket.name);
    return bucket;
  } catch (error) {
    if ((error as { code?: any })?.code === 404) {
      const bucket = await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.read('any'),
          Permission.read('users'),
          Permission.create('users'),
          Permission.update('users'),
          Permission.delete('users'),
        ],
        false,
        undefined,
        undefined,
        ['jpg', 'png', 'gif', 'jpeg', 'webp', 'heic']
      );
      console.log('Bucket created:', bucket.name);
      return bucket;
    } else {
      throw error;
    }
  }
}
