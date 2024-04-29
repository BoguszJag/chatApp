import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export default useAuth;