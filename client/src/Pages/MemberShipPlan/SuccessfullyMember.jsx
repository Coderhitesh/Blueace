import React from 'react';
import { Link } from 'react-router-dom';

function SuccessfullyMember() {
    return (
        <div className="container" style={{ height: "70vh" }}>
            <div className="row justify-content-center align-items-center" style={{ height: "100%" }}>
                <div className="col-md-8 col-lg-6">
                    <div className="card text-center">
                        <div className="card-body">
                            <h2 className="card-title text-success">Congratulations!</h2>
                            <p className="card-text">
                                You have successfully become a free member of Blueace India! 
                                Enjoy exclusive access to our services and benefits.
                            </p>
                            <Link to="/" className="btn btn-primary">
                                Go to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuccessfullyMember;
