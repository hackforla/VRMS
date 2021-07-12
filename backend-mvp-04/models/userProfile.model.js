const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const userProfileSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  meetLocation: { type: String }, // HfLA locations user participates at
  timeZone: { type: String },			// user’s timezone
  signupEmail: { type: String, unique: true, index: true, required: true },	
    // user’s preferred contact email
  phone: { type: String },
  isTextingAllowed: { type: Boolean}, 
  isCodeOfConductAccepted: { type: Boolean}, 
  googleEmail: { type: String },	// user’s google account email address
  isGoogleEmailOk: { type: Boolean}, 
  isAdmin: { type: Boolean}, 
  isActive: { type: Boolean}, 
  createdDate: { type: Date, default: Date.now },
  github: {
    username: { type: String },		// user’s Github account username
    isConnected: { type: Boolean},		// successful GitHub HfLA connection
    is2FaOn: { type: Boolean},		// user’s GitHub 2FA status
    isMembershipPublic: { type: Boolean}
  },
  slack: {
    id: { type: String },			// user’s Slack-assigned ID
    username: { type: String },		// user’s Slack name
    isConnected: { type: Boolean}		// successful Slack workspace connection
  },
  lastCheckDate: { type: Date},	// date and time of last check for user’s connections
  currentJobTitle: { type: String },			// user’s current professional/non-HfLA job
  linkedInAccount: { type: String },
  targetCareer: { type: String },			// user’s target next professional/non-HfLA job
  desiredRoles: { type: String },			// user’s desired contributor roles at HfLA (structured)
  currentTechSkills: [{ type: String }],// user’s current technologies known to use as a volunteer
  targetTechSkills: [{ type: String }],	// user’s target new technologies to develop as a volunteer
  currentSkills: [{ type: String }],	// user’s current skills to use as a volunteer
  targetSkills: [{ type: String }],		// user’s target new skills to develop as a volunteer
  onboardingStatus: {
    googleAccount: { type: Boolean},
    codeOfConduct: { type: Boolean},
    baseInfo: { type: Boolean},
    slack: { type: Boolean},
    github: { type: Boolean},
    profile: { type: Boolean},
    team: { type: Boolean},
    call: { type: Boolean},
    finalInfo: { type: Boolean},
    careerInfo: { type: Boolean},
    github2Fa: { type: Boolean}
  }
});

userProfileSchema.methods.serialize = function () {
  return {
  id: this._id,
  firstName: this.firstName,
  lastName: this.lastName,
  meetLocation: this.meetLocation,
  timeZone: this.timeZone,			
  signupEmail: this.signupEmail,	
  phone: this.phone,
  isTextingAllowed: this.isTextingAllowed, 
  isCodeOfConductAccepted: this.isCodeOfConductAccepted, 
  googleEmail: this.googleEmail,	
  isGoogleEmailOk: this.isGoogleEmailOk, 
  isAdmin: this.isAdmin, 
  isActive: this.isActive, 
  createdDate: this.createdDate,
  github: {
    username: this.github.username,	
    isConnected: this.github.isConnected,		
    is2FaOn: this.github.is2FaOn,	
    isMembershipPublic: this.github.isMembershipPublic
  },
  slack: {
    id: this.slack.id,		
    username: this.slack.username,		
    isConnected: this.slack.isConnected		
  },
  lastCheckDate: this.lastCheckDate,	
  currentJobTitle: this.currentJobTitle,		
  linkedInAccount: this.linkedInAccount,
  targetCareer: this.targetCareer,			
  desiredRoles: this.desiredRoles,			
  currentTechSkills: this.currentTechSkills,
  targetTechSkills: this.targetTechSkills,	
  currentSkills: this.currentSkills,	
  targetSkills: this.targetSkills,		
  onboardingStatus: {
    googleAccount: this.onboardingStatus.googleEmail,
    codeOfConduct: this.onboardingStatus.codeOfConduct,
    baseInfo: this.onboardingStatus.baseInfo,
    slack: this.onboardingStatus.slack,
    github: this.onboardingStatus.github,
    profile: this.onboardingStatus.profile,
    team: this.onboardingStatus.team,
    call: this.onboardingStatus.call,
    finalInfo: this.onboardingStatus.finalInfo,
    careerInfo: this.onboardingStatus.careerInfo,
    github2Fa: this.onboardingStatus.github2Fa
  }

  };
};

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
