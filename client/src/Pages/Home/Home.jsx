import React from 'react'
import Hero from '../../Components/Hero/Hero'
import CategoryHome from '../../Components/CategoryHome/CategoryHome'
import FeatureListHome from '../../Components/FeatureListHome/FeatureListHome'
import PartnerHome from '../../Components/PartnerHome/PartnerHome'
import FAQ from '../../Components/FAQ/FAQ'
import FeatureAuthorHome from '../../Components/FeatureAuthorHome/FeatureAuthorHome'
// import HomeBanner from '../../Components/homeInnerBanner/homeBanner'
import AboutUs from '../../Components/AboutUs/AboutUs'
import Services from '../../Components/Services/Services'
import Testimonial from '../../Components/Testimonial/Testimonial'
import HomeBanner from '../../Components/HomeInnerBanner/HomeBanner'
import OurValue from '../../Components/Value/OurValue'
import MetaTag from '../../Components/Meta/MetaTag'

function Home() {
  return (
    <div>
      <MetaTag title={'Blueace india'} />
      <Hero />
      <CategoryHome />
      <FeatureListHome />   
      <AboutUs />
      <OurValue />
      <Services /> 
      <HomeBanner />
      {/* <FeatureAuthorHome /> */}
      {/* <PartnerHome /> */}
      <FAQ />
      <Testimonial />
    </div>
  )
}

export default Home
