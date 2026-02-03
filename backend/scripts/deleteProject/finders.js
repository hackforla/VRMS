/**
 * Database query functions for finding related records
 */

const { ObjectId } = require('mongodb');

/**
 * Find the project by ID
 * @param {Db} db - MongoDB database instance
 * @param {string} projectId - The project ID
 * @returns {Promise<Object|null>} Project document or null
 */
async function findProject(db, projectId) {
  const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });

  if (!project) {
    console.log(`[ERROR] Project not found: ${projectId}`);
    return null;
  }

  console.log(`[INFO] Found project: "${project.name}" (${projectId})`);
  return project;
}

/**
 * Find all events associated with the project
 * @param {Db} db - MongoDB database instance
 * @param {string} projectId - The project ID
 * @returns {Promise<Array>} Array of event documents
 */
async function findProjectEvents(db, projectId) {
  const events = await db
    .collection('events')
    .find({ project: new ObjectId(projectId) })
    .toArray();

  console.log(`[INFO] Found ${events.length} event(s) for this project.`);
  return events;
}

/**
 * Find all check-ins associated with the project events
 * @param {Db} db - MongoDB database instance
 * @param {Array} events - Array of event documents
 * @returns {Promise<Array>} Array of check-in documents
 */
async function findEventCheckIns(db, events) {
  if (events.length === 0) {
    console.log('[INFO] No events, so no check-ins to delete.');
    return [];
  }

  const eventIds = events.map((event) => String(event._id));
  const checkIns = await db
    .collection('checkins')
    .find({ eventId: { $in: eventIds } })
    .toArray();

  console.log(`[INFO] Found ${checkIns.length} check-in(s) for project events.`);
  return checkIns;
}

/**
 * Find all project team members for the project
 * @param {Db} db - MongoDB database instance
 * @param {string} projectId - The project ID
 * @returns {Promise<Array>} Array of project team member documents
 */
async function findProjectTeamMembers(db, projectId) {
  const teamMembers = await db
    .collection('projectteammembers')
    .find({ projectId: projectId })
    .toArray();

  console.log(`[INFO] Found ${teamMembers.length} project team member(s).`);
  return teamMembers;
}

/**
 * Find all users who reference this project
 * @param {Db} db - MongoDB database instance
 * @param {string} projectId - The project ID
 * @returns {Promise<Array>} Array of user documents
 */
async function findUsersReferencingProject(db, projectId) {
  const users = await db
    .collection('users')
    .find({
      $or: [{ projects: new ObjectId(projectId) }, { managedProjects: projectId }],
    })
    .toArray();

  console.log(`[INFO] Found ${users.length} user(s) referencing this project.`);
  return users;
}

/**
 * Check for recurring events that may be affected
 * @param {Db} db - MongoDB database instance
 * @param {Array} events - Array of event documents
 * @returns {Promise<Array>} Array of recurring event IDs
 */
async function findRelatedRecurringEvents(db, events) {
  const recurringEventIds = events
    .filter((e) => e.recurringEventLink?.recurringEventId)
    .map((e) => e.recurringEventLink.recurringEventId)
    .filter((id, index, self) => self.indexOf(id) === index); // unique

  if (recurringEventIds.length === 0) {
    return [];
  }

  const recurringEvents = await db
    .collection('recurringevents')
    .find({ _id: { $in: recurringEventIds.map((id) => new ObjectId(id)) } })
    .toArray();

  return recurringEvents;
}

module.exports = {
  findProject,
  findProjectEvents,
  findEventCheckIns,
  findProjectTeamMembers,
  findUsersReferencingProject,
  findRelatedRecurringEvents,
};
