import React, { useEffect } from 'react'
import ahuheroImage from './home-inner-banner.webp'
import qualityAssured from './quality-assured-logo.webp'
import GetServicePopup from '../../Components/getservicepopup/GetServicePopup'

function MaintenanceofAHUandFCU() {
  useEffect(()=>{
    window.scrollTo({
      top:0,
      behavior:'smooth'
    })
  },[])
  return (
    <>
      {/* left sidebar */}
      <div className='container mb-5'>
        <div className='row mt-5'>
          <div className='col-lg-9 col-md-9'>
            <div className='services-content'>
              <div className='services-hero'>
                <img src={ahuheroImage} className='img-fluid rounded' />
              </div>
              <div className='services-title'>
                <h2 className='fw-bold'>Maintenance of AHU and FCU</h2>
                <div class="services-rating d-flex"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><div class="services-review"><span><a href='#'>(4.9) Reviews</a></span></div></div>
              </div>
              <div className='content-body mt-4'>
                <p className='text-justify'>Air Handling Unit (AHU) services ensure the efficient operation and longevity of HVAC systems. These services include routine maintenance, filter replacements, coil cleaning, and fan inspection.Fan Coil Unit (FCU) services the purpose of regulating the temperature in a specific space or multiple areas within a building. </p>
                <p className='text-justify'>A professional AHU service will involve thorough cleaning of all components, including coils, filters, and ductwork. Additionally, belts will be checked for tension and wear, and lubrication may be applied to moving parts to ensure smooth operation. FCU is short for “Fan Coil Unit”. FCU Service is a device used in HVAC (Heating, Ventilation, and Air Conditioning) systems. FCU is commonly installed in apartments, high-rise buildings, commercial buildings, supermarkets, hotels, restaurants, hospitals, etc., to regulate temperature and supply cold or hot air into a space.</p>
                <h3>Functions Of AHU And FCU</h3>
                <p className='text-justify'>An air handling unit (AHU) operates by bringing in fresh air from the outside, while a fan coil unit (FCU) generally recirculates and conditions the air in an interior space.</p>
                <p className='text-justify'>AHUs are often used in medium to large industrial and commercial buildings and are usually installed in the floors, roof or basement. It is common to have lots of smaller AHUs working in different areas of the building.</p>
                <p className='text-justify'>A fan coil unit (FCU), also known as a Vertical Fan Coil Unit (VFCU), is a device consisting of a heat exchanger (coil) and a fan. FCUs are commonly used in HVAC systems of residential, commercial, and industrial buildings that use ducted split air conditioning or central plant cooling.</p>
              </div>
            </div>
          </div>
          {/* right sidbar */}
          <div className='col-lg-3 col-md-3'>
            <div className='services-sidebar sticky-top'>
              <div className='card px-3 py-3'>
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <img src={qualityAssured} alt="Quality log" className='img-fluid quality-logo' />
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h4>Blueace India Promise</h4>
                    <ul className='promise-list'>
                      <li><i class="fa fa-chevron-right"></i> Verified Professionals</li>
                      <li><i class="fa fa-chevron-right"></i> Hassle Free Booking</li>
                      <li><i class="fa fa-chevron-right"></i> Transparent Pricing</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* get service model */}
              <GetServicePopup/>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default MaintenanceofAHUandFCU