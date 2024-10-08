import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Login() {
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    },[])
    return (
        <>
            {/* Log In Modal */}
            <div className="bg-dark">
                <div className="modal-dialog login-pop-form" role="document">
                    <div className="modal-content py-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F4F7' }} id="loginmodal">

                        <div className="modal-body p-5 col-xl-6 col-lg-8 col-md-12" style={{ backgroundColor: 'white' }}>
                            <div className="text-center mb-4">
                                <h4 className="m-0 ft-medium">Login Your Account</h4>
                            </div>

                            <form className="submit-form">
                                <div className="form-group">
                                    <label className="mb-1">Email</label>
                                    <input
                                        type="text"
                                        className="form-control rounded bg-light"
                                        placeholder="Email*"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="mb-1">Password</label>
                                    <input
                                        type="password"
                                        className="form-control rounded bg-light"
                                        placeholder="Password*"
                                    />
                                </div>

                                <div className="form-group">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="flex-1">
                                            <input
                                                id="dd"
                                                className="checkbox-custom"
                                                name="dd"
                                                type="checkbox"
                                                defaultChecked
                                            />
                                            <label htmlFor="dd" className="checkbox-custom-label">
                                                Remember Me
                                            </label>
                                        </div>
                                        <div className="eltio_k2">
                                            <a href="#" className="theme-cl">
                                                Lost Your Password?
                                            </a>
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
                                    <p className="mb-0">Don't Have An Account? <Link to={'/sign-up'} className="ft-medium text-success">Sign Up</Link></p>
                                </div>

                                {/* <div className="form-group text-center mb-0">
                                    <p className="extra">Do not have an account</p>
                                    <div className="option-log">
                                        <div className="single-log-opt">
                                            <a
                                                href="javascript:void(0);"
                                                className="log-btn"
                                            >
                                                <img
                                                    src="assets/img/c-1.png"
                                                    className="img-fluid"
                                                    alt=""
                                                />
                                                Login with Google
                                            </a>
                                        </div>
                                        <div className="single-log-opt">
                                            <a
                                                href="javascript:void(0);"
                                                className="log-btn"
                                            >
                                                <img
                                                    src="assets/img/facebook.png"
                                                    className="img-fluid"
                                                    alt=""
                                                />
                                                Login with Facebook
                                            </a>
                                        </div>
                                    </div>
                                </div> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Modal */}
        </>
    )
}

export default Login
