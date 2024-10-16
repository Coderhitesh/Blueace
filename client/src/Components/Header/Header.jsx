import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.webp';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const userDataString = sessionStorage.getItem('user');
  // console.log('datatype',userDataString)
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const role = userData?.Role || null;

  const handleLogOut = () => {
    sessionStorage.clear();
    navigate('/sign-in');
  };

  return (
    <>
      <section className="top-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="header-contact">
                <ul className="nav nav-pills nav-top">
                  <li className="d-none d-sm-block">
                    <a href="tel:+919311550874" target="_blank" className="text-white">
                      <i className="fas fa-mobile"></i> +91 9311550874
                    </a>
                  </li>
                  <li className="d-none d-sm-block mx-3">
                    <a href="mailto:info@blueaceindia.com" target="_blank" className="text-white">
                      <i className="fas fa-envelope"></i> info@blueaceindia.com
                    </a>
                  </li>
                  <li className="d-none d-sm-block mx-1">
                    <a href="mailto:support@blueaceindia.com" target="_blank" className="text-white">
                      <i className="fas fa-envelope"></i> support@blueaceindia.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="topheader-marquee">
                <marquee>
                  Blueace Limited mission has always been to provide top-notch{' '}
                  <span style={{ color: '#47d2fc', fontWeight: '700' }}>Heating</span>,{' '}
                  <span style={{ color: '#47d2fc', fontWeight: '700' }}>ventilation</span>, and{' '}
                  <span style={{ color: '#47d2fc', fontWeight: '700' }}>Air Conditioning</span>{' '}
                  solutions tailored to the unique needs of each customer.
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
              </Link>
              <div className="nav-toggle"></div>
              <div className="mobile_nav">
                <ul>
                  
                  <>
                    {/* Check if the role is Customer */}
                    {role === 'Customer' && (
                      <>
                        <li>
                          <Link to={'/user-dashboard'} className="crs_yuo12 w-auto text-white theme-bg">
                            <span className="embos_45">
                              <i className="fas fa-plus me-2"></i>
                              Dashboard
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link onClick={handleLogOut} className="crs_yuo12 w-auto text-dark gray">
                            <span className="embos_45">
                              <i className="lni lni-power-switch mr-1"></i>Logout
                            </span>
                          </Link>
                        </li>
                      </>
                    )}

                    {/* Check if the role is Vendor */}
                    {role === 'vendor' && (
                      <>
                        <li>
                          <Link to={'/vendor-dashboard'} className="crs_yuo12 w-auto text-white theme-bg">
                            <span className="embos_45">
                              <i className="fas fa-plus me-2"></i>
                              Vendor Dashboard
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link onClick={handleLogOut} className="crs_yuo12 w-auto text-dark gray">
                            <span className="embos_45">
                              <i className="lni lni-power-switch mr-1"></i>Logout
                            </span>
                          </Link>
                        </li>
                      </>
                    )}

                    {/* For non-authenticated users or other roles */}
                    {role !== 'Customer' && role !== 'Vendor' && (
                      <>
                        <li>
                          <Link to={'/sign-in'} className="ft-bold">
                            <i className="fas fa-sign-in-alt me-1 theme-cl"></i>Sign in
                          </Link>
                        </li>
                        <li className="add-listing theme-bg">
                          <Link to={'/vendor-registration'}>
                            <i className="fas fa-plus me-2"></i>Vendor Registration
                          </Link>
                        </li>
                      </>
                    )}
                  </>

                </ul>
              </div>
            </div>
            <div className="nav-menus-wrapper" style={{ transitionProperty: 'none' }}>
              <ul className="nav-menu">
                <li className="active">
                  <Link to={'/'}>Home</Link>
                </li>
                <li>
                  <Link to={'/about-us'}>About Us</Link>
                </li>
                <li>
                  <Link to={''}>Services</Link>
                </li>
                <li>
                  <Link to={''}>Products</Link>
                </li>
                <li>
                  <Link to={''}>Blog</Link>
                </li>
                <li>
                  <Link to={'/contact'}>Contact Us</Link>
                </li>
              </ul>
              <ul className="nav-menu nav-menu-social align-to-right">
                <>
                  {/* Check if the role is Customer */}
                  {role === 'Customer' && (
                    <>
                      <li>
                        <Link to={'/user-dashboard'} className="crs_yuo12 w-auto text-white theme-bg">
                          <span className="embos_45">
                            <i className="fas fa-plus me-2"></i>
                            Dashboard
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link onClick={handleLogOut} className="crs_yuo12 w-auto text-dark gray">
                          <span className="embos_45">
                            <i className="lni lni-power-switch mr-1"></i>Logout
                          </span>
                        </Link>
                      </li>
                    </>
                  )}

                  {/* Check if the role is Vendor */}
                  {role === 'vendor' && (
                    <>
                      <li>
                        <Link to={'/vendor-dashboard'} className="crs_yuo12 w-auto text-white theme-bg">
                          <span className="embos_45">
                            <i className="fas fa-plus me-2"></i>
                            Vendor Dashboard
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link onClick={handleLogOut} className="crs_yuo12 w-auto text-dark gray">
                          <span className="embos_45">
                            <i className="lni lni-power-switch mr-1"></i>Logout
                          </span>
                        </Link>
                      </li>
                    </>
                  )}

                  {/* For non-authenticated users or other roles */}
                  {role !== 'Customer' && role !== 'vendor' && (
                    <>
                      <li>
                        <Link to={'/sign-in'} className="ft-bold">
                          <i className="fas fa-sign-in-alt me-1 theme-cl"></i>Sign in
                        </Link>
                      </li>
                      <li className="add-listing theme-bg">
                        <Link to={'/vendor-registration'}>
                          <i className="fas fa-plus me-2"></i>Vendor Registration
                        </Link>
                      </li>
                    </>
                  )}
                </>

              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;
