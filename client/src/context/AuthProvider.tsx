import React, { createContext, useState } from 'react'
import checkIfLoggedIn from '../scripts/checkIfLoggedIn';
import { AuthContextType, User } from '../@types/AuthContext';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [auth, setAuth] = useState<User | null>(null);
  const [authStorage, setAuthStorage] = useState<string | null>(null);
  //const [auth, setAuth] = useState({user: localStorage.getItem('user') || null});

  const checkAuth = async () => {
    let result;
    setAuthStorage(localStorage.getItem('user'));
    if(authStorage) {
      result = await checkIfLoggedIn(authStorage);
    } else {
      result = await checkIfLoggedIn(localStorage.getItem('user'));
    }
    if(!result) {
      localStorage.clear();
    }
    setAuth(result);
  };

  return (
    <AuthContext.Provider value={{auth, setAuth, checkAuth, authStorage, setAuthStorage}}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthContext;