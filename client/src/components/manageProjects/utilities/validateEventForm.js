import validator from 'validator';
import { isWordInArrayInString } from './../../../utils/stringUtils.js';

const validateEventForm = (vals, projectToEdit) => {
  let newErrors = {};
  Object.keys(vals).forEach((key) => {
    switch (key) {
      case 'name':
        // Required
        if (!vals[key]) {
          newErrors = { ...newErrors, name: 'Event name is required' };
        } else if (
          isWordInArrayInString(
            ['meeting', 'mtg', projectToEdit.name.toLowerCase()],
            vals[key].toLowerCase()
          )
        ) {
          newErrors = {
            ...newErrors,
            name: "Event name cannot contain 'meeting' or 'mtg' or the project name",
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
        if (!containsHttps(vals[key])) {
          newErrors = {
            ...newErrors,
            videoConferenceLink: 'Your link must start with https://',
          };
        }
        if (!containsZoomOrGMeet(vals[key])) {
          newErrors = {
            ...newErrors,
            videoConferenceLink: 'This does not look like a valid Zoom or Google Meet link',
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

function containsHttps(str){
  return str.toLowerCase().includes('https://');
}

function containsZoomOrGMeet(str){
  return str.toLowerCase().includes('meet.google.com/') ||
    str.toLowerCase().includes('zoom.us');
}
