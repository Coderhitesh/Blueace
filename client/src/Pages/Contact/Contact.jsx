import React from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  return (
    <>
      {/* ======================= Top Breadcrumbs ======================== */}
      <div className="bg-dark py-3">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to={'/'} className="text-light">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    {/* <a href="#" className="text-light">Pages</a> */}
                  </li>
                  <li className="breadcrumb-item active theme-cl" aria-current="page">
                    Contact Us
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* ======================= Top Breadcrumbs ======================== */}
      
      {/* ======================= Contact Page Detail ======================== */}
      <section className="gray">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="sec_title position-relative text-center">
                <h2 className="off_title">Contact Us</h2>
              </div>
            </div>
          </div>
          
          <div className="row align-items-start justify-content-center">
            <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
              <form className="row submit-form py-4 px-3 rounded bg-white mb-4">
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Your Name *</label>
                    <input type="text" className="form-control" placeholder="Your Name" />
                  </div>
                </div>
                
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Your Email *</label>
                    <input type="email" className="form-control" placeholder="Your Email" />
                  </div>
                </div>
                
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Mobile</label>
                    <input type="tel" className="form-control" placeholder="+91 256 548 7542" />
                  </div>
                </div>
                
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Subject</label>
                    <input type="text" className="form-control" placeholder="Type Your Subject" />
                  </div>
                </div>
                
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Message</label>
                    <textarea className="form-control ht-80" placeholder="Your Message..."></textarea>
                  </div>
                </div>
                
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="form-group">
                    <button type="submit" className="btn theme-bg text-light">Send Message</button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
              <div className="row">
                <div className="col-xl-4 col-lg-4 col-md-12">
                  <div className="bg-white rounded p-3 mb-2">
                    <h4 className="ft-medium mb-3 theme-cl">Address info:</h4>
                    <p>Vijay Vihar, Rithala<br />New Delhi</p>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-12">
                  <div className="bg-white rounded p-3 mb-2">
                    <h4 className="ft-medium mb-3 theme-cl">Call Us:</h4>
                    <h6 className="ft-medium mb-1">Customer Care:</h6>
                    <p className="mb-2">+91 458 753 6924</p>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-12">
                  <div className="bg-white rounded p-3 mb-2">
                    <h4 className="ft-medium mb-3 theme-cl">Drop A Mail:</h4>
                    <p>Drop mail we will contact you within 24 hours.</p>
                    <p className="lh-1 text-dark">info@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======================= Contact Page End ======================== */}
    </>
  );
}

export default Contact;
