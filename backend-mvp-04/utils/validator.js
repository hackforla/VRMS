const ValidationError = require('../errors/validation.error');

class Validator {
  static isNotEmpty(str) {
    if (str === null) {
      throw new ValidationError('String is empty - Null string is not allowed.');
    }

    str = str.trim();

    if (str === '') {
      throw new ValidationError('String is empty - Empty string is not allowed.');
    }
  }

  static isSafe(str) {
    if (str !== null && str.search(/[$:{}]+/) !== -1) {
      throw new ValidationError(`String contains unsafe characters: ${str}`);
    }
  }

  static isNoLonger(str, length) {
    if (str !== null && str.length > length) {
      throw new ValidationError(`String is longer than ${length} characters: ${str}`);
    }
  }

  static isEmail(value) {
    const pattern = /\b[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;
    if (value.search(pattern) === -1) {
      throw new ValidationError(`String is not valid Email address: ${value}`);
    }
  }
}

module.exports = Validator;
