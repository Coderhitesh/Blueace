import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AboutUs from '../../Components/AboutUs/AboutUs'
import OurValue from '../../Components/Value/OurValue'
import installation from './central-air-conditioning.png'
import mentenance from './check.png'
import repair from './maintenance.png'
import whychooseimg from './chilling-plant-6.png'
import technitian from './technician.png'
import quality from './quality.png'
import user from './user.png'
import AboutHero from './aboutus1.webp'
import MetaTag from '../../Components/Meta/MetaTag'


function About() {
  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },[])
  return (
    <>
      {/* ======================= Top Breadcrumbs ======================== */}
      {/* <section className="about-bg bg-cover"
        style={{ background: 'url(assets/img/aboutus.webp) no-repeat' }} >
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8 col-md-11 col-sm-12">
              <div className="abt-caption">
                <div className="abt-caption-head">
                  <h1>Smart team always creates better things and better solutions.</h1>
                  <h6>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  </h6>
                  <div className="abt-bt-info">
                    <Link to="#" className="btn ft-medium theme-cl bg-white rounded">
                      Get Started<i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <MetaTag title={'About Blueace india'} />
      <div className='container-fluid p-0'>
        <div className='row p-0'>
            <img src={AboutHero} alt='About us Hero'/>
        </div>
      </div>

      <AboutUs />
      <OurValue />
      {/* ======================= Top Breadcrumbs ======================== */}

      {/* ======================= what we do ======================== */}
      <section className="space min">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="sec_title position-relative text-center mb-5">
                {/* <h6 className="mb-0 theme-cl">Working Process</h6> */}
                <h2 className="ft-bold">What We Do </h2>
                <p className='text-center'>We offer a comprehensive range of HVAC services, including</p>
              </div>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="wrk-pro-box first about-info-box">
                <div className="wrk-pro-box-icon"><img src={installation} /></div>
                <div className="wrk-pro-box-caption">
                  <h4>Installation</h4>
                  <p> From new system installations to upgrades, we ensure your HVAC system meets your home or business’s specific needs.</p>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="wrk-pro-box sec about-info-box">
                <div className="wrk-pro-box-icon"><img src={mentenance} /></div>
                <div className="wrk-pro-box-caption">
                  <h4>Maintenance</h4>
                  <p>Regular maintenance is key to the longevity and efficiency of your system. Our thorough maintenance services help prevent breakdowns and ensure optimal performance.</p>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="wrk-pro-box thrd about-info-box">
                <div className="wrk-pro-box-icon"><img src={repair} /></div>
                <div className="wrk-pro-box-caption">
                  <h4>Repair</h4>
                  <p>Our team is equipped to handle any HVAC repair needs swiftly and effectively, minimizing downtime and restoring comfort as quickly as possible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======================= what we do End ======================== */}

      {/* why choose us */}
      <section class="space about-why-choose">
        <div class="container">
          <div class="row align-items-center justify-content-between">
            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <div class="m-spaced">
                <div class="position-relative">
                  <h2 class="ft-bold mb-3">Why Choose Us?</h2>
                  {/* media object */}
                  <div class="d-flex align-items-center why-choose-media">
                    <div class="flex-shrink-0">
                      <img src={technitian} alt="..." />
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h4 className='fw-bold'>Experienced Professionals</h4>
                      Our team is trained and certified to handle all types of HVAC systems. We stay current with industry advancements to provide you with the best solutions.
                    </div>
                  </div>
                   {/* media object */}
                   <div class="d-flex align-items-center mt-3 why-choose-media">
                    <div class="flex-shrink-0">
                      <img src={quality} alt="..." />
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h4 className='fw-bold'>Customer Satisfaction</h4>
                      We are dedicated to delivering exceptional service and support. Our goal is to exceed your expectations and ensure your complete satisfaction.
                    </div>
                  </div>
                  {/* media object */}
                  <div class="d-flex align-items-center mt-3 why-choose-media">
                    <div class="flex-shrink-0">
                      <img src={user} alt="..." />
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h4 className='fw-bold'>Local Expertise</h4>
                      As a locally-owned business, we understand the unique climate needs of our area and are committed to serving our community with personalized care. Thank you for considering BLUEACE LIMITED. 
                    </div>
                  </div>

                </div>

              </div>
            </div>

            <div class="col-xl-5 col-lg-5 col-md-12 col-sm-12">
              <div class="position-relative home-about-img">
                <img src={whychooseimg} class="img-fluid" alt="" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* why choose us end */}

    </>
  )
}

export default About
