const { UserProfileService } = require("../services/userProfile.service");

const create = async (req, res, next) => {
  const userId = req?.locals?.user?.userId;

  const data = req.body;
  // for now, throw an error if the request doesn't match the current user
  if(data.awsUserId !== userId) {
    res.status(401).send();
  }

  await UserProfileService
    .createUser(data, data.signupEmail)
    .then(user => res.status(200).json(user))
    .catch(next);
}

module.exports = {
  create
};
