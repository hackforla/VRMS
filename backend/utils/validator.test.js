const Validator = require('./validator');
const ValidationError = require('../errors/validation.error');


describe('Validator tests', () => {
  test('String is Empty or not empty', async (done) => {

    const validString = "Test";

    expect(Validator.isNotEmpty(validString)).toBeUndefined();

    const nullString = null;

    expect(() => {
      Validator.isNotEmpty(nullString);
    }).toThrow(ValidationError);

    const emptyString = "";

    expect(() => {
      Validator.isNotEmpty(emptyString);
    }).toThrow(ValidationError);

    const whiteSpaceString = "      ";

    expect(() => {
      Validator.isNotEmpty(whiteSpaceString);
    }).toThrow(ValidationError);

    done();
  });

  test('String is Safe', async (done) => {

    const validString = "Test";

    expect(Validator.isSafe(validString)).toBeUndefined();

    const nullString = null;

    expect(Validator.isSafe(nullString)).toBeUndefined();


    const emptyString = "";


    expect(Validator.isSafe(emptyString)).toBeUndefined();

    const unsafeString1 = "$";

    expect(() => {
      Validator.isSafe(unsafeString1);
    }).toThrow(ValidationError);

    const unsafeString2 = ":";

    expect(() => {
      Validator.isSafe(unsafeString2);
    }).toThrow(ValidationError);

    const unsafeString3 = "{";

    expect(() => {
      Validator.isSafe(unsafeString3);
    }).toThrow(ValidationError);

    const unsafeString4 = "}";

    expect(() => {
      Validator.isSafe(unsafeString4);
    }).toThrow(ValidationError);

    done();
  });

  test('String is no longer than specified length', async (done) => {

    const validString = "Test";

    expect(Validator.isNoLonger(validString, 4)).toBeUndefined();

    const nullString = null;

    expect(Validator.isNoLonger(nullString, 4)).toBeUndefined();

    const invalidString1 = "Test1";

    expect(() => {
      Validator.isNoLonger(invalidString1, 4);
    }).toThrow(ValidationError);
    

    done();
  });



  test('String is valid email address', async (done) => {

    
    const validString = "foo@bar.com";

    expect(Validator.isEmail(validString)).toBeUndefined();

    const invalidEmail1 = "plainaddress";

    expect(() => {
      Validator.isEmail(invalidEmail1);
    }).toThrow(ValidationError);

    const invalidEmail2 = "@example.com";

    expect(() => {
      Validator.isEmail(invalidEmail2);
    }).toThrow(ValidationError);


    const invalidEmail3 = "email@example";

    expect(() => {
      Validator.isEmail(invalidEmail3);
    }).toThrow(ValidationError);

    done();
  });

 
});
