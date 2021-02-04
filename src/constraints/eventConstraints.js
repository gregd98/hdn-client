const required = { allowEmpty: false, message: 'This field is required.' };

// eslint-disable-next-line import/prefer-default-export
export const eventConstraints = {
  name: {
    presence: required,
    length: {
      minimum: 3,
      maximum: 16,
      tooShort: 'The title must be between 3 and 16 characters.',
      tooLong: 'The title must be between 3 and 16 characters.',
    },
  },
  startDate: {
    presence: required,
  },
  endDate: {
    presence: required,
  },
};
