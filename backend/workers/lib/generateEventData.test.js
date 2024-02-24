const { generateEventData } = require('./generateEventData.js');

describe('generateEventData', () => {
  test("generateEventData fn() generates expected startTime", () => {
    const testDate = new Date('2024-02-07T10:00:00.000Z')
    const testDate2nd = new Date('2024-02-07T10:00:00.000Z')

    const mockData = {
      name: 'Test Event',
      date: new Date('2024-02-07T10:00:00.000Z'),
      startTime: new Date('2024-02-07T10:00:00.000Z'), 
      endTime: new Date(testDate2nd.setHours(testDate2nd.getHours() + 3)),
      updatedDate: testDate,
      hours: 3,
    };
    
    const result = generateEventData(mockData, testDate);
    
    // expect(result.startTime).toEqual(new Date('2024-02-07T12:00:00')); 
    expect(result.startTime).toEqual(mockData.startTime);
  });
  
  test("generateEventData fn() generates expected endTime (startTime + hours)", () => {
    const testDate = new Date('2024-02-07T10:00:00.000Z')
    const testDate2nd = new Date('2024-02-07T10:00:00.000Z')

    const mockData = {
      eventType: 'Workshop',
      date: testDate,
      startTime: new Date('2024-02-07T10:00:00.000Z'), 
      endTime: new Date(testDate2nd.setHours(testDate2nd.getHours() + 3)),
      updatedDate: testDate,
      hours: 3,
    };
    
    const result = generateEventData(mockData, testDate);
    expect(result.endTime).toEqual(mockData.endTime);   
  });

  test("generateEventData fn() creates proper times with data lifted from dev.db", () => {
    const devDbData = {
      date: "2023-03-23T03:00:00.706Z",
      startTime: "2023-03-23T03:00:00.706Z",
      endTime: "2023-03-23T04:00:00.706Z",
      hours: 1,
      createdDate: "2023-03-23T01:26:30.706Z",
      updatedDate: "2023-03-23T01:26:30.706Z",
    }

    const newEndTime = new Date(devDbData.startTime);

    const newEndTimePlusHours = new Date(newEndTime.setHours(newEndTime.getHours() + devDbData.hours))
    const result = generateEventData(devDbData, new Date(devDbData.startTime));
    expect(result.endTime).toEqual(newEndTimePlusHours);
  });

  test("Creates new time step with respect to daylight savings", () => {
    const devDbData = {
      date: "2023-03-23T03:00:00.706Z",
      startTime: "2023-03-23T03:00:00.706Z",
      endTime: "2023-03-23T04:00:00.706Z",
      hours: 1,
      createdDate: "2023-03-23T01:26:30.706Z",
      updatedDate: "2023-03-23T01:26:30.706Z",
    }
    
    const newStartTime = new Date("2023-11-23T03:00:00.706Z");
    const newEndTime = new Date("2023-11-23T03:00:00.706Z");
    newEndTime.setHours(newStartTime.getHours() + 1)

    const result = generateEventData(devDbData, newStartTime);

    expect(result.startTime).toEqual(newStartTime);
    expect(result.endTime).toEqual(newEndTime);
  });
  
  test("Creates new time step with respect to daylight savings", () => {
    const devDbData = {
      date: "2024-02-23T03:00:00.706Z",
      startTime: "2024-02-23T03:00:00.706Z",
      endTime: "2024-02-23T04:00:00.706Z",
      hours: 1,
      createdDate: "2023-03-23T01:26:30.706Z",
      updatedDate: "2024-02-23T04:00:00.706Z",
    }

    const newStartTime = new Date("2024-04-23T03:00:00.706Z");
    const newEndTime = new Date("2024-04-23T03:00:00.706Z");
    newEndTime.setHours(newStartTime.getHours() + 1)

    const result = generateEventData(devDbData, newStartTime);

    expect(result.startTime).toEqual(newStartTime);
    expect(result.endTime).toEqual(newEndTime);
  });

})