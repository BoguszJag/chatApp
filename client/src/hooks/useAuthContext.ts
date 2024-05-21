import { AuthContextType } from "../@types/AuthContext";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext) as AuthContextType;
  return context;
};

export default useAuth;