import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation} from 'react-router-dom'

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import './Cart.scss'
const PRODUCTS_IN_CART_URL = '/products-in-cart'
const DELETE_PRODUCT_FROM_CART_URL = '/delete-product-from-cart/'
const CART_CHECKOUT_URL = '/checkout'

const Cart = () => {

    const data = [
        {
            id: 1,
            img: "https://cdn.shopify.com/s/files/1/0490/9324/7140/products/32336_2RM399CafeTaupe_1024x.jpg?v=1663554899",
            img2: "https://www.engdict.com/data/dict/media/images_public/hat-00085638_normal.png",
            title : "Shirt",
            oldPrice: 19,
            price: 12,
            isNew: true,
            desc: "Long Sleeve Graphic T-shirt"
        },
        {
            id: 2,
            img: "https://cdn.shopify.com/s/files/1/0490/9324/7140/products/32336_2RM399CafeTaupe_1024x.jpg?v=1663554899",
            img2: "https://www.cuyana.com/dw/image/v2/BDQQ_PRD/on/demandware.static/-/Sites-master-catalog-cuyana/default/dw55c66231/pdp_white_hero_900x900_panamahat_black_hero_9142_3.jpg?sw=1600",
            title : "Skirt",
            oldPrice: 19,
            price: 12,
            isNew: true,
            desc: "Long skirt. A woman finds a pot of treasure on the road while she is returning from work."
        },
    ]

    const {setCartNumber, setBalance} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const [subproducts, setSubproducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([])
    const [subtotal, setSubtotal] = useState(0);


    const getProductsInCart = async () => {
        try {
            const response = await axiosPrivate.get(PRODUCTS_IN_CART_URL);
            console.log(response.data);
            setSubproducts(response.data.cart_subproducts);
            setCartNumber(response.data.cart_number)
        }
        catch (err) {
            console.error(err);
            navigate('/login', { replace: true });
        }
    }

    useEffect(() => {
        getProductsInCart();
    },[])


    const handleDeleteProductInCart = async (subproduct) => {
        try {
            const response = await axiosPrivate.delete(DELETE_PRODUCT_FROM_CART_URL+subproduct.id,);
            console.log(response?.data);
            setCartNumber(response.data.cart_number);
            if (selectedProducts.some(item => item.id === subproduct.id))
                setSubtotal(prev => prev - subproduct.quantity*subproduct.price)
            const newSubproducts = [...subproducts];
            const index = subproducts.findIndex((item) => item.id===subproduct.id);
            newSubproducts.splice(index,1);
            setSubproducts(newSubproducts);  
            
        } catch (err) {
            console.error(err);
        } 
    }

    function addSelectedProduct(subproduct) {
        // const newSelectedProduct = {
        //     id : subproduct.id, // subproduct id
        //     quantity : subproduct.quantity
        // }
        setSelectedProducts([...selectedProducts, subproduct.id]);
        setSubtotal(prev => prev+subproduct.quantity*subproduct.price)
    }
    function removeSelectedProduct(subproduct) {
        const updatedSelectedProducts = selectedProducts.filter(
          (selectedProduct) => selectedProduct !== subproduct.id
        );
        setSelectedProducts(updatedSelectedProducts);
        setSubtotal(prev => prev - subproduct.quantity*subproduct.price)
    }

    const handleProceedToCheckout = async () => {
        try {
            const response = await axiosPrivate.post(CART_CHECKOUT_URL,
                JSON.stringify({ "items": selectedProducts}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data);
            setBalance(response.data.balance)
            getProductsInCart();
            setSubtotal(0)
        }
        catch (err) {
            console.error(err);
            // navigate('/login', { replace: true });
        }
    }
      

  return (
    <div className='cart'>
        <div className="container">
        <h1>Products in your cart</h1>
        {subproducts?.map(sub=>(
            <div 
                className={`item ${selectedProducts.some((selectedProduct) => selectedProduct.id === sub.id)
                    ? 'selected': '' }`}
                key={sub.id}>
                {selectedProducts.some((selectedProduct) => selectedProduct === sub.id) ?
                    <CheckBoxIcon className='checkbox' onClick={()=>removeSelectedProduct(sub)}></CheckBoxIcon>
                    :
                    <CheckBoxOutlineBlankIcon className='checkbox' onClick={()=>addSelectedProduct(sub)}></CheckBoxOutlineBlankIcon>
                }
                <img src={sub.default_image} alt="" onClick={()=>navigate(`/product/${sub.product_id}?param1=${sub.id}&param2=${sub.quantity}`)}/>
                <div className='details'>
                    <h1 onClick={()=>navigate(`/product/${sub.product_id}?param1=${sub.id}&param2=${sub.quantity}`)}>{sub.product_name}</h1>
                    <p>variation: {sub.variation?.substring(0,100)}</p>
                    <div className="price">{sub.quantity} x {sub.price} THB</div>
                </div>
                <DeleteOutlineIcon className='delete' onClick={()=>handleDeleteProductInCart(sub)}/>
            </div>
        ))}
        <div className="total">
            <span>SUBTOTAL</span>
            <span>THB {subtotal}</span>
        </div>
        <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
        {/* <span className='reset'>Reset Cart</span> */}
        </div>
    </div>
  )
}

export default Cart