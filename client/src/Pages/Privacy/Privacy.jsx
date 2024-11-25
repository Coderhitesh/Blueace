import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Privacy() {
	useEffect(()=>{
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	},[])
  return (
    <>
      {/* ======================= Top Breadcrumbs ======================== */}
      <div style={{backgroundColor:'#00225F'}} className="py-3">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to={'/'} style={{color:'white'}}>Home</Link></li>
                  <li className="breadcrumb-item" style={{color:'white'}}>/</li>
                  <li className="breadcrumb-item active" style={{color:'white'}} aria-current="page">Privacy & Policy</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* ======================= Top Breadcrumbs End ======================== */}

      {/* ======================= Privacy Details ======================== */}
      <section className="middle">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-11 col-lg-12 col-md-6 col-sm-12">
              <div className="abt_caption">
                <h2 className="ft-medium mb-4">Privacy Policy</h2>
                <p className="mb-4">At BlueAce Limited, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share your information when you interact with our services, including payment gateway transactions.</p>

                <h4 className="mb-3">1. Information We Collect</h4>
                <p className="mb-4">We collect information that you provide to us when you contact us or use our services. This may include personal details such as your name, email address, phone number, and payment information. Additionally, we may collect technical data like your IP address, device information, and browsing history when you visit our website.</p>

                <h4 className="mb-3">2. Use of Information</h4>
                <p className="mb-4">We use the information we collect to provide and improve our services, process payments, communicate with you, and ensure the security of our website. We may use your data to respond to inquiries, offer support, and send marketing communications related to our services.</p>

                <h4 className="mb-3">3. Payment Gateway</h4>
                <p className="mb-4">For transactions, we use a third-party payment gateway to process payments securely. We do not store your payment information. Instead, your payment details are handled by a trusted payment processor, and we adhere to industry-standard security practices to protect your data.</p>

                <h4 className="mb-3">4. Data Security</h4>
                <p className="mb-4">We implement reasonable technical and organizational measures to protect your personal data from unauthorized access, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is entirely secure, and we cannot guarantee its absolute security.</p>

                <h4 className="mb-3">5. Sharing of Information</h4>
                <p className="mb-4">We do not sell or rent your personal data to third parties. However, we may share your information with third-party service providers, including payment processors, who assist us in providing services to you. These parties are obligated to keep your data confidential and use it only for the purpose of providing their services to us.</p>

                <h4 className="mb-3">6. Cookies</h4>
                <p className="mb-4">Our website may use cookies to enhance your experience, analyze website traffic, and provide personalized content. You can control cookie settings through your browser, but please note that some features of the site may not function correctly if cookies are disabled.</p>

                <h4 className="mb-3">7. Your Rights</h4>
                <p className="mb-4">You have the right to access, update, or delete your personal information that we hold. If you wish to exercise any of these rights, please contact us using the details provided on our website. You can also opt out of marketing communications by following the unsubscribe link in our emails.</p>

                <h4 className="mb-3">8. Changes to This Privacy Policy</h4>
                <p className="mb-4">We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on this page, and the updated policy will take effect immediately upon posting.</p>

                <h4 className="mb-3">9. Contact Us</h4>
                <p className="">If you have any questions or concerns about this Privacy Policy, or if you would like to exercise your rights regarding your personal data, please contact us at:</p>
                BlueAce Limited <br/>
                Email: <a href="mailto:blueaceindia@gmail.com">blueaceindia@gmail.com</a> <br/>
                Phone: <a href="tel:93115 39090">+91 93115 39090</a> <br/>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======================= Privacy Details End ======================== */}
    </>
  )
}

export default Privacy
