const locationService = require('./location.service');
const { setupDB } = require("../setup-test");

setupDB("location-service");

describe("LocationService can save and retrieve locations", () => {
  test("Save a location record and then retrieve it by the service", async (done) => {

    const locationsArrayFinal = ["loc1", "loc2", "loc3", "loc4", "loc5"];

    const emptyArray = [];
   
    await locationService.add(emptyArray);
    const savedLocationsEmpty = await locationService.getAll();
    expect(savedLocationsEmpty.length).toEqual(0);

    const locationsArray1 = ["loc1", "loc2", "loc3"];
    await locationService.add(locationsArray1);
    const savedLocations = await locationService.getAll();

    expect(savedLocations.length).toEqual(3);
    expect(savedLocations[0]).toEqual(locationsArray1[0]);
    expect(savedLocations[1]).toEqual(locationsArray1[1]);
    expect(savedLocations[2]).toEqual(locationsArray1[2]);

    // duplicate role3 should be not be inserted again
    const locationsArray2 = ["loc3", "loc4", "loc5"];
    await locationService.add(locationsArray2);
    const savedLocs2 = await locationService.getAll();

    expect(savedLocs2.length).toEqual(5);
    expect(savedLocs2[0]).toEqual(locationsArrayFinal[0]);
    expect(savedLocs2[1]).toEqual(locationsArrayFinal[1]);
    expect(savedLocs2[2]).toEqual(locationsArrayFinal[2]);
    expect(savedLocs2[3]).toEqual(locationsArrayFinal[3]);
    expect(savedLocs2[4]).toEqual(locationsArrayFinal[4]);

    // invalid array should be ignored
    const locationsArray3 = ["    ", "role6", "role7"];
    await locationService.add(locationsArray3);
    const savedLocs3 = await locationService.getAll();

    expect(savedLocs3.length).toEqual(5);
    expect(savedLocs3[0]).toEqual(locationsArrayFinal[0]);
    expect(savedLocs3[1]).toEqual(locationsArrayFinal[1]);
    expect(savedLocs3[2]).toEqual(locationsArrayFinal[2]);
    expect(savedLocs3[3]).toEqual(locationsArrayFinal[3]);
    expect(savedLocs3[4]).toEqual(locationsArrayFinal[4]);

    done();


  });
});
