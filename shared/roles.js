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

// CommonJS export (for backend)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ROLES,
    ROLE_HIERARCHY,
  };
}

// ES Module export (for frontend)
export { ROLES, ROLE_HIERARCHY };
