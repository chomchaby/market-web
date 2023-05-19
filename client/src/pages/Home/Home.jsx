import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, useLocation} from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Slider from '../../components/Slider/Slider'
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts'
import "./Home.scss"
const HOME_URL = '/home';

const Home = () => {
  
  const [person, setPerson] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false)


  useEffect(() => {
      let isMounted = true;
      const controller = new AbortController();
      
      const getProducts = async () => {
          try {
              const response = await axiosPrivate.get(HOME_URL, {
                  signal: controller.signal
              });
              console.log(response.data);
              isMounted && setPerson(response.data);
          }
          catch (err) {
              console.error(err);
              //navigate('/login', { state: { from: location }, replace: true });
          }
      }
      if (effectRan.current === true ){
        getProducts();
      }
      return () => {
        isMounted = false;
        controller.abort();
        effectRan.current = true;
      }
  },[])

  return (
    <div className='home'>
      <Slider/>
      <FeaturedProducts type = "On-Sale"/>
      {/* <FeaturedProducts type = "featured"/> */}
      {/* <FeaturedProducts type = "trending"/> */}
    </div>
  
  )
}

export default Home