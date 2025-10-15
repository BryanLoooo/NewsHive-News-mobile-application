// services/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// Observe login state
export const watchAuth = (cb) => onAuthStateChanged(auth, cb);

// ---------- helpers ----------
const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);

// very light SG-friendly phone check; tweak as needed
// Accepts +6591234567 OR 91234567 (will normalize to +65...)
function normalizePhone(input) {
  if (!input) return '';
  const digits = input.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  // If it looks like an 8-digit local number, assume +65
  if (/^\d{8}$/.test(digits)) return `+65${digits}`;
  return digits; // fallback
}

function parseDOBToTimestamp(dobStr) {
  // Expect "YYYY-MM-DD"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) return null;
  const d = new Date(`${dobStr}T00:00:00Z`);
  return isNaN(d.getTime()) ? null : Timestamp.fromDate(d);
}

// --------------------------------

export async function register({
  firstName,
  lastName,
  email,
  phoneNumber,
  dateOfBirth, // "YYYY-MM-DD"
  address,
  password,
}) {
  if (!firstName || !lastName || !email || !password) {
    throw new Error('Missing required fields.');
  }
  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const normalizedPhone = normalizePhone(phoneNumber);
  const dobTs = dateOfBirth ? parseDOBToTimestamp(dateOfBirth) : null;
  if (dateOfBirth && !dobTs) {
    throw new Error('Date of birth must be in YYYY-MM-DD format.');
  }

  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(cred.user, { displayName: `${firstName} ${lastName}` });

  // Store profile in Firestore (owners collection as per your app)
  await setDoc(doc(db, 'owners', cred.user.uid), {
    firstName,
    lastName,
    email: cred.user.email,
    phoneNumber: normalizedPhone || null,
    dateOfBirth: dobTs || null,
    address: address || null,
    createdAt: serverTimestamp(),
  });

  return cred.user;
}

export async function login({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}
