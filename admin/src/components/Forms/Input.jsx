import React from 'react';

const Input = ({ value, name, onChange, placeholder, type, className, required }) => {
    return (
        <div className='w-100'>
            <input
                className={`${className} form-control`}
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default Input;
