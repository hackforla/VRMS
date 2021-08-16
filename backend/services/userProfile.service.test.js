const { UserProfileService } = require('./userProfile.service');
const { ModificationLogService } = require('./modificationLog.service');
const DatabaseError = require('../errors/database.error');

const { setupDB } = require('../setup-test');

setupDB('userProfile-service');

describe('UserProfileService can save/update/get user profiles', () => {
  test('Save a user profile record and then retrieve it by the service', async (done) => {
    const newRecordData = { signupEmail: 'FOO@BAR.COM' };

    const result = await UserProfileService.createUser(newRecordData, 'creator@bar.com');

    expect(result.isNew).toBe(false);

    // Verify email address was lowercased
    expect(result.signupEmail).toBe(newRecordData.signupEmail.toLowerCase());

    // verify log record was created
    const logResult = await ModificationLogService.getLogs(result._id, 'UserProfile');

    expect(logResult.length).toBe(1);

    const findUserResult = await UserProfileService.getUser(result._id);
    expect(findUserResult.signupEmail).toBe(result.signupEmail);

    const findUserByEmailResult = await UserProfileService.getUserByEmail(result.signupEmail);
    expect(findUserByEmailResult.signupEmail).toBe(result.signupEmail);

    done();
  });

  test('Should not create a user profile without email', async (done) => {
    const newRecordNoEmailDefined = {};
    const newRecordEmailNull = { signupEmail: null };
    const newRecordNoEmail = { signupEmail: '' };

    await expect(UserProfileService.createUser(newRecordNoEmailDefined)).rejects.toThrow(
      DatabaseError,
    );
    await expect(UserProfileService.createUser(newRecordEmailNull)).rejects.toThrow(DatabaseError);
    await expect(UserProfileService.createUser(newRecordNoEmail)).rejects.toThrow(DatabaseError);

    done();
  });

  test('Should update a user profile with allowed values. Should not allow update email.', 
    async (done) => {
    const newRecord = { signupEmail: 'foo@bar.com' };
    const newRecordResult = await UserProfileService.createUser(newRecord, 'creator@bar.com');

    expect(newRecordResult.firstName).toBeUndefined();
    expect(newRecordResult.lastName).toBeUndefined();
    expect(newRecordResult.meetLocation).toBeUndefined();

    const updateRecordData = {
      signupEmail: 'foo@bar.com',
      firstName: 'Foo',
      lastName: 'Bar',
      meetLocation: 'Los Angeles',
    };
    const updatedRecordResult = await UserProfileService.updateUser(
      updateRecordData,
      'updater@bar.com',
    );

    expect(updatedRecordResult.firstName).toBe(updateRecordData.firstName);
    expect(updatedRecordResult.lastName).toBe(updateRecordData.lastName);
    expect(updatedRecordResult.meetLocation).toBe(updateRecordData.meetLocation);

    const updateRecordNoMeetLocationData = { signupEmail: 'foo@bar.com', meetLocation: null };
    const updatedRecordNoMeetLocationResult = await UserProfileService.updateUser(
      updateRecordNoMeetLocationData,
      'updater@bar.com',
    );

    expect(updatedRecordNoMeetLocationResult.meetLocation).toBeNull();

    // Try and change email address, which is throws error because record not found
    const notAllowedUpdate = { signupEmail: 'changed@email.com' };

    await expect(
      UserProfileService.updateUser(notAllowedUpdate, 'updater@bar.com'),
    ).rejects.toThrow(DatabaseError);

    // Try and update a record that doesn't exist
    const doesntExistRecordData = {
      signupEmail: 'doesnotexist@bar.com',
      firstName: 'DOESNT',
      lastName: 'EXIST',
      meetLocation: 'Anaheim',
    };

    await expect(
      UserProfileService.updateUser(doesntExistRecordData, 'updater@bar.com'),
    ).rejects.toThrow(DatabaseError);

    done();
  });
});
