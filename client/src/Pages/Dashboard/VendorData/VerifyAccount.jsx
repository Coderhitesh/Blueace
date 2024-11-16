import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

function VerifyAccount({ userData }) {
    const [getOtp, setGetOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    const userId = userData?._id;

    const [sendOtpFormData, setSendOtpFormData] = useState({
        Email: '',
        VerifyOTP: '',
    });

    useEffect(() => {
        if (userData?.Email) {
            setSendOtpFormData((prev) => ({
                ...prev,
                Email: userData.Email,
            }));
        }
    }, [userData]);
    

    const handleChange = (e) => {
        setSendOtpFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handle Get OTP Submit
    const handleGetOtpSubmit = async (e) => {
        e.preventDefault();
        if (!sendOtpFormData.Email) {
            toast.error('Email is required ');
            return;
        }
        setLoading(true); // Start loading
        try {
            const payload = {
                Email: sendOtpFormData.Email,
            };
    
            // console.log('Sending OTP request with email:', sendOtpFormData.Email); // Debugging log
    
            await axios.put('https://www.api.blueaceindia.com/api/v1/verify-account-otp-send', payload);
            toast.success('OTP sent successfully!');
            setGetOtp(true);
        } catch (error) {
            console.log('Internal server error', error);
            toast.error(error?.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false); // Stop loading
        }
    };
    

    // Handle Submit OTP
    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            const payload = {
                Email: sendOtpFormData.Email,
                VerifyOTP: sendOtpFormData.VerifyOTP,
            };
            await axios.post('https://www.api.blueaceindia.com/api/v1/verify-account', payload);
            toast.success('Account Verified!');
            window.location.href = '/vendor-dashboard';
        } catch (error) {
            console.log('Internal server error', error);
            toast.error(error?.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Handle Resend OTP
    const handleResendOtp = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            const payload = {
                Email: sendOtpFormData.Email,
            };
            await axios.post('https://www.api.blueaceindia.com/api/v1/resend-verify-vendor-otp', payload);
            toast.success('OTP resent successfully!');
        } catch (error) {
            console.log('Internal server error', error);
            toast.error(error?.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <>
            <div className="goodup-dashboard-content">
                <div className="dashboard-tlbar d-block mb-5">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12">
                            <h1 className="ft-medium">Verify Your Account</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item text-muted">
                                        <a href="#">Home</a>
                                    </li>
                                    <li className="breadcrumb-item text-muted">
                                        <a href="/vendor-dashboard">Dashboard</a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a href="#" className="theme-cl">
                                            Verify your Account
                                        </a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="dashboard-widg-bar d-block">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12">
                            <div className="_dashboard_content bg-white rounded mb-4">
                                <div className="_dashboard_content_header br-bottom py-3 px-3">
                                    <h4 className="mb-0 ft-medium fs-md">
                                        <i className="fa fa-lock me-2 theme-cl fs-sm"></i>Verify Account
                                    </h4>
                                </div>

                                <div className="_dashboard_content_body py-3 px-3">
                                    <form className="row submit-form" onSubmit={getOtp ? handleSubmitOtp : handleGetOtpSubmit}>
                                        <div className="col-xl-8 col-lg-9 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="text"
                                                    name="Email"
                                                    onChange={handleChange}
                                                    value={sendOtpFormData.Email}
                                                    className="form-control rounded"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        </div>

                                        {getOtp && (
                                            <div className="col-xl-8 col-lg-9 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <label>OTP</label>
                                                    <input
                                                        type="text"
                                                        name="VerifyOTP"
                                                        onChange={handleChange}
                                                        value={sendOtpFormData.VerifyOTP}
                                                        className="form-control rounded"
                                                        placeholder="Enter OTP"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="col-xl-12 col-lg-12">
                                            <div className="form-group">
                                                {getOtp ? (
                                                    <>
                                                        <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="btn btn-md ft-medium text-light rounded theme-bg"
                                                        >
                                                            {loading ? 'Submitting...' : 'Submit OTP'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={loading}
                                                            onClick={handleResendOtp}
                                                            className="btn btn-md ft-medium text-light rounded theme-bg ms-2"
                                                        >
                                                            {loading ? 'Resending...' : 'Resend OTP'}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="btn btn-md ft-medium text-light rounded theme-bg"
                                                    >
                                                        {loading ? 'Sending OTP...' : 'Get OTP'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VerifyAccount;
