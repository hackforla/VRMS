const HEADERS = {
  'Content-Type': 'application/json',
  'x-customrequired-header': process.env.REACT_APP_CUSTOM_REQUEST_HEADER,
};

const UserService = {
  async getData(email) {
    try {
      const response = await fetch('/api/checkuser', {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ email: email }),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  },
};

export default UserService;
