import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../Header/logo.webp'

function Login({ onLoginSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });
    
    const location = useLocation();  // Get the current location
    const navigate = useNavigate();  // Use this for navigation after login

    // Get redirect URL from query parameter or default to home page
    const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const Payload = {
            Email: formData.Email,
            Password: formData.Password
        };

        try {
            const res = await axios.post('https://api.blueaceindia.com/api/v1/Login', Payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            sessionStorage.setItem('token', res.data.token);

            let userData = res.data.user;

            if (typeof userData === 'string' && userData.startsWith('{') && userData.endsWith('}')) {
                try {
                    userData = JSON.parse(userData);
                } catch (parseError) {
                    console.error('Error parsing user data:', parseError);
                    toast.error('Error parsing user data.');
                }
            }

            sessionStorage.setItem('user', JSON.stringify(userData));

            toast.success('Login successful');
            
            // Close the modal on successful login
            // onLoginSuccess();

            // Redirect to the original page or default to home
            navigate(redirectUrl);

        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Login failed. Please check your credentials.';
            toast.error(errorMessage);
            // console.error('Login failed. Please check your credentials.', errorMessage);
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    return (
        <>
            <div className="">
                <div className="modal-dialog login-pop-form" role="document">
                    <div className="modal-content login-content-border py-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F4F7' }} id="loginmodal">
                        <div className="modal-body p-5 col-xl-9 col-lg-9 col-md-12" style={{ backgroundColor: 'white' }}>
                            <div className="text-center mb-4">
                                <img src={logo} className='popup-logo'/>
                                <h4 className="m-0 ft-medium text-uppercase mt-3">Login as User</h4>
                            </div>

                            <form className="submit-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="mb-1">Email or Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control rounded bg-light"
                                        placeholder="Enter your email or phone number*"
                                        name='Email'
                                        value={formData.Email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="mb-1">Password</label>
                                    <input
                                        type="password"
                                        className="form-control rounded bg-light"
                                        placeholder="Password*"
                                        name='Password'
                                        value={formData.Password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="flex-1">
                                            <input
                                                id="remember-me"
                                                className="checkbox-custom"
                                                name="remember-me"
                                                type="checkbox"
                                                defaultChecked
                                            />
                                            <label htmlFor="remember-me" className="checkbox-custom-label">
                                                Remember Me
                                            </label>
                                        </div>
                                        <div className="eltio_k2">
                                            <a href={'/forgot-password'} className="theme-cl">
                                                Forget Password?
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <button
                                        type="submit"
                                        className="btn btn-md full-width theme-bg text-light rounded ft-medium"
                                    >
                                        {loading ? 'Loading...' : 'Sign In'}
                                    </button>
                                </div>

                                <div className="form-group text-center mt-4 mb-0">
                                    <p className="mb-0">Don't Have An Account? <a href={'/sign-up'} className="ft-medium text-success">Register</a></p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
