const STORAGE_KEY = 'family_authed';
const familyCode = import.meta.env.VITE_FAMILY_CODE;

export const isAuthed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const verifyPassword = (input) => {
  if (!familyCode) return false;
  return (input || '').trim() === String(familyCode);
};

export const setAuthed = () => {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // ignore
  }
};
