// services/profile.js
import { auth, db } from './firebase';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp, deleteDoc } from 'firebase/firestore';

// ---------- helpers ----------
function toTimestamp(dateOrNull) {
  if (!dateOrNull) return null;
  if (dateOrNull instanceof Date) return Timestamp.fromDate(dateOrNull);
  if (dateOrNull?.seconds !== undefined) return dateOrNull;
  return null;
}
// -----------------------------

export async function getOwnerProfile() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in.');
  const ref = doc(db, 'owners', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() || {};
  return {
    firstName: data.firstName ?? data.first_name ?? '',
    lastName: data.lastName ?? data.last_name ?? '',
    email: data.email ?? user.email ?? '',
    phoneNumber: data.phoneNumber ?? data.phone_number ?? '',
    dateOfBirth: data.dateOfBirth ?? data.date_of_birth ?? null,
    address: data.address ?? '',
    createdAt: data.createdAt ?? data.created_at ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

export async function saveOwnerProfile({ firstName, lastName, phoneNumber, dateOfBirth, address }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in.');
  const ref = doc(db, 'owners', user.uid);

  const payload = {
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    email: user.email || null,
    phoneNumber: phoneNumber ?? null,
    dateOfBirth: toTimestamp(dateOfBirth),
    address: address ?? null,
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, payload, { merge: true });
}

/**
 * Reauth the current user with their current password, then set a new password.
 * @param {{ currentPassword: string, newPassword: string }}
 */
export async function changePasswordWithReauth({ currentPassword, newPassword }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in.');
  if (!user.email) throw new Error('Email not available on user.');

  // Re-authenticate (required by Firebase for sensitive actions)
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);

  // Update password
  await updatePassword(user, newPassword);
}

/**
 * Permanently delete the current account after reauth.
 * Also deletes owners/{uid} in Firestore (adjust if you keep more data).
 * @param {{ currentPassword: string }}
 */
export async function deleteMyAccount({ currentPassword }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in.');
  if (!user.email) throw new Error('Email not available on user.');

  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);

  // (Optional) remove profile doc
  try {
    await deleteDoc(doc(db, 'owners', user.uid));
  } catch (e) {
    // ignore if doc missing — account deletion should still proceed
  }

  await deleteUser(user);
}
