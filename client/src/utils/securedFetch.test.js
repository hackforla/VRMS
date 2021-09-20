import { Auth } from 'aws-amplify';
import { securedFetch } from "./securedFetch";

describe('securedFetch', () => {
  const endpoint = "https://localhost:3000/api/testendpoint";
  const jwtToken = "Secret-Token";

  let lastSettings;

  const authMock = jest
    .spyOn(Auth, 'currentSession')
    .mockReturnValue({ 
      isTest: true,
      getAccessToken: () => ({ 
        isTest: true,
        getJwtToken: () => jwtToken
      })
    });

  const fetchMock = jest
    .spyOn(global, 'fetch')
    .mockImplementation((input, settings) => {
      lastSettings = settings;
      return Promise.resolve({ json: () => Promise.resolve({}) }) 
    });

  it('Should append auth to generic request', async () => {
    await securedFetch(endpoint);
    const lastCalledHeaders = lastSettings.headers;
    expect(lastCalledHeaders.authorization).toEqual(jwtToken);
  });
  it('Should append auth to request with headers object', async () => {
    const settings = {
      headers: new Headers({"cors": "*"})
    };
    await securedFetch(endpoint, settings);
    const lastCalledHeaders = lastSettings.headers;
    expect(lastCalledHeaders).toBeInstanceOf(Headers);
    expect(lastCalledHeaders.get("authorization")).toEqual(jwtToken);
  });
  it('Should append auth to request with headers array', async () => {
    const settings = {
      headers: [["cors", "*"]]
    };
    await securedFetch(endpoint, settings);
    const lastCalledHeaders = lastSettings.headers;
    expect(Array.isArray(lastCalledHeaders)).toBe(true);
    const [key, value] = lastCalledHeaders.find(h => h[0] === "authorization");
    expect(value).toEqual(jwtToken);
  });
  it('Should append auth to request with settings object', async () => {
    const settings = {
      headers: {"cors": "*"}
    };
    await securedFetch(endpoint, settings);
    const lastCalledHeaders = lastSettings.headers;
    const value = lastCalledHeaders.authorization;
    expect(value).toEqual(jwtToken);
  });
  it('Should append auth to request with null settings', async () => {
    await securedFetch(endpoint, null);
    const lastCalledHeaders = lastSettings.headers;
    expect(typeof lastCalledHeaders === "object").toBe(true);
    expect(lastCalledHeaders.authorization).toEqual(jwtToken);
  });
});
