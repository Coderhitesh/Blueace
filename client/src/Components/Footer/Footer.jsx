import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import logo from './logo.webp';
import axios from 'axios';
import './footer.css';
import botAnimation from './bot.json';


function Footer() {
  const [allService, setService] = useState([]);
  const [activeChatBtn, setActiveChatBtn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fetchService = async () => {
    try {
      const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-service-category');
      const data = res.data.data;
      const reverseData = data.reverse();
      setService(reverseData);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle window resize for responsive design
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    fetchService();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleActiveChat = () => {
    setActiveChatBtn(!activeChatBtn);
  };

  // Enhanced responsive chatbot styles
  const getChatbotStyles = () => {
    if (!activeChatBtn) {
      return { display: 'none' };
    }

    const baseStyles = {
      position: 'fixed',
      zIndex: 9999,
      border: 'none',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#ffffff',
    };

    if (isMobile) {
      return {
        ...baseStyles,
        bottom: '90px',
        left: '10px',
        right: '10px',
        width: 'calc(100vw - 20px)',
        height: '70vh',
        maxHeight: '500px',
        minHeight: '400px',
      };
    } else {
      return {
        ...baseStyles,
        bottom: '100px',
        right: '20px',
        width: '400px',
        height: '600px',
        maxWidth: '90vw',
      };
    }
  };

  // Chatbot toggle button styles
  const getToggleButtonStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 10000,
      border: 'none',
      borderRadius: '50%',

      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: activeChatBtn ? 'transparent' : 'transparent',
      boxShadow: activeChatBtn
        ? ''
        : '',
      transform: activeChatBtn ? 'rotate(180deg)' : 'rotate(0deg)',
    };

    if (isMobile) {
      return {
        ...baseStyles,
        bottom: '20px',
        right: '20px',
        width: '56px',
        height: '56px',
      };
    } else {
      return {
        ...baseStyles,
        bottom: '30px',
        right: '30px',
        width: '100px',
        height: '100px',
      };
    }
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
                    alt="logo"
                    style={{ width: "50px" }}
                  />
                  <div className="address mt-2">
                    C-126, Office No-1 Gate No - 1, First Floor Naraina Industrial Area, Phase – 01, New Delhi - 110028
                  </div>
                  <div className="address mt-3">
                    <strong>Phone:</strong> +91 9311539090<br />
                    <br />
                    <strong>Phone:</strong> +91 9811550874<br />
                    <br />
                    <strong>Mail:</strong> info@blueaceindia.com<br />
                  </div>
                  <div className="address mt-2">
                    <ul className="list-inline">
                      <li className="list-inline-item socailLinks">
                        <a href="https://www.facebook.com/blueacelimited/" target='_blank' rel="noopener noreferrer" className="theme-cl">
                          <i className="lni lni-facebook-filled"></i>
                        </a>
                      </li>
                      <li className="list-inline-item socailLinks">
                        <a href="https://www.instagram.com/blueacelimited/" target='_blank' rel="noopener noreferrer" className="theme-cl">
                          <i className="lni lni-instagram-filled"></i>
                        </a>
                      </li>
                      <li className="list-inline-item socailLinks">
                        <a href="https://www.linkedin.com/company/blueace-ltd" target='_blank' rel="noopener noreferrer" className="theme-cl">
                          <i className="lni lni-linkedin-original"></i>
                        </a>
                      </li>
                      <li className="list-inline-item socailLinks">
                        <a href="https://www.youtube.com/@Blueaceltd" target='_blank' rel="noopener noreferrer" className="theme-cl">
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
                      <a target="_blank" rel="noopener noreferrer" href="https://s3.eu-north-1.amazonaws.com/bucket.hbs.dev/broucher_11zon.pdf">- Download Brochure</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <div className="footer_widget">
                  <h4 className="widget_title">Our Products</h4>
                  <ul className="footer-menu">
                    {allService && allService.map((item, index) => (
                      <li key={index}>
                        <Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`}>
                          - {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <div className="footer_widget">
                  <h4 className="widget_title">Services</h4>
                  <ul className="footer-menu">
                    {allService && allService.slice(0, 7).map((item, index) => (
                      <li key={index}>
                        <Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`}>
                          - {item.name}
                        </Link>
                      </li>
                    ))}
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

      {/* Enhanced Chatbot Toggle Button with Lottie Animation */}
      <div className="chatbot-toggle-container">
        <button
          className={`chatbot-toggle-btn ${activeChatBtn ? 'active' : ''}`}
          onClick={handleActiveChat}
          style={getToggleButtonStyles()}
          aria-label={activeChatBtn ? 'Close chatbot' : 'Open chatbot'}
        >
          {activeChatBtn ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'black' }}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <div style={{ width: isMobile ? '100px' : '100px', height: isMobile ? '100px' : '100px' }}>
              <Lottie
                animationData={botAnimation}
                loop={true}
                autoplay={true}
                style={{
                  width: 100,
                  height: 100,

                }}
              />
            </div>
          )}
        </button>
      </div>

      {/* Enhanced Responsive Chatbot Container */}
      {activeChatBtn && (
        <div className='main-chat-container'>
          {/* Backdrop for mobile */}
          {isMobile && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9998,
                transition: 'opacity 0.3s ease',
              }}
              onClick={handleActiveChat}
            />
          )}

          {/* Chat Header for Mobile */}
          {isMobile && (
            <div
              style={{
                position: 'fixed',
                bottom: '70vh',
                left: '10px',
                right: '10px',
                height: '50px',
                backgroundColor: '#007bff',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                zIndex: 10000,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              <span>Customer Support</span>
              <button
                onClick={handleActiveChat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          )}

          <iframe
            src="https://embeded.chat.adsdigitalmedia.com?metacode=chatbot-QUP9P-CCQS2"
            style={getChatbotStyles()}
            title="Chatbot Support"
            allow="microphone; camera"
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
          />
        </div>
      )}

      {/* Add some custom CSS for smooth animations */}
      <style jsx>{`
        .chatbot-toggle-btn:hover {
          transform: scale(1.1) ${activeChatBtn ? 'rotate(180deg)' : 'rotate(0deg)'} !important;
        }
        
        .chatbot-toggle-btn:active {
          transform: scale(0.95) ${activeChatBtn ? 'rotate(180deg)' : 'rotate(0deg)'} !important;
        }

        @media (max-width: 768px) {
          .main-chat-container iframe {
            border-top-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .main-chat-container {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default Footer;