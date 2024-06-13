async function checkIfLoggedIn(auth: {id: string, email: string, username: string} | string | null) {
  if(auth) {
    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type':'application/json',
          'Accept': 'application/json'
        },
        body: typeof auth === 'string' ? auth : JSON.stringify(auth)
      })
      .then(res => res.json());

      return response.user;

    } catch (err) {
      console.log(err);
    };
  };
};

  export default checkIfLoggedIn;