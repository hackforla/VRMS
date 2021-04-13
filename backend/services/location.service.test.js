const locationService = require('./location.service');
const { setupDB } = require('../setup-test');
const { Location } = require('../models/dictionaries/location.model');

setupDB('location-service');

describe('Test LocationService.add', () => {
  test('Add empty array should throw database error', async (done) => {


    try {
      // Add empty array
      await locationService.add([]);

    } catch (err) {
      expect(err.name).toBe('DatabaseError');
    }

    done();
  });
  test('Add an array of location strings sucessfully adds to database', async (done) => {
    const locationsArray = ['loc1', 'loc2', 'loc3'];
    await locationService.add(locationsArray);
    const savedLocations = await locationService.getAll();

    expect(savedLocations.length).toEqual(3);
    expect(savedLocations).toEqual(expect.arrayContaining(locationsArray));

    done();
  });
  test('Add duplicate string to location array should skip silently', async (done) => {
    
    const isArrayUnique = arr => Array.isArray(arr) && new Set(arr).size === arr.length;
    await locationService.add(['loc1', 'loc2', 'loc3']);
    const locationsArray = ['loc3', 'loc4', 'loc5'];
    await locationService.add(locationsArray);
    const savedLocations = await locationService.getAll();

    expect(isArrayUnique(savedLocations)).toBeTruthy();
    expect(savedLocations.length).toEqual(5);
    expect(savedLocations).toEqual(expect.arrayContaining(locationsArray));

    done();
  })
  test('Add array with whitespace string should throw database error', async (done) => {
    
    const locationsArray = ['    ', 'role6', 'role7'];
    try {
      await locationService.add(locationsArray);
    } catch (err) {
      expect(err.message).toBe('Validation failed: locations: An empty string is not allowed');
      expect(err.name).toBe('DatabaseError');
    }

    done();
  })
});



describe('Test LocationService.getAll', () => {
  test('Should return an empty array if no location data found', async (done) => {
    const savedLocations = await locationService.getAll();
    expect(savedLocations.length).toBe(0)

    done();

  })

  test('Should return an array of location string if data exists', async (done) => {
    await locationService.add(['loc1', 'loc2', 'loc3']);
    const savedLocations = await locationService.getAll();
    expect(savedLocations.length).toBe(3)

    done();

  })
})
