const required = { allowEmpty: false, message: 'This field is required.' };

export const regCodeConstraint = {
  value: {
    presence: required,
    length: {
      is: 10,
      wrongLength: 'Enter a valid registration code.',
    },
    format: {
      pattern: '[A-Z|0-9]+',
      message: 'Enter a valid registration code.',
    },
  },
};

export const nameConstraint = (label) => ({
  value: {
    presence: required,
    length: {
      minimum: 3,
      maximum: 32,
      tooShort: 'The name must be between 3 and 32 characters.',
      tooLong: 'The name must be between 3 and 32 characters.',
    },
    format: {
      pattern: '\\p{L}+',
      flags: 'u',
      message: `The ${label.toLowerCase()} must only contain alpha characters.`,
    },
  },
});

export const emailConstraint = {
  value: {
    presence: required,
    email: {
      message: 'Enter a valid email address.',
    },
  },
};

export const phoneConstraint = {
  value: {
    presence: required,
    length: {
      is: 10,
      wrongLength: 'Enter a valid phone number.',
    },
    format: {
      pattern: '[0-9]+',
      message: 'Enter a valid phone number.',
    },
  },
};

export const cnpConstraint = {
  value: {
    presence: required,
    length: {
      is: 13,
      wrongLength: 'Enter a valid CNP.',
    },
    cnp: true,
  },
};

export const usernameConstraint = {
  value: {
    presence: required,
    length: {
      minimum: 4,
      maximum: 25,
      tooShort: 'The username must be between 4 and 32 characters.',
      tooLong: 'The username must be between 4 and 32 characters.',
    },
    format: {
      pattern: '[a-z|0-9|\\.|_]+',
      message: 'The usernames must only contain alphanumeric characters.',
    },
  },
};

export const passwordConstraint = {
  value: {
    presence: required,
    length: {
      minimum: 8,
      maximum: 128,
      tooShort: 'The password must be between 8 and 128 characters.',
      tooLong: 'The password must be between 8 and 128 characters.',
    },
    password: true,
  },
};

export const confirmPasswordConstraint = {
  value: {
    presence: required,
    confirmPassword: true,
  },
};
