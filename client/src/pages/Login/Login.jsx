import React, {useRef, useState, useEffect} from 'react'
import { Link, useNavigate, useLocation, } from 'react-router-dom'

import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth';

import './Login.scss'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const LOGIN_URL = '/auth';
const CART_NUMBER_URL = '/cart-number'


const Login = () => {

    const { setAuth, setCartNumber, setBalance} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const axiosPrivate = useAxiosPrivate();

    const userRef = useRef();
    const errRef = useRef();

    const [user,setUser] = useState('');
    const [pwd,setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    //const loginRef = useRef(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])
   
    useEffect(() => {
        setErrMsg('');
    }, [user,pwd])

    // useEffect(() => {
    //     if (auth.value!= null) {
    //         loginRef.current = true;
    //         console.log("here")
    //     }
    // }, [handleSetAuth]);
    // useEffect(() => {
    //     if (loginRef.current) {
    //         navigate(from, {replace: true});
    //         console.log("here")
    //     }
    // },[loginRef.current])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ "username": user, "password": pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            // console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const username = response?.data?.username;
            const balance = response?.data?.balance;
            // const roles = response?.data?.roles;
            setAuth({ accessToken:accessToken, username:username});
            setBalance(balance)
            setUser('');
            setPwd('');
            // set cart number first time
            getCartNumber();

            navigate(from, {replace: true});
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }


    const getCartNumber = async () => {
        try {
            const response = await axiosPrivate.get(CART_NUMBER_URL);
            console.log(response.data);
            setCartNumber(response.data.cart_number)
        }
        catch (err) {
            console.error(err);
            // navigate('/login', { replace: true });
        }
    }

  return (
    <div className='login'>
        <div className="container">
            <p ref={errRef} className={errMsg? "errmsg":"offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    // required
                />
                <button>Sign In</button>
            </form>

            <p>
                Need an Account?<br />
                <Link className="link" to={`/register`}>
                    Sign Up
                </Link>
            </p>
        </div>
        
    </div>
  )
}

export default Login