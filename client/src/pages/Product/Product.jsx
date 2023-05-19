import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BalanceIcon from '@mui/icons-material/Balance';

import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import './Product.scss'

const HOME_PRODUCT_URL = '/product/'
const ADD_PRODUCT_TO_CART = '/add-product-to-cart'

const Product = () => {

  const {setCartNumber} = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { productId } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const prevSubproductId = parseInt(searchParams.get('param1'));
  const prevQuantity = parseInt(searchParams.get('param2'));


  // product information
  const [name,setName] = useState('');
  const [category, setCategory] = useState();
  const [desc,setDesc] = useState('');
  const [subproducts, setSubproducts] = useState([])
  const [images, setImages] = useState([]);
  const [vendor, setVendor] = useState();

  // choices
  const [selectedImg, setSelectedImg] = useState(); //Index
  const [selectedSubproduct, setSelectedSubproduct] = useState(0); //Index
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {

    const getProductInfo = async () => {
        try {
            const response = await axiosPrivate.get(HOME_PRODUCT_URL+productId);
            console.log(response.data);
            if (response.data.id) {
                setName(response.data.product_name);
                setCategory(response.data.category_name)
                setDesc(response.data.description)
                setSubproducts(response.data.subproducts)
                setImages(response.data.images);
                for (let i = 0; i < response.data.images.length; i++) {
                    if (response.data.images[i].isDefault === true) {
                      setSelectedImg(i);
                      break;
                    }
                }
                setVendor(response.data.vendor)
                if (response.data.subproducts[0].stock === 0)
                setQuantity(0)
            }
        }
        catch (err) {
            console.error(err);
            navigate('/login', { replace: true });
        }
    }
      getProductInfo();

  },[])

  useEffect(() => {
      if (!isNaN(prevSubproductId)) {
        const index = subproducts.findIndex(item => item.id === prevSubproductId);
        setSelectedSubproduct(index)
        // console.log(prevSubproductId)
      }
      if (!isNaN(prevQuantity)) {
        setQuantity(prevQuantity)
        // console.log(prevQuantity)
      }

  },[subproducts])


    const handleAddToCartClick = async(e) => {
        e.preventDefault();
        try {
          const response = await axiosPrivate.post(ADD_PRODUCT_TO_CART, 
            JSON.stringify({ "subproduct_id": subproducts[selectedSubproduct].id, "quantity": quantity, "prev_subproduct_id":prevSubproductId }),
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            });
          console.log(response.data);
          setCartNumber(response.data.cart_number)
         
        }
        catch (err) {
            console.error(err);
            navigate('/login', { replace: true });
        }
    }

  // const images = [
  //   "https://i.pinimg.com/736x/0f/11/d2/0f11d20b178ed20bcf9fc162436cdadf.jpg",
  //   "https://images.pexels.com/photos/1575861/pexels-photo-1575861.jpeg?cs=srgb&dl=pexels-dustin-tray-1575861.jpg&fm=jpg",
  //   "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
  // ]

  return (
    <div className='product'>
      <div className="left">
        <div className="images">
          { images?.map((image,index) => (
              <img src={image?.url} alt="" onClick={e=>setSelectedImg(index)}/>
            ))
          }
          {/* <img src={images[0]} alt="" onClick={e=>setSelectedImg(0)}/>
          <img src={images[1]} alt="" onClick={e=>setSelectedImg(1)}/>
          <img src={images[2]} alt="" onClick={e=>setSelectedImg(2)}/> */}
        </div>
        <div className="mainImg">
          <img src={images[selectedImg]?.url} alt="" />
        </div>
      </div>
      <div className="right">
        <h1>{name}</h1>
        <span className='price'>THB {subproducts[selectedSubproduct]?.price}</span>
        <p>{desc}</p>
        <div className="variation">
          {subproducts?.map((subproduct,index) => (
            <span className={index === selectedSubproduct ? 'selected':''} 
            onClick={()=>{
              setSelectedSubproduct(index); 
              setQuantity(subproducts[index]?.stock === 0 ? 0:1)}}>
              {subproduct?.variation}</span>
          ))}
        </div>

        <div className="quantity">
          <button disabled={subproducts[selectedSubproduct]?.stock === 0} onClick={()=>setQuantity(prev=> prev===1 ? prev : prev-1)}>-</button>
            {quantity}
          <button disabled={subproducts[selectedSubproduct]?.stock === 0} onClick={()=>setQuantity(prev=> subproducts[selectedSubproduct]?.stock <= prev ? prev:prev+1)}>+</button>
          <span>{subproducts[selectedSubproduct]?.stock} {subproducts[selectedSubproduct]?.stock>1 ? 'pieces':'piece'} available</span>
        </div>

        <button className='add' disabled={subproducts[selectedSubproduct]?.stock === 0} onClick={handleAddToCartClick}>
          <AddShoppingCartIcon/> ADD TO CART
        </button>

        {/* <div className="link">
          <div className="item">
            <FavoriteBorderIcon/> ADD TO WISH LIST
          </div>
          <div className="item">
            <BalanceIcon/> ADD TO COMPARE
          </div>
        </div> */}

        <div className="info">
          <span>Product Category: {category}</span>
          <span>Vendor: {vendor}</span>
          {/* <span>Tag: Nature, View, Vacation</span> */}
        </div>
        <hr />

        {/* <div className="info">
          <span>DESCRIPTION</span>
          <hr />
          <span>ADDITIONAL INFORMATION</span>
          <hr />
          <span>FAQ</span>
        </div> */}
      </div>
    </div>
  )
}

export default Product