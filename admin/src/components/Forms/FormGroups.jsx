import React from 'react';
import PropTypes from 'prop-types';

const FormGroups = ({ onSubmit, Elements }) => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <form className="form theme-form basic-form" onSubmit={onSubmit}>
                                {Elements}
                               
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Adding PropTypes for better type checking (optional)
FormGroups.propTypes = {
    onSubmit: PropTypes.func.isRequired, // onSubmit must be a function
    Elements: PropTypes.node.isRequired, // Elements must be a valid React node
};

export default FormGroups;
