// @types.AuthContext.ts
import React from 'react';

export type User = {
    id: string,
    email: string,
    username: string
  };

export type AuthContextType = {
    auth: User | null;
    setAuth: React.Dispatch<React.SetStateAction<User | null>>;
    checkAuth: () => Promise<void>;
};