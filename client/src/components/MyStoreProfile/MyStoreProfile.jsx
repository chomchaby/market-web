import React,{useState} from 'react'
import {Link, useNavigate} from "react-router-dom"

import BorderColorIcon from '@mui/icons-material/BorderColor';

import {BLANK_IMAGE} from "../../context/Constant"
import './MyStoreProfile.scss'

const MAX_DESC_LENGTH = 100;

const MyStoreProfile = ({name, desc, image, join_date }) => {
  
  const navigate = useNavigate();

  const [showFullDesc,setShowFullDesc] = useState(false)
  const date = new Date(join_date)
  let descText = '';
  if (desc) {
    if (!showFullDesc) {
        descText = desc.substring(0,MAX_DESC_LENGTH)
      }
      else {
        descText = desc;
      }
  }

    return (
    <div className="myStoreProfile">
        <div className="left">
            <div className="mainImg">
                <img src={image ? image : BLANK_IMAGE} alt="" />
            </div>
        </div>
        <div className="right">
            <div className="wrapper">
                <div className="name">
                    {name}
                    <BorderColorIcon className='editIcon' onClick={()=>navigate('/my-store/edit-store')}></BorderColorIcon>
                </div>
                <div className="joinDate">
                    Joined: {date.toLocaleDateString('default',{month:'long'})} {date.getFullYear()}
                </div>
                <div className="desc">
                    {descText}
                    {desc && desc.length > MAX_DESC_LENGTH ? 
                        <div>
                            <br></br>
                            <Link className="link" onClick={()=>{setShowFullDesc(!showFullDesc)}}>
                                <span className='show'>
                                    {!showFullDesc ? 'show more' : 'show less'}     
                                </span>
                            </Link> 
                        </div>
                        : null
                    }
                </div>
                <button className='button' onClick={()=>navigate('/my-store/add-product')}>Add New Product</button>
                {/* <Link className='link' to='/my-store/add-product'>Add New Product</Link> */}
            </div>
            
        </div>
    </div>
  )
}

export default MyStoreProfile