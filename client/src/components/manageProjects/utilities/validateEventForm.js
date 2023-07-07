import validator from 'validator';
import { isAnySubstring } from './../../../utils/stringUtils.js';

const validateEventForm = (vals) => {
  let newErrors = {};
  Object.keys(vals).forEach((key) => {
    switch (key) {
      case 'name':
        // Required
        if (!vals[key]) {
          newErrors = { ...newErrors, name: 'Event name is required' };
        } else if (isAnySubstring(['meeting', 'mtg'], vals[key])) {
          newErrors = {
            ...newErrors,
            name: "Event name cannot contain 'meeting' or 'mtg'",
          };
        }
        break;

      case 'videoConferenceLink':
        // Required
        if (!vals[key]) {
          newErrors = {
            ...newErrors,
            videoConferenceLink: 'Event link is required',
          };
        }
        if (!validateLink(vals[key])) {
          newErrors = {
            ...newErrors,
            videoConferenceLink: 'Invalid link',
          };
        }
        break;

      default:
        break;
    }
  });
  return Object.keys(newErrors).length ? newErrors : null;
};

export default validateEventForm;

function validateLink(str) {
  return validator.isURL(str);
}
