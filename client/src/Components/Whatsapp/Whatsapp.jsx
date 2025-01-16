import React, { useState } from 'react';
import './whatsapp.css';

function Whatsapp() {
    const [isHovered, setIsHovered] = useState(false);
    const phoneNumber = "9311539090";

    return (
        <div className="whatsapp-container">
            <a
                href={`https://api.whatsapp.com/send?phone=${phoneNumber}`}
                className="whatsapp-wrapper"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="whatsapp-button">
                    <div className="button-content">
                        <i className="fab fa-whatsapp"></i>
                        <div className="ripple"></div>
                    </div>
                </div>
                <span className={`whatsapp-tooltip ${isHovered ? 'show' : ''}`}>
                    Chat with us on WhatsApp
                </span>
            </a>
        </div>
    );
}

export default Whatsapp;