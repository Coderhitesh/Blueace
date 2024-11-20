import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import MetaTag from '../../Components/Meta/MetaTag';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    mobile: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // You may switch to JSON payload if not uploading files
      const res = await axios.post('https://api.blueaceindia.com/api/v1/create-contact', formData, {
        headers: {
          'Content-Type': 'application/json' // Change if using FormData
        },
      });
      toast.success('Form Submitted Successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Internal server error in sending');
    }
  };

  return (
    <>
    <MetaTag title={'Blueace india Contact'} />
      {/* ======================= Top Breadcrumbs ======================== */}
      <div style={{ backgroundColor: '#00225F' }} className="py-3">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to={'/'} style={{ color: 'white' }}>Home</Link></li>
                  <li className="breadcrumb-item" style={{ color: 'white' }}>/</li>
                  <li className="breadcrumb-item active" style={{ color: 'white' }} aria-current="page">Contact Us</li>
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
              <form onSubmit={handleSubmit} className="row submit-form py-4 px-3 rounded bg-white mb-4">
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Your Name *</label>
                    <input type="text" name='name' onChange={handleChange} value={formData.name} className="form-control" placeholder="Your Name" />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Your Email *</label>
                    <input type="email" name='email' onChange={handleChange} value={formData.email} className="form-control" placeholder="Your Email" />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Mobile</label>
                    <input type="tel" name='mobile' onChange={handleChange} value={formData.mobile} className="form-control" placeholder="Phone No." />
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Subject</label>
                    <input type="text" name='subject' onChange={handleChange} value={formData.subject} className="form-control" placeholder="Type Your Subject" />
                  </div>
                </div>

                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="form-group">
                    <label className="small text-dark ft-medium">Message</label>
                    <textarea name='message' onChange={handleChange} value={formData.message} className="form-control ht-80" placeholder="Your Message..."></textarea>
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
