import React from 'react';

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


export default FormGroups;
