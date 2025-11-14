export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'E-mail jest wymagany';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Podaj prawidłowy adres e-mail';
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Hasło jest wymagane';
  }
  if (password.length < 6) {
    return 'Hasło musi mieć co najmniej 6 znaków';
  }
  return undefined;
};

export const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): string | undefined => {
  if (!confirmPassword) {
    return 'Potwierdzenie hasła jest wymagane';
  }
  if (confirmPassword !== password) {
    return 'Hasła nie są identyczne';
  }
  return undefined;
};

export const validateName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'Imię jest wymagane';
  }
  if (name.trim().length < 2) {
    return 'Imię musi mieć co najmniej 2 znaki';
  }
  return undefined;
};

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value.trim()) {
    return `${fieldName} jest wymagany`;
  }
  return undefined;
};

export const validateTitle = (title: string, fieldName: string = 'Tytuł'): string | undefined => {
  return validateRequired(title, fieldName);
};

export const validateAmount = (amount: string | number): string | undefined => {
  const amountValue = typeof amount === 'string' ? parseFloat(amount.replace(',', '.')) : amount;
  if (isNaN(amountValue) || amountValue <= 0) {
    return 'Kwota musi być większa od 0';
  }
  return undefined;
};

export const validatePositiveNumber = (value: string, fieldName: string): string | undefined => {
  const numValue = parseFloat(value);
  if (!value || isNaN(numValue) || numValue <= 0) {
    return `${fieldName} musi być większy od 0`;
  }
  return undefined;
};

export const validateMinValue = (
  value: string | number,
  min: number,
  fieldName: string
): string | undefined => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue) || numValue < min) {
    return `${fieldName} musi wynosić co najmniej ${min}`;
  }
  return undefined;
};

export const validateDate = (date: Date | null, fieldName: string): string | undefined => {
  if (!date) {
    return `${fieldName} jest wymagana`;
  }
  return undefined;
};

export const validateDateRange = (
  startDate: Date | null,
  endDate: Date | null
): string | undefined => {
  if (!startDate) {
    return 'Data rozpoczęcia jest wymagana';
  }
  if (!endDate) {
    return 'Data zakończenia jest wymagana';
  }
  if (endDate < startDate) {
    return 'Data zakończenia musi być późniejsza niż data rozpoczęcia';
  }
  return undefined;
};

export const validateGroupName = (groupName: string): string | undefined => {
  if (groupName.trim().length < 3) {
    return 'Nazwa grupy musi mieć co najmniej 3 znaki';
  }
  return undefined;
};

export const validateGroupCode = (groupCode: string): string | undefined => {
  if (groupCode.trim().length !== 6) {
    return 'Kod grupy musi mieć 6 znaków';
  }
  return undefined;
};

export const validateDuration = (duration: string): string | undefined => {
  const durationValue = parseInt(duration, 10);
  if (!duration || isNaN(durationValue) || durationValue <= 0) {
    return 'Czas trwania musi być większy od 0';
  }
  if (durationValue < 5) {
    return 'Czas trwania musi wynosić co najmniej 5 minut';
  }
  return undefined;
};

export const validateDateTime = (dateTime: Date | null): string | undefined => {
  if (!dateTime) {
    return 'Data i godzina są wymagane';
  }
  return undefined;
};

export const validateMembersSelection = (
  selectedCount: number,
  isAmountValid: boolean
): string | undefined => {
  if (selectedCount === 0) {
    return 'Wybierz co najmniej jednego członka';
  }
  if (!isAmountValid) {
    return 'Suma kwot musi być równa kwocie całkowitej';
  }
  return undefined;
};
