import React from 'react';

import '../sass/Navbar.scss';

const Footer = (props) => {
    console.log(props);

    return (
        <div className="footer-wrapper">
            <footer className="footer" role="footer" aria-label="footer">
                <p>pre-alpha version: 0.1</p>
            </footer>
        </div>
    );
};

export default Footer;