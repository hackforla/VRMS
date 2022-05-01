const { UserProfileService } = require("../services/userProfile.service");

const getMe = async (req, res, next) => {
  const userId = req?.locals?.user?.userId;

  await UserProfileService
    .getUserByAwsUserId(userId)
    .then(user => {
      if(user)
        res.status(200).json(user)
      else
        res.status(404).send()})
    .catch(next);
}

module.exports = {
  getMe
};
