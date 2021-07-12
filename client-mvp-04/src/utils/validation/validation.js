export class Email {
  static isValid(value) {
    const pattern = /\b[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;
    return value.search(pattern) !== -1;
  }
}

/** 
* the following Skill.isValid validation is not in use. 
* It is meant is meant to be used on http post request, 
* to check that inputed skills are within the skills options.
* There is already validation inside the component, 
* this is extra, beating over the head redundancy, if needed. 
*/
export class Skills {
  static isValid(skillOptions, skillsInputed){
    if(skillsInputed.length === 0) return false;
    return skillsInputed.every(skill => skillOptions.includes(skill));
  }
}