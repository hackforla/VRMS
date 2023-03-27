export function authLevelRedirect(user) {
  let loginRedirect;
  let userAccessLevel = user.accessLevel;

  switch (userAccessLevel) {
    case 'admin':
      loginRedirect = '/welcome';
      break;
    case 'user':
      loginRedirect = '/welcome';
      break;
    default:
    // Do nothing (harder than you think).
  }

  return loginRedirect;
}
