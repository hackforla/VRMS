/**
 * Display functions for showing detailed information about records
 */

const { ObjectId } = require('mongodb');

/**
 * Display detailed information about users
 * @param {Array} users - Array of user documents
 * @param {string} projectId - The project ID
 * @returns {void}
 */
function displayUserDetails(users, projectId) {
  if (users.length === 0) {
    console.log('  No users reference this project.\n');
    return;
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log('USERS REFERENCING THIS PROJECT');
  console.log(`${'─'.repeat(60)}\n`);

  users.forEach((user, index) => {
    const hasInProjects = user.projects?.some((pid) => String(pid) === projectId);
    const hasInManagedProjects = user.managedProjects?.includes(projectId);

    console.log(`User ${index + 1}/${users.length}:`);
    console.log(`  Name: ${user.name?.firstName || 'N/A'} ${user.name?.lastName || 'N/A'}`);
    console.log(`  Email: ${user.email || 'N/A'}`);
    console.log(`  User ID: ${user._id}`);
    console.log(`  Access Level: ${user.accessLevel || 'N/A'}`);
    console.log(`  Is Active: ${user.isActive !== undefined ? user.isActive : 'N/A'}`);

    if (hasInProjects) {
      console.log(`  ⚠ In 'projects' array (total projects: ${user.projects?.length || 0})`);
    }
    if (hasInManagedProjects) {
      console.log(
        `  ⚠ In 'managedProjects' array (total managed: ${user.managedProjects?.length || 0})`,
      );
    }

    console.log('');
  });
}

/**
 * Display detailed information about events
 * @param {Array} events - Array of event documents
 * @returns {void}
 */
function displayEventDetails(events) {
  if (events.length === 0) {
    console.log('  No events associated with this project.\n');
    return;
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log('EVENTS ASSOCIATED WITH THIS PROJECT');
  console.log(`${'─'.repeat(60)}\n`);

  // Group events by type
  const eventsByType = {};
  events.forEach((event) => {
    const type = event.eventType || 'Unknown';
    if (!eventsByType[type]) {
      eventsByType[type] = [];
    }
    eventsByType[type].push(event);
  });

  // Display summary by type
  console.log('Event Summary by Type:');
  Object.entries(eventsByType).forEach(([type, evts]) => {
    console.log(`  ${type}: ${evts.length} event(s)`);
  });
  console.log('');

  // Display first 10 events in detail, then summarize the rest
  const displayLimit = 10;
  const eventsToDisplay = events.slice(0, displayLimit);

  console.log(`Showing first ${eventsToDisplay.length} of ${events.length} event(s):\n`);

  eventsToDisplay.forEach((event, index) => {
    console.log(`Event ${index + 1}/${events.length}:`);
    console.log(`  Event ID: ${event._id}`);
    console.log(`  Name: ${event.name || 'N/A'}`);
    console.log(`  Type: ${event.eventType || 'N/A'}`);
    console.log(`  Location: ${event.hacknight || event.location?.city || 'N/A'}`);
    console.log(`  Date: ${event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}`);
    console.log(
      `  Start Time: ${event.startTime ? new Date(event.startTime).toLocaleString() : 'N/A'}`,
    );
    console.log(`  Check-In Ready: ${event.checkInReady || false}`);

    if (event.recurringEventLink?.recurringEventId) {
      console.log(`  ⚠ Part of recurring event: ${event.recurringEventLink.recurringEventId}`);
    }

    console.log('');
  });

  if (events.length > displayLimit) {
    console.log(`... and ${events.length - displayLimit} more event(s)\n`);
  }
}

/**
 * Display detailed information about check-ins
 * @param {Array} checkIns - Array of check-in documents
 * @param {Array} events - Array of event documents for reference
 * @param {Db} db - MongoDB database instance (optional, for user lookup)
 * @returns {Promise<void>}
 */
async function displayCheckInDetails(checkIns, events, db) {
  if (checkIns.length === 0) {
    console.log('  No check-ins associated with project events.\n');
    return;
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log('CHECK-INS ASSOCIATED WITH PROJECT EVENTS');
  console.log(`${'─'.repeat(60)}\n`);

  // Group check-ins by event
  const checkInsByEvent = {};
  const uniqueUserIds = new Set();

  checkIns.forEach((checkIn) => {
    const eventId = checkIn.eventId;
    if (!checkInsByEvent[eventId]) {
      checkInsByEvent[eventId] = [];
    }
    checkInsByEvent[eventId].push(checkIn);
    if (checkIn.userId) {
      uniqueUserIds.add(checkIn.userId);
    }
  });

  console.log(`Total check-ins: ${checkIns.length}`);
  console.log(`Spread across ${Object.keys(checkInsByEvent).length} event(s)`);
  console.log(`Unique users: ${uniqueUserIds.size}\n`);

  // Fetch user information if db is provided
  let users = [];
  if (db && uniqueUserIds.size > 0) {
    const userIdArray = Array.from(uniqueUserIds);
    users = await db
      .collection('users')
      .find({ _id: { $in: userIdArray.map((id) => new ObjectId(id)) } })
      .toArray();
  }

  console.log('Check-ins by Event:');
  Object.entries(checkInsByEvent).forEach(([eventId, eventCheckIns]) => {
    const event = events.find((e) => String(e._id) === eventId);
    const eventName = event?.name || 'Unknown Event';
    const eventDate = event?.date ? new Date(event.date).toLocaleDateString() : 'Unknown Date';
    console.log(`  ${eventName} (${eventDate}): ${eventCheckIns.length} check-in(s)`);
  });
  console.log('');

  // Display user information
  if (users.length > 0 || uniqueUserIds.size > 0) {
    console.log('Users who checked in:');

    // Count check-ins per user
    const checkInCountByUser = {};
    checkIns.forEach((checkIn) => {
      const userId = checkIn.userId;
      if (!checkInCountByUser[userId]) {
        checkInCountByUser[userId] = 0;
      }
      checkInCountByUser[userId]++;
    });

    users.forEach((user) => {
      const userId = String(user._id);
      const checkInCount = checkInCountByUser[userId] || 0;
      const userName = `${user.name?.firstName || 'N/A'} ${user.name?.lastName || 'N/A'}`;
      const userEmail = user.email || 'N/A';
      console.log(`  ${userName} (${userEmail}): ${checkInCount} check-in(s)`);
    });

    // Check for orphaned check-ins (userIds without matching users)
    const foundUserIds = new Set(users.map((u) => String(u._id)));
    const orphanedUserIds = Array.from(uniqueUserIds).filter((id) => !foundUserIds.has(id));

    if (orphanedUserIds.length > 0) {
      console.log('\n⚠️  Orphaned check-ins (user not found in database):');
      orphanedUserIds.forEach((userId) => {
        const checkInCount = checkInCountByUser[userId] || 0;
        console.log(`  User ID: ${userId}: ${checkInCount} check-in(s)`);
        console.log(`    → This user no longer exists in the database`);
      });
    }

    console.log('');
  }
}

/**
 * Display detailed information about project team members
 * @param {Array} teamMembers - Array of project team member documents
 * @returns {void}
 */
function displayProjectTeamMemberDetails(teamMembers) {
  if (teamMembers.length === 0) {
    console.log('  No project team members.\n');
    return;
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log('PROJECT TEAM MEMBERS');
  console.log(`${'─'.repeat(60)}\n`);

  // Group by status
  const activeMembers = teamMembers.filter((m) => m.teamMemberStatus === 'Active');
  const inactiveMembers = teamMembers.filter((m) => m.teamMemberStatus !== 'Active');

  console.log(`Total team members: ${teamMembers.length}`);
  console.log(`  Active: ${activeMembers.length}`);
  console.log(`  Inactive: ${inactiveMembers.length}\n`);

  teamMembers.forEach((member, index) => {
    console.log(`Team Member ${index + 1}/${teamMembers.length}:`);
    console.log(`  User ID: ${member.userId}`);
    console.log(`  Status: ${member.teamMemberStatus || 'N/A'}`);
    console.log(`  Role: ${member.roleOnProject || 'N/A'}`);
    console.log(`  VRMS Admin: ${member.vrmsProjectAdmin || false}`);
    console.log(
      `  Joined: ${member.joinedDate ? new Date(member.joinedDate).toLocaleDateString() : 'N/A'}`,
    );

    if (member.leftDate) {
      console.log(`  Left: ${new Date(member.leftDate).toLocaleDateString()}`);
      console.log(`  Left Reason: ${member.leftReason || 'N/A'}`);
    }

    console.log('');
  });
}

/**
 * Display information about related recurring events
 * @param {Array} recurringEvents - Array of recurring event documents
 * @returns {void}
 */
function displayRecurringEventDetails(recurringEvents) {
  if (recurringEvents.length === 0) {
    console.log('  No recurring events associated with this project.\n');
    return;
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log('RECURRING EVENTS ASSOCIATED WITH THIS PROJECT');
  console.log(`${'─'.repeat(60)}\n`);

  console.log(`${recurringEvents.length} recurring event(s) will be deleted.\n`);

  recurringEvents.forEach((recurringEvent, index) => {
    console.log(`Recurring Event ${index + 1}/${recurringEvents.length}:`);
    console.log(`  Recurring Event ID: ${recurringEvent._id}`);
    console.log(`  Project ID: ${recurringEvent.project || 'N/A'}`);

    // Display recurring event details if available
    if (recurringEvent.name) {
      console.log(`  Name: ${recurringEvent.name}`);
    }
    if (recurringEvent.eventType) {
      console.log(`  Type: ${recurringEvent.eventType}`);
    }
    if (recurringEvent.hacknight) {
      console.log(`  Location: ${recurringEvent.hacknight}`);
    }

    console.log('');
  });
}

module.exports = {
  displayUserDetails,
  displayEventDetails,
  displayCheckInDetails,
  displayProjectTeamMemberDetails,
  displayRecurringEventDetails,
};
