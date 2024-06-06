import React, { createContext, useState } from 'react'
import checkIfLoggedIn from '../scripts/checkIfLoggedIn';
import { AuthContextType, User } from '../@types/AuthContext';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [auth, setAuth] = useState<User | null>(null);
  //const [auth, setAuth] = useState({user: localStorage.getItem('user') || null});

  const checkAuth = async () => {
    let result;
    if(auth) {
      result = await checkIfLoggedIn(auth).then(auth => {return auth});
    } else {
      const user = localStorage.getItem('user');
      user ? result = await checkIfLoggedIn(user).then(user => {return user}) : result = null;
    }
    if(!result) {
      localStorage.clear();
    }
    setAuth(result);
  };

  return (
    <AuthContext.Provider value={{auth, setAuth, checkAuth}}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthContext;