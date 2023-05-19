import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, useLocation} from 'react-router-dom'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import MyStoreProfile from '../../components/MyStoreProfile/MyStoreProfile';
import MyStoreProducts from '../../components/MyStoreProducts/MyStoreProducts';


import "./MyStore.scss"
const MY_STORE_URL = '/my-store'

const MyStore = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    // const effectRan = useRef(false);

    const [store, setStore] = useState();
    const [hasStore, setHasStore] = useState(false);


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
                setStore(response.data);
                if (response.data.id) {
                    setHasStore(true)
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




  return (
    <div className='myStore'> 
        { hasStore?
            <div className="storeContainer">
                <MyStoreProfile 
                    name={store.store_name} 
                    desc={store.description} 
                    image={store.pic_url} 
                    join_date={store.time_created}
                ></MyStoreProfile>

                <MyStoreProducts>
                </MyStoreProducts>
                
            </div>
            :
            <div className="createContainer">
                <div className="addIcon">
                    <AddCircleOutlineIcon onClick={()=>navigate('/my-store/register')}></AddCircleOutlineIcon>
                </div>
                <div className="item">
                    Create Your Store
                </div>
            </div>
        }
    </div>
  )
}

export default MyStore