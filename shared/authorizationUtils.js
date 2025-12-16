const { ROLES, ROLE_HIERARCHY } = require("../shared/roles");

const hasRole = (user, role) => {
  if (!user || !user.accessLevel) return false;
  return user.accessLevel === role;
};

const hasAnyRole = (user, ...roles) => {
  if (!user || !user.accessLevel) return false;
  return roles.includes(user.accessLevel);
};

const isAtLeast = (user, minimumRole) => {
  if (!user || !user.accessLevel) return false;
  return ROLE_HIERARCHY[user.accessLevel] >= ROLE_HIERARCHY[minimumRole];
};

const isSuperAdmin = (user) => {
  return hasRole(user, ROLES.SUPER_ADMIN);
};

const isAdmin = (user) => {
  return hasAnyRole(user, ROLES.ADMIN, ROLES.SUPER_ADMIN);
};

const isProjectManager = (user) => {
  return hasRole(user, ROLES.PROJECT_MANAGER);
};

const AuthUtils = {
  isSuperAdmin,
  isAdmin,
  isProjectManager,
  hasRole,
  hasAnyRole,
  isAtLeast,
};

module.exports = AuthUtils;
