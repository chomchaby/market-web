import React, {useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import List from '../List/List'

import "./MyStoreProducts.scss"
import {PRODUCT_CATEGORIES} from "../../context/Constant"
const MY_PRODUCTS_URL = '/my-store/products/'
const DELETE_MY_PRODUCT_URL = '/my-store/delete-product/'

const MyStoreProducts = () => {

    const axiosPrivate = useAxiosPrivate();
    // const effectRan = useRef(false);

    const catId = parseInt(useParams().id)
    const [showCategory,setShowCategory] = useState('all')
    const [products, setProducts] = useState();
    const [productsUpdated, setProductsUpdated] = useState(false);

    const deleteProduct = async (productId) => {
      try {
          const response = await axiosPrivate.delete(DELETE_MY_PRODUCT_URL+productId,);
          console.log(response?.data);

          setProductsUpdated(!productsUpdated);

      } catch (err) {
          console.error(err);
      }
  }

    useEffect(() => {
        // let isMounted = true;
        // const controller = new AbortController();
        
        const getProducts = async () => {
            try {
                const response = await axiosPrivate.get(MY_PRODUCTS_URL+showCategory, 
                    // {
                    //     signal: controller.signal
                    // }
                    );
                console.log(response.data);
                // isMounted && 
                setProducts(response.data);

            }
            catch (err) {
                console.error(err);
                // navigate('/login', { replace: true });
            }
        }
        // if (effectRan.current === true ){
          getProducts();
        // }
        // return () => {
        //   isMounted = false;
        //   controller.abort();
        //   effectRan.current = true;
        // }
    }, [axiosPrivate, showCategory, productsUpdated])


    
    return (
      <div className='myStoreProducts'>
        <div className="left">
 
          <div className="filterItem">
            <h2>Product Categories</h2>
            <div className="inputItem">
                    <input type="radio" id="all" value="all" name="category" onChange={(e)=>setShowCategory('all')}/>
                    <label htmlFor='all'>All Categories</label>
            </div>
            {PRODUCT_CATEGORIES.map((category, index) => (
                <div className="inputItem">
                    <input type="radio" id={category.text} value={category.text} name="category" onChange={(e)=>setShowCategory(category.text)}/>
                    <label htmlFor={category.text}>{category.text}</label>
                </div>
            ))}
          </div>

        </div>

        <div className="right">
          {products===undefined? 
           'loading...'
           : 
           products===null? // dont know how to check to show 'no product'
           <p>No product</p>
           :
           PRODUCT_CATEGORIES.map((category, index) => (
              products[category.text]?.length>0
                ? <div className="category">
                    <h2>{category.text}</h2> 
                    <List 
                      pros={products[category.text]}
                      deleteProduct={deleteProduct}
                    ></List>
                  </div>
                : null
            ))
          }
        </div>
      </div>
    )
}

export default MyStoreProducts