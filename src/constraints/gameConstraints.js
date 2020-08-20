const required = { allowEmpty: false, message: 'This field is required.' };

// eslint-disable-next-line import/prefer-default-export
export const gameConstraints = {
  title: {
    presence: required,
    length: {
      minimum: 3,
      maximum: 32,
      tooShort: 'The title must be between 3 and 32 characters.',
      tooLong: 'The title must be between 3 and 32 characters.',
    },
  },
  day: {
    presence: required,
    selector: true,
  },
  startTime: {
    presence: required,
    format: {
      pattern: '[0-9]{2}:[0-9]{2}',
      message: 'Enter a valid time',
    },
  },
  endTime: {
    presence: required,
    format: {
      pattern: '([0-1]?[0-9]|2[0-3]):[0-5][0-9]',
      message: 'Enter a valid time',
    },
  },
  area: {
    length: {
      maximum: 1024,
      tooLong: 'Max length of this field is 1024 characters.',
    },
  },
  location: {
    length: {
      maximum: 32,
      tooLong: 'The location must be between 3 and 32 characters.',
    },
  },
  playerCount: {
    numericality: {
      onlyInteger: true,
      strict: true,
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 16,
      message: 'Player count must be between 0 and 16.',
    },
  },
};
