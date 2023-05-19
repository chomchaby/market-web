import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth, setBalance } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            // headers: { 'Authorization': `Bearer ${auth?.refreshToken}` },
            withCredentials: true
        });
        setAuth(prev => {
            // console.log(JSON.stringify(prev));
            // console.log(response.data.accessToken);
            return {...prev, 
                username: response.data.username,
                accessToken: response.data.accessToken}
        });
        //setAuth(prevAuth => ({ ...prevAuth, accessToken: response.data.accessToken }));

        setBalance(response.data.balance)
    
        return response.data.accessToken;
    }
    return refresh;
}
export default useRefreshToken;