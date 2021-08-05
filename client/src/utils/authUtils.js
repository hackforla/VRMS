export function authLevelRedirect (user) {

  let loginRedirect;
  let userAccessLevel = user.accessLevel;

// current access levels in useProvideAuth.js: 'admin', 'user'
  switch (userAccessLevel) {
    case 'admin':
      loginRedirect = '/admin';
      break;
    case 'user':
      loginRedirect = '/projects'
      break;
    default:
      throw new Error('Unsupported access level');
  }

  return loginRedirect;
}

