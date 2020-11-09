const UserService = {
  async getData(email) {
    try {
      const response = await fetch('/api/checkuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  },
};

export default UserService;
