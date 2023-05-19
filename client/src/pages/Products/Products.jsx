import React, {useState, useEffect, useRef} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {PRODUCT_CATEGORIES} from "../../context/Constant"
import "./Products.scss"
import List from '../../components/List/List'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const HOME_PRODUCTS_URL = '/products'

const Products = () => {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { categoryName } = useParams();

  const [products, setProducts] = useState();
  // const [selectedCategory,setSelectedCategory] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [sort, setSort] = useState();
  

  useEffect(() => {
    
    const getProducts = async () => {
      let mp = maxPrice;
      if (mp === '') mp = 'undefined';
      try {
            const response = await axiosPrivate.get
              (HOME_PRODUCTS_URL+'/category='+categoryName+'/maxprice='+mp+'/sort='+sort);
            console.log(response.data);
            setProducts(response.data);
        }
        catch (err) {
            console.error(err);
            // navigate('/login', { replace: true });
        }
    }

      getProducts();

}, [axiosPrivate, categoryName, maxPrice, sort])

  return (
    <div className='products'>
      <div className="left">
        {/* <div className="filterItem">
          <h2>Product Categories</h2>
          <div className="inputItem">
            <input type="checkbox" id="1" value={1}/>
            <label htmlFor="1">Men clothes</label>
          </div>
          <div className="inputItem">
            <input type="checkbox" id="2" value={2}/>
            <label htmlFor="2">Women Clothes</label>
          </div>
          <div className="inputItem">
            <input type="checkbox" id="3" value={3}/>
            <label htmlFor="3">Bags</label>
          </div>
        </div> */}
        {/* <div className="filterItem">
          <h2>Filter by price</h2>
          <div className="inputItem">
            <span>0</span>
            <input type="range" min={0} max={1000} onChange={(e)=>setMaxPrice(e.target.value)}/>
            <span>{maxPrice}</span>
          </div>
        </div> */}
        <div className="filterItem">
            <h2>Product Categories</h2>
            {/* <div className="inputItem">
                    <input type="radio" id="all" value="all" name="category" onChange={(e)=>navigate(`/products/all`)}/>
                    <label htmlFor='all'>All Categories</label>
            </div> */}
            {PRODUCT_CATEGORIES.map((category, index) => (
                <div className="inputItem">
                    <input type="radio" id={category.text} value={category.text} name="category" onChange={(e)=>navigate(`/products/${category.text}`)}/>
                    <label htmlFor={category.text}>{category.text}</label>
                </div>
            ))}
        </div>
        <div className="filterItem">
          <h2>Filter by price</h2>
          <div className="inputItem">
            <input
              type="number"
              pattern="[0-9]*"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice((prev) => (e.target.validity.valid ? e.target.value : prev))
              }
            />
          </div>
        </div> 
        <div className="filterItem">
          <h2>Sort by</h2>
          <div className="inputItem">
            <input type="radio" id="asc" value="asc" name="price" onChange={(e)=>setSort("asc")}/>
            <label htmlFor="asc">Price (Lowest first)</label>
          </div>
          <div className="inputItem">
            <input type="radio" id="desc" value="desc" name="price" onChange={(e)=>setSort("desc")}/>
            <label htmlFor="desc">Price (Highest first)</label>
          </div>
        </div> 

    </div>
      <div className="right">
        {/* <img className='catImg' src="https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/241074112.jpg?k=af1627bc1d4d732297bd53866be665b21e31d1b155e93e5e3ee19081150d4179&o=" alt="some image" /> */}
        {/* <List catId={catId} maxPrice={maxPrice} sort={sort}></List> */}
        {products===undefined? 
           'loading...'
           : 
           products===null? // dont know how to check to show 'no product'
           <p>No product</p>
           :
           <div className="items">
            <h1>{categoryName}</h1> 
            <List pros={products}></List>
           </div>
          }
      </div>
    </div>
  )
}

export default Products