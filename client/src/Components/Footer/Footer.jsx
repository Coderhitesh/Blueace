import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.webp'
import axios from 'axios';

function Footer() {
  const [allService,setService] = useState([])
  const fetchService = async() => {
    try {
      const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-service-category')
      const data = res.data.data
      const reverseData = data.reverse();
      setService(reverseData)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    fetchService();
  },[])
  return (
    <>
      {/* ============================ Footer Start ================================== */}
      <footer className="light-footer skin-light-footer style-2">
        <div className="footer-middle">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <div className="footer_widget">
                  <img
                    src={logo}
                    className="img-footer small mb-2"
                    alt="logo" style={{width:"50px"}}
                  />
                  {/* <h1>LOGO</h1> */}
                  <div className="address mt-2">
                     C-126, Office No-1 Gate No – 1, First Floor Naraina Industrial Area, Phase – 01, New Delhi - 110028
                  </div>
                  <div className="address mt-3">
                    <strong>Phone:</strong>+91 9311539090<br/>
                    <br />
                    <strong>Mail:</strong> blueaceindia@gmail.com<br/>
                  </div>
                  <div className="address mt-2">
                    <ul className="list-inline">
                      <li className="list-inline-item">
                        <a href="#" className="theme-cl">
                          <i className="lni lni-facebook-filled"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#" className="theme-cl">
                          <i className="lni lni-twitter-filled"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#" className="theme-cl">
                          <i className="lni lni-youtube"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#" className="theme-cl">
                          <i className="lni lni-instagram-filled"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#" className="theme-cl">
                          <i className="lni lni-linkedin-original"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <div className="footer_widget">
                  <h4 className="widget_title">Main Navigation</h4>
                  <ul className="footer-menu">
                    <li><Link to={'/'}>- Home</Link></li>
                    <li><Link to={'/about-us'}>- About</Link></li>
                    <li><Link to={'/contact'}>- Contact</Link></li>
                    {/* <li><Link to={'/services'}>- Services</Link></li> */}
                    {/* <li><Link to={'/products'}>- Products</Link></li> */}
                    <li><Link to={'/blog'}>- Blog</Link></li>
                    <li><Link to={'/privacy'}>- Privacy</Link></li>
                    <li><Link to={'/term-and-conditions'}>- Terms & Conditions</Link></li>
                    <li><Link to={'/gallery'}>- Gallery</Link></li>
                    {/* <li><Link to={'/'}>Dashboard</Link></li> */}
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <div className="footer_widget">
                  <h4 className="widget_title">Our Products</h4>
                  <ul className="footer-menu">
                    {
                      allService && allService.map((item,index)=>(
                        <li key={index}><Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`}>- {item.name}</Link></li>
                      ))
                    }
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <div className="footer_widget">
                  <h4 className="widget_title">Services</h4>
                  <ul className="footer-menu">
                  {
                      allService && allService.slice(0,7).map((item,index)=>(
                        <li key={index}><Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`}>- {item.name}</Link></li>
                      ))
                    }
                    <li><Link to={`/voltas-central-ac`}>- Voltas Central Ac</Link></li>
                    <li><Link to={`/hvac`}>- HVAC</Link></li>
                  </ul>
                </div>
              </div>

              {/* <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <div className="footer_widget">
                  <h4 className="widget_title">Helpful Topics</h4>
                  <ul className="footer-menu">
                    <li><a href="#">Site Map</a></li>
                    <li><a href="#">Security</a></li>
                    <li><a href="#">Contact</a></li>
                    <li><a href="#">FAQ's Page</a></li>
                    <li><a href="#">Privacy</a></li>
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="footer-bottom br-top">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 col-md-12 text-center">
                <p className="mb-0">
                  © 2022 Blueace. Designed By <a href="https://hoverbusinessservices.com/">Hover Business Services LLP</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* ============================ Footer End ================================== */}
    </>
  );
}

export default Footer;
