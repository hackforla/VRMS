const CognitoExpress = require("cognito-express");
const config = require("../config/auth.config");

const cognitoExpress = new CognitoExpress(config.cognitoSettings);

const authHandler = function(req, res, next) {
	const userInfo = req?.locals?.user;
  const accessToken = req.headers.authorization;

	console.log("authHandler.request", { accessToken, userInfo});
	if (!accessToken) return res.status(401).send("Access Token missing from header");

	cognitoExpress.validate(accessToken, function(err, userInfo) {
    console.log("authHandler.validate", {err, sub: userInfo?.sub});

    if (err)
      return res.status(401).send(err);

    // Add user info to request
    if(!req.locals) req.locals = {};
    req.locals.user = {
      userId: userInfo.sub,
      issuer: userInfo.iss,
      clientApp: userInfo.client_id,
      scope: userInfo.scope,
      authTime: userInfo.auth_time,
      expires: userInfo.exp
    };

    next();
	});
}

module.exports = authHandler;
