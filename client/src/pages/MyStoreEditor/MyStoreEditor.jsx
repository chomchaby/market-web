import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, useLocation} from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import {faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import './MyStoreEditor.scss'
import {BLANK_IMAGE} from "../../context/Constant"
const MY_STORE_URL = '/my-store'
const STORE_REGISTER_URL = '/my-store/register';
const EDIT_MY_STORE_URL = '/my-store/edit-profile';

const NAME_REGEX = /^[a-zA-Z][\w& -]{1,29}$/;

const MyStoreEditor = () => {
    

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    // const effectRan = useRef(false);

    const [name,setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [desc,setDesc] = useState('');

    const [image, setImage] = useState('');
    const [validImage, setValidImage] = useState(true);

    const [edit, setEdit] = useState(false)

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
        const result = NAME_REGEX.test(name);
        setValidName(result);
    }, [name])
    
    useEffect(() => {
        setErrMsg('');
    }, [name,desc,image])


    useEffect(() => {
        // let isMounted = true;
        // const controller = new AbortController();
        
        const getStore = async () => {
            try {
                const response = await axiosPrivate.get(MY_STORE_URL, {
                    // signal: controller.signal
                });
                console.log(response.data);
                // isMounted && 
                if (response.data.id) {
                    setName(response.data.store_name);
                    setDesc(response.data.description)
                    setImage(response.data.pic_url);
                    setEdit(true)
                    setValidImage(true)
                }
            }
            catch (err) {
                console.error(err);
                navigate('/login', { replace: true });
            }
        }
        // if (effectRan.current === true ){
          getStore();
        // }
        // return () => {
        //   isMounted = false;
        //   controller.abort();
        //   effectRan.current = true;
        // }
    },[])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.post(STORE_REGISTER_URL,
                JSON.stringify({ "name": name, "desc": desc, "img": image }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            navigate('/my-store', {replace:true})
            
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    } 

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.put(EDIT_MY_STORE_URL,
                JSON.stringify({ "name": name, "desc": desc, "img": image }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            navigate('/my-store', {replace:true}) // do not call useEffect() with []
            
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    } 

  return (
    <div className="myStoreEditor">
        {/* {image} */}
        {validImage}
        <div className="container">
        <div className="left">
            <div className="mainImg">
                <img src={validImage ? image : BLANK_IMAGE} alt="" onError={() => {setValidImage(false)}} />
            </div>
        </div>
        <div className="right">
           <p ref={errRef} className={errMsg? "errmsg":"offscreen"} aria-live="assertive">{errMsg}</p>
           <h1>{ edit? 'Edit Store Profile':'Store Registration'}</h1>
           <form onSubmit={ edit? handleEdit : handleSubmit}>
               <label htmlFor="name">
                   Store Name:
                   <span className={validName || name==='' ? "hide":"invalid"}>
                       <FontAwesomeIcon icon={faTimes} />
                   </span>
               </label>
               <input
                   type="text"
                   id="name"
                   //ref={nameRef}
                   autoComplete="off"
                   onChange={(e) => setName(e.target.value)}
                   value={name}
                   required
                   aria-invalid={validName ? "false":"true"}
                   aria-describedby="namenote"
                   onFocus={() => setNameFocus(true)}
                   onBlur={() => setNameFocus(false)}
               />
               <p id="namenote" className={nameFocus&&!validName ? "instructions":"offscreen"}>
                   <FontAwesomeIcon icon={faInfoCircle}/>
                   2 to 40 characters.<br/>
                   Must begin with a letter. <br/>
                   Letters, numbers, underscores, hyphends, ampersands allowed.  
               </p>
               <label htmlFor="desc">Store Description:</label>
               <textarea
                   id="desc"
                   onChange={(e) => setDesc(e.target.value)}
                   value={desc}
                   rows={5}
               />
               <label htmlFor="img">
                   Profile Image (URL)
                   <span className={ validImage || image==='' ? "hide":"invalid"}>
                       <FontAwesomeIcon icon={faTimes} />
                   </span>
               </label>
               <textarea
                   id="img"
                   onChange={(e) => {setImage(e.target.value); setValidImage(true)}}
                   value={image}
               />
               <div className='submit-btn'>
                    {  edit?
                        <button disabled={(validImage || image==='') && validName ? false : true}>
                            Save
                        </button>
                        :
                        <button disabled={(validImage || image==='') && validName ? false : true}>
                            Submit
                        </button>
                    }
                    <button type="button" onClick={()=>navigate('/my-store', {replace:true})}>
                        Cancel
                    </button>
               </div>

           </form>
        </div>
        </div>

</div>  
  )
}

export default MyStoreEditor