// Lightweight validation utilities used across forms
export function validateName(name) {
  if (!name || !name.toString().trim()) {
    return { valid: false, message: 'Name is required' };
  }
  const value = name.toString().trim();
  if (value.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
  if (/^\d+$/.test(value)) return { valid: false, message: 'Name cannot be numeric only' };
  if (!/[A-Za-z]/.test(value)) return { valid: false, message: 'Name must include letters' };
  return { valid: true };
}

export function validateEmail(email) {
  if (!email || !email.toString().trim()) return { valid: false, message: 'Email is required' };
  const v = email.toString().trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(v) ? { valid: true } : { valid: false, message: 'Enter a valid email address' };
}

export function validatePassword(password, { minLength = 6 } = {}) {
  if (!password) return { valid: false, message: `Password is required` };
  if (password.length < minLength) return { valid: false, message: `Password must be at least ${minLength} characters` };
  return { valid: true };
}

export function validatePasswordMatch(password, confirm) {
  if (password !== confirm) return { valid: false, message: 'Passwords do not match' };
  return { valid: true };
}

export function validateNotEmpty(value, fieldName = 'Field') {
  if (!value && value !== 0) return { valid: false, message: `${fieldName} is required` };
  if (typeof value === 'string' && !value.trim()) return { valid: false, message: `${fieldName} is required` };
  return { valid: true };
}

export function validateDateNotPast(dateStr) {
  if (!dateStr) return { valid: false, message: 'Date is required' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { valid: false, message: 'Invalid date' };
  const today = new Date();
  today.setHours(0,0,0,0);
  if (d < today) return { valid: false, message: 'Date cannot be in the past' };
  return { valid: true };
}

export default {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateNotEmpty,
  validateDateNotPast,
};
