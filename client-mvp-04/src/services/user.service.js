const HEADERS = {
  'Content-Type': 'application/json',
  'x-customrequired-header': process.env.REACT_APP_CUSTOM_REQUEST_HEADER,
};

export default async function getUser(email) {
  try {
    const response = await fetch('/api/checkuser', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email: email }),
    });
    return await response.json();
  } catch (error) {
    console.log('User is not registered in the app');
    console.log(error);
    return null;
  }
}
