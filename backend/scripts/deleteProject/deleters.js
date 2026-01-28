/**
 * Deletion functions for removing project-related records
 */

const { ObjectId } = require('mongodb');

/**
 * Delete check-ins
 * @param {Db} db - MongoDB database instance
 * @param {Array} checkIns - Array of check-in documents
 * @param {boolean} isMock - If true, only print what would be deleted
 * @returns {Promise<void>}
 */
async function deleteCheckIns(db, checkIns, isMock) {
  if (checkIns.length === 0) {
    console.log('[INFO] No check-ins to delete.');
    return;
  }

  if (isMock) {
    console.log(`[MOCK] Would delete ${checkIns.length} check-in(s).`);
    return;
  }

  const checkInIds = checkIns.map((ci) => ci._id);
  const result = await db.collection('checkins').deleteMany({ _id: { $in: checkInIds } });

  console.log(`[SUCCESS] Deleted ${result.deletedCount} check-in(s).`);
}

/**
 * Delete project team members
 * @param {Db} db - MongoDB database instance
 * @param {string} projectId - The project ID
 * @param {boolean} isMock - If true, only print what would be deleted
 * @returns {Promise<void>}
 */
async function deleteProjectTeamMembers(db, projectId, isMock) {
  const count = await db.collection('projectteammembers').countDocuments({ projectId: projectId });

  if (count === 0) {
    console.log('[INFO] No project team members to delete.');
    return;
  }

  if (isMock) {
    console.log(`[MOCK] Would delete ${count} project team member(s).`);
    return;
  }

  const result = await db.collection('projectteammembers').deleteMany({ projectId: projectId });

  console.log(`[SUCCESS] Deleted ${result.deletedCount} project team member(s).`);
}

/**
 * Update users to remove project references
 * @param {Db} db - MongoDB database instance
 * @param {string} projectId - The project ID
 * @param {Array} users - Array of user documents
 * @param {boolean} isMock - If true, only print what would be updated
 * @returns {Promise<void>}
 */
async function updateUsersRemoveProject(db, projectId, users, isMock) {
  if (users.length === 0) {
    console.log('[INFO] No users to update.');
    return;
  }

  if (isMock) {
    console.log(`[MOCK] Would update ${users.length} user(s) to remove project references.`);
    users.forEach((user) => {
      const hasInProjects = user.projects?.some((pid) => String(pid) === projectId);
      const hasInManagedProjects = user.managedProjects?.includes(projectId);
      console.log(`       - User: ${user.name?.firstName} ${user.name?.lastName} (${user.email})`);
      if (hasInProjects) console.log(`         * Remove from 'projects' array`);
      if (hasInManagedProjects) console.log(`         * Remove from 'managedProjects' array`);
    });
    return;
  }

  const operations = users.map((user) => ({
    updateOne: {
      filter: { _id: user._id },
      update: {
        $pull: {
          projects: new ObjectId(projectId),
          managedProjects: projectId,
        },
      },
    },
  }));

  const result = await db.collection('users').bulkWrite(operations, { ordered: false });

  console.log(`[SUCCESS] Updated ${result.modifiedCount} user(s) to remove project references.`);
}

/**
 * Delete events
 * @param {Db} db - MongoDB database instance
 * @param {string} projectId - The project ID
 * @param {boolean} isMock - If true, only print what would be deleted
 * @returns {Promise<void>}
 */
async function deleteEvents(db, projectId, isMock) {
  const count = await db.collection('events').countDocuments({ project: new ObjectId(projectId) });

  if (count === 0) {
    console.log('[INFO] No events to delete.');
    return;
  }

  if (isMock) {
    console.log(`[MOCK] Would delete ${count} event(s).`);
    return;
  }

  const result = await db.collection('events').deleteMany({ project: new ObjectId(projectId) });

  console.log(`[SUCCESS] Deleted ${result.deletedCount} event(s).`);
}

/**
 * Delete recurring events
 * @param {Db} db - MongoDB database instance
 * @param {Array} recurringEvents - Array of recurring event documents
 * @param {boolean} isMock - If true, only print what would be deleted
 * @returns {Promise<void>}
 */
async function deleteRecurringEvents(db, recurringEvents, isMock) {
  if (recurringEvents.length === 0) {
    console.log('[INFO] No recurring events to delete.');
    return;
  }

  if (isMock) {
    console.log(`[MOCK] Would delete ${recurringEvents.length} recurring event(s).`);
    return;
  }

  const recurringEventIds = recurringEvents.map((re) => re._id);
  const result = await db
    .collection('recurringevents')
    .deleteMany({ _id: { $in: recurringEventIds } });

  console.log(`[SUCCESS] Deleted ${result.deletedCount} recurring event(s).`);
}

/**
 * Delete the project
 * @param {Db} db - MongoDB database instance
 * @param {string} projectId - The project ID
 * @param {boolean} isMock - If true, only print what would be deleted
 * @returns {Promise<void>}
 */
async function deleteProject(db, projectId, isMock) {
  if (isMock) {
    console.log(`[MOCK] Would delete project: ${projectId}`);
    return;
  }

  const result = await db.collection('projects').deleteOne({ _id: new ObjectId(projectId) });

  console.log(`[SUCCESS] Deleted ${result.deletedCount} project.`);
}

module.exports = {
  deleteCheckIns,
  deleteProjectTeamMembers,
  updateUsersRemoveProject,
  deleteEvents,
  deleteRecurringEvents,
  deleteProject,
};
