import { Auth } from 'aws-amplify';

export const securedFetch = async (input, settings = {}) => {
  const session = await Auth.currentSession();
  const accessToken = session.getAccessToken()
  const jwtToken = accessToken.getJwtToken();
  const authHeader = { "authorization": jwtToken };

  let headers = settings?.headers;
  if(headers instanceof Headers) {
    headers.set("authorization", jwtToken);
  } else if(Array.isArray(headers)) {
    headers.push(["authorization", jwtToken])
  } else if(typeof headers === "object") {
    headers = {...headers, authHeader};
  } else {
    headers = authHeader;
  }
  
  settings = {...settings, headers};
  return await fetch(input, settings);
}
