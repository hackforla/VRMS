import jsonData from './test-data.json' assert {type: 'json'};

const emailMap = {};

jsonData.forEach(user => {
    const lowercaseEmail = user.email.toLowerCase();
    if (!emailMap[lowercaseEmail]) {
        emailMap[lowercaseEmail] = user;
    } else {
        const existingUser = emailMap[lowercaseEmail];
        existingUser.skillsToMatch.push(...user.skillsToMatch);
        existingUser.projects.push(...user.projects);
        existingUser.managedProjects.push(...user.managedProjects);
        existingUser.textingOk = existingUser.textingOk || user.textingOk;
        existingUser.isActive = existingUser.isActive || user.isActive;
        existingUser.newMember = existingUser.newMember || user.newMember;
        existingUser.currentRole = existingUser !== user ? existingUser.currentRole : user.currentRole;
        existingUser.desiredRole = existingUser !== user ? existingUser.desiredRole : user.desiredRole;
        
        if (existingUser.accessLevel === 'admin' || user.accessLevel === 'admin') {
            existingUser.accessLevel = 'admin';
        }
        // Preserving the older createdDate, firstAttended and modifying the email
        if (new Date(user.createdDate) < new Date(existingUser.createdDate)) {
            existingUser.createdDate = user.createdDate;
            existingUser.firstAttended = user.firstAttended;
            existingUser.email = `${user.email.toLowerCase()}_${user._id}`
        }
    }
    // Always lowercase email
    user.email = lowercaseEmail;
});

