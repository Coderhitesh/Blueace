import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.webp';
import './Header.css'

function Header() {
  return (
    <>
      <section className='top-header'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='header-contact'>
                <ul class="nav nav-pills nav-top">
                  <li class="d-none d-sm-block">
                    <a href="tel:+919311550874" target="_blank" className='text-white'><i class="fas fa-mobile"></i> +91 9311550874</a>
                  </li>
                  <li class="d-none d-sm-block mx-3">
                    <a href="mailto:info@blueaceindia.com" target="_blank" className='text-white'><i class="fas fa-envelope"></i> info@blueaceindia.com
                    </a>
                  </li>
                  <li class="d-none d-sm-block mx-1">
                    <a href="mailto:support@blueaceindia.com" target="_blank" className='text-white'><i class="fas fa-envelope"></i> support@blueaceindia.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='topheader-marquee'>
                <marquee>
                Blueace Limited mission has always been to provide top-notch <span style={{color:"#47d2fc", fontWeight:"700"}}>Heating</span>, <span style={{color:"#47d2fc", fontWeight:"700"}}>ventilation</span>, and <span style={{color:"#47d2fc", fontWeight:"700"}}>Air Conditioning</span> solutions tailored to the unique needs of each customer.

                </marquee>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="header header-light dark-text">
        <div className="container">
          <nav id="navigation" className="navigation navigation-landscape">
            <div className="nav-header">
              <Link className="nav-brand" to={'/'}>
                <img src={logo} className="logo header-logo" alt="" />
                {/* <h2>LOGO</h2> */}
              </Link>
              <div className="nav-toggle"></div>
              <div className="mobile_nav">
                <ul>
                  <li>
                    <Link
                      to={"/sign-in"}
                      // data-bs-toggle="modal"
                      // data-bs-target="#login"
                      className="theme-cl fs-lg"
                    >
                      {/* <i className="lni lni-user"></i> */}
                      <i className="fas fa-sign-in-alt me-1 theme-cl"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={'/dashboard'}
                      className="crs_yuo12 w-auto text-white theme-bg"
                    >
                      <span className="embos_45">
                        <i className="fas fa-plus me-2"></i>Add Listing
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="nav-menus-wrapper"
              style={{ transitionProperty: 'none' }}
            >
              <ul className="nav-menu">
                <li className="active">
                  <Link to={'/'}>Home</Link>
                </li>
                <li>
                  <Link to={'/about-us'}>About Us</Link>
                </li>

                <li>
                  <Link to={""}>Services</Link>
                </li>
                <li>
                  <Link to={""}>Products</Link>
                </li>
                <li>
                  <Link to={''}>Blog</Link>
                </li>

                <li>
                  <Link to={'/contact'}>Contact Us</Link>
                </li>
              </ul>

              <ul className="nav-menu nav-menu-social align-to-right">
                <li>
                  <Link
                    to={'/sign-in'}
                    // data-bs-toggle="modal"
                    // data-bs-target="#login"
                    className="ft-bold"
                  >
                    <i className="fas fa-sign-in-alt me-1 theme-cl"></i>Sign in
                  </Link>
                </li>
                {/* <li>
                  <a
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#login"
                    className="ft-bold"
                  >
                    <i className="fas fa-sign-in-alt me-1 theme-cl"></i>Sign In
                  </a>
                </li> */}
                <li className="add-listing theme-bg">
                  <Link to={'/vendor-registration'}>
                    <i className="fas fa-plus me-2"></i>Vendor Registration
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      {/* <!-- End Navigation -->
            <!-- ============================================================== --> */}

      {/* Log In Modal */}
      {/* <div
        className="modal fade"
        id="login"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="loginmodal"
        aria-hidden="true"
      >
        <div className="modal-dialog login-pop-form" role="document">
          <div className="modal-content" id="loginmodal">
            <div className="modal-headers">
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span className="ti-close"></span>
              </button>
            </div>

            <div className="modal-body p-5">
              <div className="text-center mb-4">
                <h4 className="m-0 ft-medium">Login Your Account</h4>
              </div>

              <form className="submit-form">
                <div className="form-group">
                  <label className="mb-1">User Name</label>
                  <input
                    type="text"
                    className="form-control rounded bg-light"
                    placeholder="Username*"
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

                <div className="form-group text-center mb-0">
                  <p className="extra">Or login with</p>
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}
      {/* End Modal */}
    </>
  );
}

export default Header;
