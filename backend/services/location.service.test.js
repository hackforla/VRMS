const { LocationService } = require('./location.service');
const { setupDB } = require('../setup-test');

setupDB('location-service');

describe('Test LocationService.add', () => {
  test('Add empty array should throw validation error', async (done) => {


    try {
      // Add empty array
      await LocationService.add([]);
    } catch (err) {
      expect(err.name).toBe('ValidationError');
      expect(err.message).toBe("locations input array must have at least one element");
    }

    done();
  });
  test('Add an array of location strings sucessfully adds to database', async (done) => {
    const locationsArray = ['loc1', 'loc2', 'loc3'];
    await LocationService.add(locationsArray);
    const savedLocations = await LocationService.getAll();

    expect(savedLocations.length).toEqual(3);
    expect(savedLocations).toEqual(expect.arrayContaining(locationsArray));

    done();
  });
  test('Add duplicate string to location array should skip silently', async (done) => {
    
    const isArrayUnique = arr => Array.isArray(arr) && new Set(arr).size === arr.length;
    
    await LocationService.add(['loc1', 'loc2', 'loc3']);
    await LocationService.add(['loc3', 'loc4', 'loc5']);
    
    const savedLocations = await LocationService.getAll();

    expect(isArrayUnique(savedLocations)).toBeTruthy();
    
    expect(savedLocations.length).toEqual(5);
    expect(savedLocations).toEqual(expect.arrayContaining(['loc1', 'loc2', 'loc3','loc4', 'loc5']));

    done();
  });
  
  test('Add array with whitespace string should throw database error', async (done) => {
    
    const locationsArray = ['    ', 'role6', 'role7'];
    try {
      await LocationService.add(locationsArray);
    } catch (err) {
      expect(err.name).toBe('ValidationError');
      expect(err.message).toBe("locations array should not contain empty strings");

    }

    done();
  })

 });



describe('Test LocationService.getAll', () => {
  test('Should return an empty array if no location data found', async (done) => {
    const savedLocations = await LocationService.getAll();
    expect(savedLocations.length).toBe(0)

    done();

  })

  test('Should return an array of location string if data exists', async (done) => {
    await LocationService.add(['loc1', 'loc2', 'loc3']);
    const savedLocations = await LocationService.getAll();
    expect(savedLocations.length).toBe(3)

    done();

  })
});
