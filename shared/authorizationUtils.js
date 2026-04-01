import { ROLES, ROLE_HIERARCHY } from "./roles.js";

// Requires user to have the role exactly matching the provided role
const hasRole = (user, role) => {
  if (!user || !user.accessLevel) return false;
  return user.accessLevel === role;
};

// Checks user for any of the listed roles
const hasAnyRole = (user, ...roles) => {
  if (!user || !user.accessLevel) return false;
  return roles.includes(user.accessLevel);
};

// Checks if user has at least the minimum role based on hierarchy
// See shared/roles.js for hierarchy definition
const hasMinimumRole = (user, minimumRole) => {
  if (!user || !user.accessLevel) return false;
  return ROLE_HIERARCHY[user.accessLevel] >= ROLE_HIERARCHY[minimumRole];
};

const isSuperAdmin = (user) => {
  return hasRole(user, ROLES.SUPER_ADMIN);
};

const isAdmin = (user) => {
  return hasRole(user, ROLES.ADMIN);
};

const isProjectManager = (user) => {
  return hasRole(user, ROLES.PROJECT_MANAGER);
};

// CommonJS export
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isSuperAdmin,
    isAdmin,
    isProjectManager,
    hasRole,
    hasAnyRole,
    hasMinimumRole,
  };
}

// ES Module export
export {
  isSuperAdmin,
  isAdmin,
  isProjectManager,
  hasRole,
  hasAnyRole,
  hasMinimumRole,
};
