const DomainError = require('./domain.error');

class DatabaseError extends DomainError {
    constructor(error) {
      super(error.message);
      this.data = { error };
    }
  }

  module.exports = DatabaseError;
