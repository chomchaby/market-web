import React from 'react'
import './Cart.scss'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
  return (
    <div className='cart'>
        <h1>Products in your cart</h1>
        {data?.map(item=>(
            <div className="item" key={item.id}>
                <img src={item.img} alt="" />
                <div className='details'>
                    <h1>{item.title}</h1>
                    <p>{item.desc?.substring(0,100)}</p>
                    <div className="price">1 x {item.price} THB</div>
                </div>
                <DeleteOutlineIcon className='delete'/>
            </div>
        ))}
        <div className="total">
            <span>SUBTOAL</span>
            <span>THB 123</span>
        </div>
        <button>PROCEED TO CHECKOUT</button>
        <span className='reset'>Reset Cart</span>
    </div>
  )
}

export default Cart