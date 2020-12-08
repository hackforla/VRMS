const ValidationError = require('../errors/validation.error');


class Validator {

    static isNotEmpty(str) 
    {
        if(str === null)
        {
            throw new ValidationError('string is empty')
        }

        str = str.trim();

        if(str === '')
        {
            throw new ValidationError('string is empty')

        }
    }


    static isSafe(str) 
    {        
        if(str !== null && str.search(/[$:{}]+/) !== -1) 
        {
            throw new ValidationError('string contains unsafe characters')
        }
    }

    static isNoLonger(str, length)
    {
        if(str !== null && str.length > length) 
        {
            throw new ValidationError(`string is longer than ${length}`);
        }
    }

    static isEmail(value) 
    {
        const pattern = /\b[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;
        if (value.search(pattern) === -1)
        {
            throw new ValidationError(`string is not valid Email address`);
        }
    }

  }

  module.exports = Validator;
