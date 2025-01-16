import React, { useEffect } from 'react'
import Hero from '../../Components/Hero/Hero'
import CategoryHome from '../../Components/CategoryHome/CategoryHome'
import FeatureListHome from '../../Components/FeatureListHome/FeatureListHome'
import FAQ from '../../Components/FAQ/FAQ'
import AboutUs from '../../Components/AboutUs/AboutUs'
import Services from '../../Components/Services/Services'
import Testimonial from '../../Components/Testimonial/Testimonial'
import HomeBanner from '../../Components/HomeInnerBanner/HomeBanner'
import OurValue from '../../Components/Value/OurValue'
import MetaTag from '../../Components/Meta/MetaTag'
import GetServicePopup from '../../Components/getservicepopup/GetServicePopup'

function Home() {
  const [isPopUp, setPopUp] = React.useState(false)

  const handlePopupActive = () => {
    setPopUp(true)
  }

  const handlePopupDeactive = () => {
    setPopUp(false)
  }

  useEffect(() => {
    handlePopupActive();
  }, []);


  return (
    <div>
      {
        isPopUp && (
          <GetServicePopup handlePopupDeactive={handlePopupDeactive} />
        )
      }
      <MetaTag title={'Find The Best Quality of HVAC solutions at Blueace'} description={'Welcome to Blueace provides top-notch heating, ventilation, and air conditioning solutions where comfort meets expertise. Contact us today for more details: +91 9311539090'} keyword='HVAC solutions' focusKeywords={'HVAC solutions'} />
      <Hero />
      <CategoryHome />
      <FeatureListHome />
      <AboutUs />
      <OurValue />
      <Services />
      <HomeBanner />
      <FAQ />
      <Testimonial />
    </div>
  )
}

export default Home
