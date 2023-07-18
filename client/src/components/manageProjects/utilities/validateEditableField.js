export const validateEditableField = (fieldName, fieldValue) => {
  switch (fieldName) {
    case 'hflaWebsiteUrl':
      return doesLinkContainFlex(fieldValue, 'hackforla.org');
    case 'slackUrl':
      return doesLinkContainFlex(fieldValue, 'slack.com');
    case 'googleDriveUrl':
      return doesLinkContainFlex(fieldValue, 'drive.google.com');
    case 'githubUrl':
      return doesLinkContainFlex(fieldValue, 'github.com');
    case 'description':
      return typeof fieldValue === 'string' && fieldValue.length <= 250;
    default:
      break;
  }
};

export const generateErrorEditableField = (fieldName) => {
  switch (fieldName) {
    case 'hflaWebsiteUrl':
    case 'slackUrl':
    case 'googleDriveUrl':
    case 'githubUrl':
      return `Invalid field value for ${fieldName}`;
    case 'description':
      return 'Description is too long, max 250 characters allowed';
    default:
      break;
  }
};

const doesLinkContainFlex = (link, key) => {
  if (link.startsWith(`https://${key}`)) return true;
  if (link.startsWith(`https://www.${key}`)) return true;
  if (link.startsWith(key)) return true;
  return false;
};
