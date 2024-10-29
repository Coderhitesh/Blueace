import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.webp';
import './Header.css';
import toast from 'react-hot-toast';
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  const userDataString = sessionStorage.getItem('user');
  // console.log('datatype',userDataString)
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const role = userData?.Role || null;
  const token = sessionStorage.getItem('token')
  const [allMarquee,serAllMarquee] = useState([])

  // const handleLogOut = () => {
  //   sessionStorage.clear();
  //   navigate('/sign-in');
  // };

  const handleLogOut = async () => {
    try {
      const res = await axios.get('https://api.blueace.co.in/api/v1/Logout', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      sessionStorage.clear();
      toast.success('Logout successfully');
      navigate('/sign-in');
    } catch (error) {
      console.log('Internal server in logout account', error);
      toast.error(error?.response?.data?.msg || 'Internal server error during logout');
    }
  };

  const handleFetchMarquee = async () => {
    try {
      const res = await axios.get('https://api.blueace.co.in/api/v1/get-all-marquee')
      serAllMarquee(res.data.data)
    } catch (error) {
      console.log("Internal server error in fetching marquee",error)
      toast.error('Internal server error in fetching marquee')
    }
  }

  const handleVendorLogOut = async () => {
    try {
      const res = await axios.get('https://api.blueace.co.in/api/v1/vendor-logout', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      sessionStorage.clear();
      toast.success('Logout successfully');
      navigate('/sign-in');
    } catch (error) {
      console.log('Internal server in logout account', error);
      toast.error(error?.response?.data?.msg || 'Internal server error during logout');
    }
  };

  useEffect(()=>{
    handleFetchMarquee();
  },[])

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
    {
        allMarquee && allMarquee.slice(0, 1).map((item, index) => (
            <marquee
                key={index}
                onMouseEnter={(e) => e.target.stop()} // Pause the marquee on hover
                onMouseLeave={(e) => e.target.start()} // Resume the marquee when not hovered
            >
                {item.text}
            </marquee>
        ))
    }
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
                        <li className='activeInDes'>
                          <Link to={'/user-dashboard'} className="crs_yuo12 w-auto text-white theme-bg">
                            <span className="embos_45">
                              <i className="fas fa-plus me-2"></i>
                              Dashboard
                            </span>
                          </Link>
                        </li>
                        <li className='activeInDes'>
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
                        <li className='activeInDes'>
                          <Link to={'/vendor-dashboard'} className="crs_yuo12 w-auto text-white theme-bg">
                            <span className="embos_45">
                              <i className="fas fa-plus me-2"></i>
                              Vendor Dashboard
                            </span>
                          </Link>
                        </li>
                        <li className='activeInDes'>
                          <Link onClick={handleVendorLogOut} className="crs_yuo12 w-auto text-dark gray">
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
                        <li className='activeInDes'>
                          <Link to={'/sign-in'} className="ft-bold">
                            <i className="fas fa-sign-in-alt me-1 theme-cl"></i>Sign in
                          </Link>
                        </li>
                        <li className="add-listing theme-bg activeInDes">
                          <Link style={{ color: 'white' }} to={'/vendor-registration'}>
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
                  <Link to={'/services'}>Services</Link>
                </li>
                <li>
                  <Link to={'/products'}>Products</Link>
                </li>
                <li>
                  <Link to={'/blog'}>Blog</Link>
                </li>
                <li>
                  <Link to={'/contact'}>Contact Us</Link>
                </li>
                {/* Check if the role is Customer */}
                {role === 'Customer' && (
                  <>
                    <li className='activeInMob'>
                      <Link to={'/user-dashboard'} className="crs_yuo12 w-auto text-white theme-bg">
                        <span className="embos_45">
                          <i className="fas fa-plus me-2"></i>
                          Dashboard
                        </span>
                      </Link>
                    </li>
                    <li className='activeInMob'>
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
                    <li className='activeInMob'>
                      <Link to={'/vendor-dashboard'} className="crs_yuo12 w-auto text-white theme-bg">
                        <span className="embos_45">
                          <i className="fas fa-plus me-2"></i>
                          Vendor Dashboard
                        </span>
                      </Link>
                    </li>
                    <li className='activeInMob'>
                      <Link onClick={handleVendorLogOut} className="crs_yuo12 w-auto text-dark gray">
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
                    <li className='activeInMob'>
                      <Link to={'/sign-in'} className="ft-bold">
                        <i className="fas fa-sign-in-alt me-1 theme-cl"></i>Sign in
                      </Link>
                    </li>
                    <li className="add-listing theme-bg activeInMob">
                      <Link style={{ color: 'white' }} to={'/vendor-registration'}>
                        <i className="fas fa-plus me-2"></i>Vendor Registration
                      </Link>
                    </li>
                  </>
                )}
                {/* {role === 'Customer' && (
                  <>
                    <li>
                      <Link to={'/contact'}>Contact Us</Link>
                    </li>
                    <li>
                      <Link to={'/contact'}>Contact Us</Link>
                    </li>
                  </>
                )} */}
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
                        <Link onClick={handleVendorLogOut} className="crs_yuo12 w-auto text-dark gray">
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
                        <Link style={{ color: 'white' }} to={'/vendor-registration'}>
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
