
# TODO: validate current path

echo "creating dev database..."

# Initialize and start dev database
docker-compose -f docker-compose-devdb.yml up -d > $null
# Create up local table
aws dynamodb --endpoint-url http://localhost:8042 create-table --table-name demo --cli-input-json file://resources/localTable.json > $null
# Insert example record
aws dynamodb --endpoint-url http://localhost:8042 put-item --table-name demo --item file://resources/testRecord.json > $null

echo "dev database is ready."
