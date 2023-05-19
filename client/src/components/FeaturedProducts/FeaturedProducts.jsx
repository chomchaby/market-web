import React from 'react'

import BlueprintCard from '../BlueprintCard/BlueprintCard'
import './FeaturedProducts.scss'

const FeaturedProducts = ({type}) => {

    const data = [
    {
        id: 1,
        img: "https://img.faballey.com/images/Product/DRS04932B/d3.jpg",
        img2: "https://img.faballey.com/images/Product/DRS04932B/d4.jpg",
        title : "Lilac Corset Double Breasted Dress",
        oldPrice: 19,
        price: 12,
        isNew: true
    },
    {
        id: 2,
        img: "https://assets.hermes.com/is/image/hermesproduct/clic-h-bracelet--700001FO01-worn-1-0-0-800-800_g.jpg",
        img2: "https://assets.hermes.com/is/image/hermesproduct/clic-h-bracelet--700001FO01-worn-4-0-0-800-800_g.jpg",
        title : "Clic H bracelet",
        oldPrice: 19,
        price: 12,
        isNew: true
    },
    {
        id: 3,
        img: "https://lzd-img-global.slatic.net/g/p/9414a4c96ec9a784bfb316ac0378e1e0.jpg_720x720q80.jpg_.webp",
        img2: "https://lzd-img-global.slatic.net/g/p/9414a4c96ec9a784bfb316ac0378e1e0.jpg_720x720q80.jpg_.webp",
        title : "Women Jean Short",
        oldPrice: 19,
        price: 12,
        isNew: true
    },

    ]
  return (
    <div className='featuredProducts'>
        <div className="top">
            <h1>{type} products</h1>
            <p>some explanation</p>
        </div>
        <div className="bottom">
            {data.map(item=>(
                <BlueprintCard item={item} key={item.id}/>
            ))}
        </div>
    </div>
  )
}

export default FeaturedProducts