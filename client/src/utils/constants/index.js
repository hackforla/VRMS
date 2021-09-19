export const AUTH_ORIGIN = ['LOG_IN', 'ONBOARDING', 'GOOGLE_ACCOUNT_CHECK'];

export const AUTH_CONFIG = {
  "aws_user_pools_id": process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  "aws_user_pools_web_client_id": process.env.REACT_APP_AWS_COGNITO_APP_CLIENT_ID
};