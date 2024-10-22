import React from "react";
import AboutUS from './about-us.webp'

function AboutUs() {
    return (
        <>
            <section class="space aboutus-h-top">
                <div class="container">
                    <div class="row align-items-center justify-content-between">
                        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 py-4">
                            <div class="m-spaced">
                                <div class="position-relative">

                                    <div class="mb-2"><span class="text-sky px-2 py-1 rounded theme-cl">About Us</span></div>
                                    <h2 class="ft-bold mb-3">Blueace India Limited</h2>
                                    <p class="mb-3 text-justify">Welcome to Blueace Limited, where comfort meets expertise. Our mission has always been to provide top-notch heating, ventilation, and air conditioning solutions tailored to the unique needs of each customer.</p>
                                    <h3 class="ft-bold mb-3">Who We Are</h3>
                                    <p class="mb-3 text-justify">At Blueace Limited, we pride ourselves on our commitment to excellence and customer satisfaction. Our team of highly skilled technicians and industry experts brings years of experience to every project, ensuring that your home or business remains comfortable year-round.
                                    </p>

                                </div>
                                <div class="position-relative row">
                                    <div class="col-lg-12 col-md-12 col-12 mt-3">
                                        <a href="#" class="btn btn-md rounded theme-cl about-btn">Explore More<i class="lni lni-arrow-right-circle ms-2"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-5 col-lg-5 col-md-12 col-sm-12">
                            <div class="position-relative home-about-img">
                                <img src={AboutUS} class="img-fluid" alt="" />
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </>
    )
}

export default AboutUs;