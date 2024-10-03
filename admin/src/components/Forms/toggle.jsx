import React from 'react';
import './toggle.css'
const Toggle = ({ isActive, onToggle }) => {
    return (
        <div className="toggle mt-2">
            <label className="switch">
                <input type="checkbox" checked={isActive} onChange={onToggle} />
                <span className="slider round"></span>
            </label>
            <br />
            
        </div>
    );
};

export default Toggle;
