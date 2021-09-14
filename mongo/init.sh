#!/bin/sh
mongoimport --collection employees --file ./data/employees.json --jsonArray --uri "mongodb://mongo:27017"
mongoimport --collection locations --file ./data/locations.json --jsonArray --uri "mongodb://mongo:27017"