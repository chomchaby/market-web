import React from 'react'
import {useNavigate, Link} from "react-router-dom"

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import "./NavBar.scss"
import useAuth from "../../hooks/useAuth"
import useLogout from '../../hooks/useLogout';

const NavBar = () => {

  const {auth, cartNumber, balance} = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  // const [open,setOpen] = useState(false);

  const signOut = async () => {
    await logout();
    navigate('/login');
  }

  return (
    <div className = "navbar">
      <div className='wrapper'>
        <div className='left'>
            <div className='item'>
              <KeyboardArrowDownIcon />
            </div>
            <div className="item">
              <Link className='link' to='/'>MARKET NAME</Link>
            </div>
        </div>
        <div className='center'>
            <div className="item">
              <SearchIcon/>
            </div>
        </div>
        <div className='right'>

            <div className='icons'>
              <div className="cartIcon" onClick={()=>navigate('/cart')}>
                <ShoppingCartIcon/>
                <span>{cartNumber!==undefined ? cartNumber:0}</span>
              </div>
            </div>

            <div className="item">
              <Link className='link' to='/my-store'>My Store</Link>
            </div>
            <div className="item">
              <Link className='link'>My Purchase</Link>
            </div>

            {balance!==undefined? 
              <Link className='link'>              
                {'THB '+balance}
              </Link>
              : null
            }

            {!auth?.username ?
              <div className="item">
                <Link className='link' to='/register'>Register</Link>
              </div> :  
              
              <Link className='link'>              
                  {/* <div className="icons">
                    <PersonOutlineIcon/>
                  </div> */}
                  {auth.username}
              </Link>
            }

            {!auth?.username? 
              <div className="item">
                <Link className='link' to='/login'>Login</Link>
              </div> : 
              <div className="item">
                <Link className='link' onClick={signOut}>Logout</Link>
              </div>
            }
        </div>
      </div>
      {/* {open && <Cart/>} */}
    </div>
  )
}

export default NavBar