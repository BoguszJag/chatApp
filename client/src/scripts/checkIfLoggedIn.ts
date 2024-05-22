async function checkIfLoggedIn(auth: object) {
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

      // console.log(response)

      return response.res

    } catch (err) {
      console.log(err)
    }
  }

  export default checkIfLoggedIn;