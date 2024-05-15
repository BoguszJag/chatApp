import React, { createContext, useState } from 'react'
import checkIfLoggedIn from '../checkIfLoggedIn';

const AuthContext = createContext<any>({});

export const AuthContextProvider = ({ children }: any) => {
  const [auth, setAuth] = useState({user: localStorage.getItem('user') || null});

  let currentUser = auth.user;

  if(typeof currentUser === 'string') {
    currentUser = JSON.parse(currentUser);
    setAuth({user: currentUser})
  };

  const checkAuth = async () => {
    if(auth) {
      const result =  await checkIfLoggedIn(auth);
      if(result === false) {
        setAuth({user: null});
      };
      return result;
    };
  };

  return (
    <AuthContext.Provider value={{auth, setAuth, checkAuth}}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthContext;