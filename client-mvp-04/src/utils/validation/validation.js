export class Email {
  static isValid(value) {
    const pattern = /\b[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;
    return value.search(pattern) !== -1;
  }
}

export class Skills {
  static isValid(skillOptions, skillsInputed){
    if(skillsInputed.length === 0) return false;
    return skillsInputed.every(skill => skillOptions.includes(skill));
  }
}