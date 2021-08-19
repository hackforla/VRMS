export function authLevelRedirect (user) {

  let loginRedirect;
  let userAccessLevel = user.accessLevel;

  switch (userAccessLevel) {
    case 'admin':
      loginRedirect = '/admin';
      break;
    case 'user':
      loginRedirect = '/projects'
      break;
    default:
      // Do nothing (harder than you think).
  }

  return loginRedirect;
}

