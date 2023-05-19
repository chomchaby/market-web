import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    // const { auth } = useContext(AuthContext);
    // console.log(auth);
    return useContext(AuthContext);
}

export default useAuth;