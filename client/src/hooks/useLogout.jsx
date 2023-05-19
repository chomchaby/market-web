import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth, setCartNumber, setBalance } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            const response = await axios('/logout', {
                withCredentials: true
            });
            setCartNumber(undefined)
            setBalance(undefined)
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout