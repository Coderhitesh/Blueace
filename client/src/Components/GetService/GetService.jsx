import React from 'react';
import './getservice.css';
import GetServicePopup from '../getservicepopup/GetServicePopup';
// import GetServicePopup from '../getservicepopup/GetServicePopup';


function GetService({ handlePopupActive, isPopUp, handlePopupDeactive }) {
    return (
        <>
            {isPopUp && (
                <GetServicePopup handlePopupDeactive={handlePopupDeactive} />
            )}
            <div className="getservice-container" onClick={handlePopupActive}>
                <div className="getservice-wrapper">
                    <div className="getservice-button">
                        <div className="button-content">
                            <i className="fas fa-concierge-bell"></i>
                            <div className="ripple"></div>
                        </div>
                    </div>
                    <span className="getservice-text">Make Your Order</span>
                </div>
            </div>
        </>
    );
}

export default GetService;