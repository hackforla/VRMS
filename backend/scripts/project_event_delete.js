const { MongoClient } = require('mongodb');
// Load config variables
const { DATABASE_URL } = require('../config/database.config');

async function deleteProjectsAndEvents() {
    // We can pass any db name in the command line
    const dbName = process.argv[2];

    if (!dbName) {
        console.error('Please provide a database name as an argument.');
        process.exit(1); 
    }

    // Strip out the existing db name and parameters from the URL
    const baseUrl = DATABASE_URL.split('/').slice(0, -1).join('/');

    // Construct the new URL by appending the dbName
    const url = `${baseUrl}/${dbName}?retryWrites=true&w=majority`;

    const client = new MongoClient(url);

    try {
        // Connect the client to the server
        await client.connect();
        console.log('Connected to the server');
        const db = client.db(dbName);
        
        const projectsCount = await db.collection('projects').countDocuments();
        const eventsCount = await db.collection('events').countDocuments();

        console.log(`Projects in database: ${projectsCount}`);
        console.log(`Events in database: ${eventsCount}`);

        // if (projectsCount > 0) {
        //     // Find all project IDs
        //     const projectIds = await db.collection('projects').find({}, { projection: { _id: 1 } }).toArray();
        //     const projectIdsArray = projectIds.map(project => project._id);

        //     // Delete corresponding events
        //     const deleteEventsResult = await db.collection('events').deleteMany({ project: { $in: projectIdsArray } });
        //     console.log(`Deleted ${deleteEventsResult.deletedCount} events.`);

        //     // Delete all projects
        //     const deleteProjectsResult = await db.collection('projects').deleteMany({});
        //     console.log(`Deleted ${deleteProjectsResult.deletedCount} projects.`);
        // } else {
        //     console.log('No projects found in the database.');
        // }

        // Verification after deletion 
        const remainingProjects = await db.collection('projects').countDocuments();
        const remainingEvents = await db.collection('events').countDocuments();

        console.log(`Projects remaining: ${remainingProjects}`);
        console.log(`Events remaining: ${remainingEvents}`);
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection to the MongoDB server
        await client.close();
        console.log('Connection closed');
    }
}

// Run the function
deleteProjectsAndEvents();
