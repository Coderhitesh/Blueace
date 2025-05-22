import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.webp'
import axios from 'axios';
import './footer.css'

function Footer() {
  const [allService, setService] = useState([])
  const [activeChatBtn, setActiveChatBtn] = useState(false)

  const fetchService = async () => {
    try {
      const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-service-category')
      const data = res.data.data
      const reverseData = data.reverse();
      setService(reverseData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchService();
  }, [])

  const handleActiveChat = () => {
    setActiveChatBtn(!activeChatBtn)
  }

  // Responsive chatbot dimensions
  const getChatbotStyles = () => {
    if (!activeChatBtn) {
      return { display: 'none' }; // Hide completely when inactive
    }

    const isMobile = window.innerWidth <= 768;

    return {
      position: 'fixed',
      bottom: '80px',
      right: '10px',
      zIndex: 9999,
      width: isMobile ? '95%' : '400px',
      maxWidth: '400px',
      height: isMobile ? '70vh' : '600px',
      maxHeight: '600px',
      border: 'none',


      transition: 'all 0.3s ease-in-out',
    };
  };

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
                    alt="logo" style={{ width: "50px" }}
                  />
                  {/* <h1>LOGO</h1> */}
                  <div className="address mt-2">
                    C-126, Office No-1 Gate No - 1, First Floor Naraina Industrial Area, Phase – 01, New Delhi - 110028
                  </div>
                  <div className="address mt-3">
                    <strong>Phone:</strong>+91 9311539090<br />
                    <br />
                    <strong>Phone:</strong>+91 9811550874<br />
                    <br />
                    <strong>Mail:</strong> info@blueaceindia.com<br />
                  </div>
                  <div className="address mt-2">
                    <ul className="list-inline">
                      <li className="list-inline-item socailLinks">
                        <a href="https://www.facebook.com/blueacelimited/" target='_blank' className="theme-cl">
                          <i className="lni lni-facebook-filled"></i>
                        </a>
                      </li>
                      <li className="list-inline-item socailLinks">
                        <a href="https://www.instagram.com/blueacelimited/" target='_blank' className="theme-cl">
                          <i className="lni lni-instagram-filled"></i>
                        </a>
                      </li>
                      <li className="list-inline-item socailLinks">
                        <a href="https://www.linkedin.com/company/blueace-ltd " target='_blank' className="theme-cl">
                          <i className="lni lni-linkedin-original"></i>
                        </a>
                      </li>
                      <li className="list-inline-item socailLinks">
                        <a href="https://www.youtube.com/@Blueaceltd " target='_blank' className="theme-cl">
                          <i className="fa-brands fa-youtube"></i>
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
                    <li><Link to={'/blog'}>- Blog</Link></li>
                    <li><Link to={'/privacy'}>- Privacy</Link></li>
                    <li><Link to={'/term-and-conditions'}>- Terms & Conditions</Link></li>
                    <li><Link to={'/gallery'}>- Gallery</Link></li>
                    <li><Link to={'/career'}>- Career</Link></li>
                    <li>
                      <a target="_blank" href="https://s3.eu-north-1.amazonaws.com/bucket.hbs.dev/broucher_11zon.pdf">- Download Brochure</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <div className="footer_widget">
                  <h4 className="widget_title">Our Products</h4>
                  <ul className="footer-menu">
                    {
                      allService && allService.map((item, index) => (
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
                      allService && allService.slice(0, 7).map((item, index) => (
                        <li key={index}><Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`}>- {item.name}</Link></li>
                      ))
                    }
                    <li><Link to={`/redefining-cold-storage`}>- Redefining Cold Storage</Link></li>
                    <li><Link to={`/trusted-cold-storage-partner`}>- Trusted Cold Storage Partner</Link></li>
                    <li><Link to={`/cold-storage-construction-experts`}>- Cold Storage Construction Experts</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom br-top">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 col-md-12 text-center">
                <p className="mb-0">
                  © 2025 Blueace. Designed By <a href="https://hoverbusinessservices.com/">Hover Business Services LLP</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Toggle Button */}
      <div className="chatbot-toggle-container">
        <button
          className={`chatbot-toggle-btn ${activeChatBtn ? 'active' : ''}`}
          onClick={handleActiveChat}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '35px',
            zIndex: 10000,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {activeChatBtn ? '✕' : '💬'}
        </button>
      </div>

      {/* Chatbot Container - Only renders when active */}
      {activeChatBtn && (
        <div className='main-chat-container'>
          <iframe
            src="https://embeded.chat.adsdigitalmedia.com?metacode=chatbot-QUP9P-CCQS2"
            style={getChatbotStyles()}
            title="Chatbot Verification"
            allow="microphone; camera"
          />
        </div>
      )}

      {/* Add responsive styles */}
      <style jsx>{`
        .chatbot-toggle-btn:hover {
          transform: scale(1.1);
          background-color: #0056b3;
        }
        
        .chatbot-toggle-btn.active {
          background-color: #dc3545;
        }
        
        .chatbot-toggle-btn.active:hover {
          background-color: #c82333;
        }
        
        @media (max-width: 768px) {
          .chatbot-toggle-btn {
            width: 50px !important;
            height: 50px !important;
            font-size: 20px !important;
            bottom: 15px !important;
            right: 15px !important;
          }
        }
        
        /* Prevent body scroll when chatbot is active on mobile */
        @media (max-width: 768px) {
          ${activeChatBtn ? 'body { overflow: hidden; }' : ''}
        }
      `}</style>

      {/* ============================ Footer End ================================== */}
    </>
  );
}

export default Footer;