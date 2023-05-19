import React from 'react'
import {Link} from "react-router-dom"

import './Card.scss'

const Card = ({pro}) => {
  return (
    <Link className='link' to={`/product/${pro.id}`}>
        <div className='card'>
            <div className="image">
                <img src={pro.image_default_url} alt="" className='mainImg'/>
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
    </Link>
  )
}

export default Card