import React from 'react';
import { Link } from 'react-router-dom';

function OrderSuccessfully() {
    return (
        <section className="vh-100">
            <div className="container h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-md-8">
                        <div className="card text-center">
                            <div style={{backgroundColor:'#00225F'}} className="card-header text-white">
                                <h3>Service Successfully Booked!</h3>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Thank you for your booking!</h5>
                                <p className="card-text">
                                    Your service has been successfully booked. We appreciate your trust in us and look forward to serving you.
                                </p>
                                <p className="card-text">
                                    {/* You will receive a confirmation email shortly with the details of your booking. */}
                                    You will allowted a Vendor shortly
                                </p>
                                <Link to="/" className="btn btn-primary">
                                    Back to Home
                                </Link>
                            </div>
                            <div className="card-footer text-muted">
                                If you have any questions, please contact our support team.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderSuccessfully
