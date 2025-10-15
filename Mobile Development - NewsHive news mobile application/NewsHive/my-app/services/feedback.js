// services/feedback.js
import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Save a feedback message for the current user.
 * Requires the user to be signed in (your rules enforce this).
 */
export async function addFeedback({ subject = '', message }) {
  const uid = auth?.currentUser?.uid;
  if (!uid) {
    const e = new Error('You must be signed in to send feedback.');
    e.code = 'auth/not-signed-in';
    throw e;
  }

  const cleanSubject = String(subject).trim();
  const cleanMessage = String(message).trim();

  if (!cleanMessage) {
    const e = new Error('Please enter your feedback message.');
    e.code = 'validation/empty-message';
    throw e;
  }

  // Write to top-level "feedback" collection (per your rules)
  await addDoc(collection(db, 'feedback'), {
    uid,
    subject: cleanSubject || null,
    message: cleanMessage,
    created_at: serverTimestamp(),
  });
}
