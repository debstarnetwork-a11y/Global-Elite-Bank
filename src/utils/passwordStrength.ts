export interface PasswordStrengthResult {
  score: number; // 0 (empty), 1 (weak), 2 (medium), 3 (strong)
  label: 'Weak' | 'Medium' | 'Strong';
  isValid: boolean;
  hasMinLength: boolean;
  hasLetters: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasMixedCase: boolean;
  hasMix: boolean;
  feedback: string;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const str = password || '';
  const length = str.length;

  const hasMinLength = length >= 6;
  const hasLetters = /[a-zA-Z]/.test(str);
  const hasNumbers = /\d/.test(str);
  const hasSymbols = /[^a-zA-Z0-9]/.test(str);
  const hasMixedCase = /[a-z]/.test(str) && /[A-Z]/.test(str);

  // Mix of characters: at least 2 distinct character categories (letters + numbers, letters + symbols, numbers + symbols)
  const typeCount = (hasLetters ? 1 : 0) + (hasNumbers ? 1 : 0) + (hasSymbols ? 1 : 0);
  const hasMix = typeCount >= 2;

  // Validity rule: minimum 6 chars and a mix of characters
  const isValid = hasMinLength && hasMix;

  if (length === 0) {
    return {
      score: 0,
      label: 'Weak',
      isValid: false,
      hasMinLength: false,
      hasLetters: false,
      hasNumbers: false,
      hasSymbols: false,
      hasMixedCase: false,
      hasMix: false,
      feedback: 'Enter at least 6 characters with a mix of characters',
    };
  }

  if (!hasMinLength || !hasMix) {
    let feedback = 'Weak password. ';
    if (!hasMinLength && !hasMix) {
      feedback += 'Must be at least 6 characters with a mix of characters.';
    } else if (!hasMinLength) {
      feedback += 'Must be at least 6 characters.';
    } else {
      feedback += 'Must include a mix of letters and numbers or symbols.';
    }
    return {
      score: 1,
      label: 'Weak',
      isValid: false,
      hasMinLength,
      hasLetters,
      hasNumbers,
      hasSymbols,
      hasMixedCase,
      hasMix,
      feedback,
    };
  }

  // Strong criteria:
  // Length >= 8 with 3 types (letters, numbers, symbols), or length >= 8 with mixed case and numbers, or length >= 10 with mix
  const isStrong =
    (length >= 8 && typeCount >= 3) ||
    (length >= 8 && hasMixedCase && hasNumbers) ||
    (length >= 10 && hasMix);

  if (isStrong) {
    return {
      score: 3,
      label: 'Strong',
      isValid: true,
      hasMinLength,
      hasLetters,
      hasNumbers,
      hasSymbols,
      hasMixedCase,
      hasMix,
      feedback: 'Strong password meeting all security standards.',
    };
  }

  return {
    score: 2,
    label: 'Medium',
    isValid: true,
    hasMinLength,
    hasLetters,
    hasNumbers,
    hasSymbols,
    hasMixedCase,
    hasMix,
    feedback: 'Medium strength. Add symbols or mixed case for a strong password.',
  };
}

export function validateNewPassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 6) {
    return {
      valid: false,
      error: 'New password must be at least 6 characters long.',
    };
  }
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);
  const typeCount = (hasLetters ? 1 : 0) + (hasNumbers ? 1 : 0) + (hasSymbols ? 1 : 0);

  if (typeCount < 2) {
    return {
      valid: false,
      error: 'New password must contain a mix of characters (letters and numbers/symbols).',
    };
  }

  return { valid: true };
}
