import React from "react";
import './Logo.css';
import Tilty from 'react-tilty';
import brain from './brain-6182.png'
const Logo = () => {
  return (
    <div className="logo" >
      <Tilty max = "55" className="Tilt br2 shadow-2" style={{width: "125px", height: "125px" }}>
      <div>   <img alt="logo" src={brain}/> </div>
      </Tilty>
    </div>
  );
};
export default Logo;
