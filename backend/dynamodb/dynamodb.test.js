const { Endpoint, DynamoDB } = require("aws-sdk");

describe("DynamoDb", () => {
  expect(process.env.AWS_DYNAMODB_REGION).toBeTruthy();
  expect(process.env.AWS_DYNAMODB_TABLE_NAME).toBeTruthy();
  expect(process.env.AWS_DYNAMODB_ENDPOINT).toBeTruthy();
  const region = process.env.AWS_DYNAMODB_REGION || "";
  const testTable = process.env.AWS_DYNAMODB_TABLE_NAME || "";
  const testEndpoint = process.env.AWS_DYNAMODB_ENDPOINT || "";

  describe("construction tests", () => {
    it("successfully builds client", async () => {
      const opts = { region, endpoint: testEndpoint };
      const client = new DynamoDB.DocumentClient(opts);
      expect(client).toBeInstanceOf(DynamoDB.DocumentClient);
      // Assert
      const endpoint = new Endpoint(testEndpoint);
      expect(client.service.endpoint).toEqual(endpoint);
    });
  });

  describe("docker integration tests", () => {
    const opts = {region, endpoint: testEndpoint };
    const client = new DynamoDB.DocumentClient(opts);

    it("retrieves data from valid input", async () => {
      const params = {
        TableName: testTable,
        Key: {
          pk: "User#johnnytest@nowhere.com",
          sk: "Metadata"
        }
      };

      const data = await client.get(params).promise();
      expect(data).toBeDefined();
      expect(data.Item).toBeDefined();
      expect(data.Item.pk).toEqual(params.Key.pk);
      expect(data.Item.sk).toEqual(params.Key.sk);
    });
    it("returns null when retrieving non-existing record", async () => {
      const params = {
        TableName: testTable,
        Key: {
          pk: "NonExistingKey",
          sk: "Metadata"
        }
      };

      const data = await client.get(params).promise();
      expect(data).toBeDefined();
      expect(data.Item).toBeUndefined();
    });
    it("errors when retrieving non-existing table", async () => {
      const params = {
        TableName: "some other table",
        Key: {
          pk: "User#johnnytest@nowhere.com",
          sk: "Metadata"
        }
      };

      try {
        await client.get(params).promise();
        fail("did not throw expected error...");
      } catch (e) {
        expect(e.code).toEqual("ValidationException");
      }
    });
  });
});