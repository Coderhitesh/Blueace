import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Term() {
    useEffect(()=>{
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	},[])
  return (
    <>
      {/* ======================= Top Breadcrumbs ======================== */}
      <div style={{ backgroundColor: '#00225F' }} className="py-3">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to={'/'} style={{ color: 'white' }}>Home</Link></li>
                  <li className="breadcrumb-item" style={{ color: 'white' }}>/</li>
                  <li className="breadcrumb-item active" style={{ color: 'white' }} aria-current="page">Terms & Conditions</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* ======================= Top Breadcrumbs End ======================== */}

      {/* ======================= Terms & Conditions Details ======================== */}
      <section className="middle">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-11 col-lg-12 col-md-6 col-sm-12">
              <div className="abt_caption">
                <h2 className="ft-medium mb-4">Terms & Conditions</h2>

                <h4 className="mb-3">1. Introduction</h4>
                <p className="mb-4">
                  These Terms and Conditions ("Terms") govern the use of services provided by BlueAce Limited, including but not limited to air conditioning services, installation, maintenance, repairs, and other related services ("Services"). By accessing or using our services, you agree to be bound by these Terms.
                </p>

                <h4 className="mb-3">2. Services</h4>
                <p className="mb-4">
                  BlueAce Limited offers a range of services including Air Cooled Chillers, Heat Pumps, Cassette Air Conditioning Systems, VRV & VRF Systems, Cold Rooms, Ductable Air Conditioners, and other related services. You agree to use our services in accordance with applicable laws and these Terms.
                </p>

                <h4 className="mb-3">3. Payment Terms</h4>
                <p className="mb-4">
                  Payment for services must be made in accordance with the pricing terms agreed upon at the time of service request. Payment can be made via the accepted payment methods on our website. If a payment gateway is used, your payment details are processed by a third-party payment processor, and we do not store your payment information.
                </p>

                <h4 className="mb-3">4. User Responsibilities</h4>
                <p className="mb-4">
                  You agree to provide accurate and complete information when requesting our services. You are responsible for ensuring that the location and equipment where the service is to be performed are accessible and suitable for the services requested. BlueAce Limited is not liable for any damages caused by incorrect or incomplete information provided by you.
                </p>

                <h4 className="mb-3">5. Cancellation Policy</h4>
                <p className="mb-4">
                  If you wish to cancel a scheduled service, you must notify BlueAce Limited at least 24 hours in advance. Cancellations made within less than 24 hours may incur a cancellation fee. In case of emergencies, please contact us immediately.
                </p>

                <h4 className="mb-3">6. Limitation of Liability</h4>
                <p className="mb-4">
                  BlueAce Limited will not be held responsible for any indirect, consequential, or punitive damages arising from the use of our services. Our liability is limited to the amount paid for the services in question.
                </p>

                <h4 className="mb-3">7. Force Majeure</h4>
                <p className="mb-4">
                  BlueAce Limited shall not be liable for any failure or delay in performing its obligations under these Terms if such delay or failure is caused by events beyond our reasonable control, including but not limited to natural disasters, strikes, or interruptions in supply chains.
                </p>

                <h4 className="mb-3">8. Intellectual Property</h4>
                <p className="mb-4">
                  All content provided on the website, including logos, text, graphics, images, and other materials, are the intellectual property of BlueAce Limited and are protected by applicable copyright laws. You are not allowed to reproduce, distribute, or otherwise use the content without prior written permission.
                </p>

                <h4 className="mb-3">9. Privacy and Data Protection</h4>
                <p className="mb-4">
                  BlueAce Limited respects your privacy and is committed to protecting your personal data. Please refer to our Privacy Policy for detailed information on how we collect, use, and protect your personal data when you use our services.
                </p>

                <h4 className="mb-3">10. Changes to the Terms</h4>
                <p className="mb-4">
                  BlueAce Limited reserves the right to update or modify these Terms at any time. Any changes will be posted on this page, and the updated Terms will be effective immediately upon posting. We encourage you to review these Terms periodically.
                </p>

                <h4 className="mb-3">11. Governing Law</h4>
                <p className="mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any disputes arising from the use of our services shall be resolved in the competent courts in New Delhi, India.
                </p>

                <h4 className="mb-3">12. Contact Us</h4>
                <p className="mb-4">
                  If you have any questions or concerns regarding these Terms, please contact us:
                </p>
                <p className="mb-4">
                  BlueAce Limited<br />
                  Email: <a href="mailto:info@blueaceindia.com">info@blueaceindia.com</a><br />
                  Phone: <a href="tel:93115 39090">+91 93115 39090</a><br />
                  Address: Phase-1, C-126, Indl. Area, Naraina, New Delhi, Delhi 110028
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======================= Terms & Conditions Details End ======================== */}
    </>
  )
}

export default Term
