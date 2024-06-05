async function checkIfLoggedIn(auth: {id: string, email: string, username: string}) {
    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type':'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(auth)
      })
      .then(res => res.json())

      return response.res

    } catch (err) {
      console.log(err)
    }
  }

  export default checkIfLoggedIn;