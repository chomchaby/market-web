import React,{ useState }  from 'react'
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import WestOutlinedIcon from '@mui/icons-material/WestOutlined';
import {Link} from "react-router-dom"
import './Slider.scss'
import {PRODUCT_CATEGORIES} from "../../context/Constant"

const Slider = () => {

  const categories = PRODUCT_CATEGORIES;
  // const categories = [
  //   { image: "/img/clothes.png",
  //     text: "Clothes"
  //   },
  //   { image: "/img/shoes.png",
  //     text: "Shoes"
  //   },
  //   { image:"/img/bags.png",
  //     text: "Bags"
  //   },
  //   { image: "/img/beauty&personal-care.png",
  //     text: "Beauty & Personal Care"
  //   },
  //   { image: "/img/fashion-accessories.png",
  //     text: "Fashion Accessories"
  //   },
  //   { image: "/img/computers&laptops.png",
  //     text: "Computers & Laptops"
  //   },
  //   { image:"/img/mobile&gadgets.png",
  //   text: "Mobile & Gadgets"
  //   },
  //   { image: "/img/food&beverages.png",
  //     text: "Food & Beverages"
  //   },
  //   { image: "/img/home-appliances.png",
  //     text: "Home Appliances"
  //   },
  //   // "/img/pets.png",
  //   // "/img/stationary&books.png",
  // ];

  const sizeOfImage = 10;
  const imgShow = 5;
  const [currentSlide, setCurrentSlide] = useState(0);
  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? 0 : (prev) => prev-1 );
  }
  const nextSlide = () => {
    setCurrentSlide(currentSlide === categories.length-imgShow ? categories.length-imgShow : (prev) => prev+1 );
  }
  

  return (
    <div className='slider'>
      <div className="icon" onClick={prevSlide}>
          <WestOutlinedIcon/>
      </div>
      <div className="container">
        <div className="images-container" style={{transform:`translateX(-${currentSlide*sizeOfImage}vw)`, width:`${categories.length*sizeOfImage}vw`}}>
          {categories.map((category, index) => (
            <Link to={`/products/${category.text}`} key={index} className={`item link`}>
                <img src={category.image} alt={`image-${index}`} />
                <p>{category.text}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className = "icon" onClick={nextSlide}>
          <EastOutlinedIcon/>
      </div>
      {/* <div className="icons">
        <div className="icon" onClick={prevSlide}>
          <WestOutlinedIcon/>
        </div>
        <div className = "icon" onClick={nextSlide}>
          <EastOutlinedIcon/>
        </div>
      </div> */}
    </div>
  )
}

export default Slider