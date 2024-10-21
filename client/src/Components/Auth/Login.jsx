import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });

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
        setLoading(true)
        // Prepare Payload
        const Payload = {
            Email: formData.Email,
            Password: formData.Password
        };

        try {
            const res = await axios.post('https://api.blueace.co.in/api/v1/Login', Payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(res.data)

            // Save token and other data (if necessary)
            sessionStorage.setItem('token', res.data.token);
            // sessionStorage.setItem('user', JSON.stringify(res.data.user));

            // Retrieve the user data
        let userData = res.data.user;

        // Check if the userData is a string and appears to be a JSON string
        if (typeof userData === 'string' && userData.startsWith('{') && userData.endsWith('}')) {
            try {
                // Parse the stringified JSON
                userData = JSON.parse(userData);
            } catch (parseError) {
                console.error('Error parsing user data:', parseError);
                toast.error('Error parsing user data.');
            }
        }

        // Store the user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(userData));

            // Redirect to home or another page
            toast.success('Login successful');
            window.location.href = '/';

        } catch (error) {
            const errorMessage = error.response.data.msg;
            toast.error(`Error logging in: ${errorMessage}`);
            console.error('Login failed. Please check your credentials.',error.response.data.msg);
        } finally {
            setLoading(false)
        }
    };

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    return (
        <>
            <Toaster />
            {/* Log In Modal */}
            <div className="bg-dark">
                <div className="modal-dialog login-pop-form" role="document">
                    <div className="modal-content py-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F4F7' }} id="loginmodal">
                        <div className="modal-body p-5 col-xl-6 col-lg-8 col-md-12" style={{ backgroundColor: 'white' }}>
                            <div className="text-center mb-4">
                                <h4 className="m-0 ft-medium">Login Your Account</h4>
                            </div>

                            <form className="submit-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="mb-1">Email</label>
                                    <input
                                        type="text"
                                        className="form-control rounded bg-light"
                                        placeholder="Email*"
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
                                            <Link to={'/forgot-password'} className="theme-cl">
                                                Lost Your Password?
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <button
                                        type="submit"
                                        className="btn btn-md full-width theme-bg text-light rounded ft-medium"
                                    >
                                        Sign In
                                    </button>
                                </div>

                                <div className="form-group text-center mt-4 mb-0">
                                    <p className="mb-0">Don't Have An Account? <Link to={'/sign-up'} className="ft-medium text-success">{`${loading ? 'Loading...' : 'Sign Up'}`}</Link></p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Modal */}
        </>
    );
}

export default Login;
