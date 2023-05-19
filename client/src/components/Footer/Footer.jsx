import React from 'react'
import './Footer.scss';
const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
        <div className="item">
          <h1>Categories</h1>
          <span>Clothes</span>
          <span>Sports</span>
          <span>Gadgets</span>
        </div>
        <div className="item">
          <h1>About</h1>
          <span>This website was made with the React.js framework. 
            The React.js framework is an open-source JavaScript framework and library developed by Facebook. 
            It's used for building interactive uesr interfaces and web applications quickly and efficiently 
            with significantly less code than you would with vanilla JavaScript</span>
        </div>
        <div className="item">
          <h1>Contact</h1>
          <span>Email</span>
          <span>Tel</span>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <span className="logo">MyMarket</span>
          <span className="copyright">Copy right 2023. All Rights Reserved</span>
        </div>
        <div className="right">
          {/* <img src="" alt="" /> */}
        </div>
      </div>
    </div>
  )
}

export default Footer