// constants/roles.js

const ROLES = Object.freeze({
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  PROJECT_MANAGER: "project_manager",
  USER: "user",
});

const ROLE_HIERARCHY = Object.freeze({
  [ROLES.USER]: 1,
  [ROLES.PROJECT_MANAGER]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.SUPER_ADMIN]: 4,
});

module.exports = { ROLES, ROLE_HIERARCHY };
