import { createContext, useState} from "react";
// import  secureLocalStorage  from  "react-secure-storage";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [cartNumber, setCartNumber] = useState();
    const [balance, setBalance] = useState();
    // const asyncLocalStorage = {
    //     setItem: async function (key, value) {
    //         await null;
    //         return localStorage.setItem(key, value);
    //     },
    //     getItem: async function (key) {
    //         await null;
    //         return localStorage.getItem(key);
    //     }
    // };

    // // auth includes user,pwd,accessToken,refreshToken
    // const [auth, setAuth] = useState( async () => {
    //     try {
    //         await null;
    //         return JSON.parse(asyncLocalStorage.getItem('auth'));
    //     }
    //     catch (err) {
    //         await null;
    //         return JSON.parse(null); 
    //     }
    // });
    
    // PROBLEM (might be FACT): auth alwasys be default value when refresh or navigate to components
    // USE AuthProvider along with localstorage
    // FIX as chatGpt suggest
    // when setAuth, store auth in localstorage
    // when use, set auth again from localstorage by useEffect() -> not working
    // useEffect(() => {
    //     // Load auth state from storage on startup
    //     const storedAuth = JSON.parse(window.localStorage.getItem("auth"));
    //     if (storedAuth) {
    //       setAuth(storedAuth);
    //     }
    // }, []);

    // const handleSetAuth = async(newAuth) => {
    //     console.log("Setting auth:", newAuth);
    //     setAuth(newAuth);
    //     //Save auth state to storage
    //     await asyncLocalStorage.setItem('auth', JSON.stringify(newAuth)).then(console.log(asyncLocalStorage.getItem('auth')))
    //     // window.localStorage.setItem("auth", JSON.stringify(newAuth));
    //     // return newAuth;
    // }

    return (
        <AuthContext.Provider value = {{ auth, setAuth, cartNumber, setCartNumber, balance, setBalance}}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthContext;