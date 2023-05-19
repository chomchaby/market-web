import React from 'react'
import {useNavigate} from "react-router-dom"

import './MyCard.scss'

const MyCard = ({pro, deleteProduct}) => {

  const navigate = useNavigate();
  
  return (
    // <Link className='link' to={`/my-store/edit-product/${pro.id}`}>
        <div className='myCard'>
            <div className="image">
                <span onClick={()=>deleteProduct(pro.id)}>Delete</span>
                <img 
                  src={pro.image_default_url} alt="" className='mainImg'
                  onClick={()=>navigate(`/my-store/edit-product/${pro.id}`)}/>
            </div>
            <h2>{pro.product_name}</h2>
            <div className="prices">
                {pro.price_min!==pro.price_max?
                  <h3>{pro.price_min} - {pro.price_max} THB</h3>
                  :
                  <h3>{pro.price_min} THB</h3>
                }              
            </div>
        </div>
    // </Link>
  )
}

export default MyCard