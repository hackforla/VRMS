#!/usr/bin/env bash

<<'###BLOCK-COMMENT'
Backs up and restores MongoDB instance.

Arguments:
    -u URI of the source MongoDB instance
    -d Database name of the source MongoDB instance
    -h Host of MongoDB instance to restore backup
    -p Port of MongoDB instance to restore backup
    -n Name of new MongoDB database

Example:
    sh local_db_backup.sh -u YOUR_MONGO_DB_URL_SANS_ARGS -d SOURCE_DB_NAME -h localhost -p 27017 -n DESTINATION_DB_NAME

###BLOCK-COMMENT

while getopts u:d:h:p:n: flag

do
    case "${flag}" in
        u) mongo_src_uri=${OPTARG};;
        d) mongo_src_db_name=${OPTARG};;
        h) mongo_dest_host=${OPTARG};;
        p) mongo_dest_port=${OPTARG};;
        n) mongo_dest_name=${OPTARG};;
    esac
done

if pgrep mongo > /dev/null
then
    echo "MongoDB is already Running"
else
    echo "Starting mongod daemon"
    mongod
fi

echo "Backing up mongodb from uri=$mongo_src_uri"
mkdir backup
mongodump --uri=$mongo_src_uri --out=backup

echo "Restoring mongodb to host=$mongo_dest_host and port=$mongo_dest_port with name=$mongo_dest_name"
# need to remove hard coded value for incoming db_name "vrms_test"
mongorestore --host $mongo_dest_host --port $mongo_dest_port --db $mongo_dest_name ./backup/$mongo_src_db_name

echo "Cleaning up"
rm -rf backup