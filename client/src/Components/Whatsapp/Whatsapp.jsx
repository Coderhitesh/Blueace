import React from 'react';
import './whatsapp.css'

function Whatsapp() {
    const phoneNumber = "9311539090";

    return (
        <a
            href={`https://api.whatsapp.com/send?phone=${phoneNumber}`}
            className="whatsapp-button"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
        >
            <i className="fab fa-whatsapp"></i>
        </a>
    );
}

export default Whatsapp;