import React from 'react';
import Preloader from '../../../assets/images/loader.gif';
import './loader.scss';

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={Preloader} alt="preloader" className="loader" />
    </div>
  );
};

export default Loader;
