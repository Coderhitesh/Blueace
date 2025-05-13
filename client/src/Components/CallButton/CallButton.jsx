import React, { useState } from 'react';
import './whatsapp.css';

const CallButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const phoneNumber = "9311539090";

    return (
        <div className="call-container">
            <a
                href={`tel:${phoneNumber}`}
                className="call-wrapper"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Call us"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="call-button">
                    <div className="button-content">
                        <i class="fa-solid fa-phone"></i>
                        <div className="ripple"></div>
                    </div>
                </div>
                <span className={`call-tooltip ${isHovered ? 'show' : ''}`}>
                    Call with us
                </span>
            </a>
        </div>
    );
}

export default CallButton
