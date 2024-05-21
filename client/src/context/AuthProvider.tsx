import React, { createContext, useState } from 'react'
import checkIfLoggedIn from '../checkIfLoggedIn';
import { AuthContextType, User } from '../@types/AuthContext';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [auth, setAuth] = useState<User | null>(null);
  //const [auth, setAuth] = useState({user: localStorage.getItem('user') || null});

  const checkAuth = async () => {
    if(auth) {
      const result =  await checkIfLoggedIn(auth);
      if(result === false) {
        setAuth(null);
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