# Running a local DynamoDb instance via Docker

The below steps set up a local DynamoDb instance that runs within its own Docker container and is exposed on port 8042.
This instance is kept separate from the primary `docker-compose.yml` file as it simulates an external resource and should not be included in Production builds.

## Setup Instructions
1. Download and install Docker on your computer [link](https://docs.docker.com/get-docker/)
1. Download and install AWS CLI on your computer [link](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
1. Run startup script within devdb folder: 
   - Mac / Linux: `sh start-db.sh`
   - Windows: `powershell -executionpolicy bypass ".\start-db.ps1"`
1. Modify the `/backend/.env` file as follows:
```
AWS_DYNAMODB_REGION=us-west-1
AWS_DYNAMODB_TABLE_NAME=demo
AWS_DYNAMODB_ENDPOINT=http://localhost:8042
``` 

The settings are used as follows:
- **AWS_DYNAMODB_REGION**: The host region for the database
- **AWS_DYNAMODB_TABLE_NAME**: The identifier for the database
- **AWS_DYNAMODB_ENDPOINT**: Only needed for local testing - overrides AWS service lookup and uses specified the endpoint

## Spindown Instructions
1. Run shutdown script within devdb folder: 
   - Mac / Linux: `sh stop-db.sh`
   - Windows: `powershell -executionpolicy bypass ".\stop-db.ps1"`

## Example setup for connecting client to local database:
```
const opts = {endpoint: "http://localhost:8042"};
const client = new DynamoDB.DocumentClient(opts);
expect(client).toBeInstanceOf(DynamoDB.DocumentClient);
var endpoint = new Endpoint(testEndpoint);
expect(client.service.endpoint).toEqual(endpoint);
```

## Reference
- [Deploying DynamoDB Locally to your Computer](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)
- [How to Set Up a Local DynamoDB in a Docker Container](https://betterprogramming.pub/how-to-set-up-a-local-dynamodb-in-a-docker-container-and-perform-the-basic-putitem-getitem-38958237b968)