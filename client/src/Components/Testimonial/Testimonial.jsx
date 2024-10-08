import React from 'react';
import Slider from 'react-slick';  // For slick slider functionality, you need to install react-slick and slick-carousel

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Testimonial() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            <section className="container-fluid testimonial-bg">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="sec_title position-relative text-center mb-5">
                                <h6 className="text-muted mb-0 theme-cl">Reviews</h6>
                                <h2 className="ft-bold">What Our Customer<span className="theme-cl"> Saying</span></h2>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <Slider {...settings}>
                                <div className="single_review">
                                    <div className='testimonial-body'>
                                        <div className="sng_rev_thumb">
                                            <figure>
                                                <img src="assets/img/t-user.webp" className="img-fluid circle" alt="Mark Jevenue" />
                                            </figure>
                                        </div>
                                        <div className="rev_author">
                                            <h4 className="mb-0 fs-md ft-medium">Rajkumar Bithal</h4>
                                            <span className="fs-sm theme-cl">Client</span>
                                        </div>
                                        <div className="sng_rev_caption text-center">
                                            <div className="rev_desc mb-4">
                                                <p>The latest technology of vrv system installed by Blueace India Limited in our showroom is extraordinary. A very good experience with this company.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="single_review">
                                    <div className='testimonial-body'>
                                        <div className="sng_rev_thumb">
                                            <figure>
                                                <img src="assets/img/t-user.webp" className="img-fluid circle" alt="Henna Bajaj" />
                                            </figure>
                                        </div>
                                        <div className="rev_author">
                                            <h4 className="mb-0 fs-md ft-medium">Vandana Singh</h4>
                                            <span className="fs-sm theme-cl">Client</span>
                                        </div>
                                        <div className="sng_rev_caption text-center">
                                            <div className="rev_desc mb-4">
                                                <p>Very professional, timely service and very kind very kind polite. I would highly recommend them. Mukesh ji doesn't stop working till he doesn't solve the problem.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="single_review">
                                    <div className='testimonial-body'>
                                        <div className="sng_rev_thumb">
                                            <figure>
                                                <img src="assets/img/t-user.webp" className="img-fluid circle" alt="John Cenna" />
                                            </figure>
                                        </div>
                                        <div className="rev_author">
                                            <h4 className="mb-0 fs-md ft-medium">Sandeep Sumbly</h4>
                                            <span className="fs-sm theme-cl">Client</span>
                                        </div>
                                        <div className="sng_rev_caption text-center">
                                            <div className="rev_desc mb-4">
                                                <p>Very good sales and service in all about Air conditioner and ventilation work, even staff are very good manner, i had a good experience with them</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="single_review">
                  <div className="sng_rev_thumb">
                    <figure>
                      <img src="assets/img/t-4.png" className="img-fluid circle" alt="Madhu Sharma" />
                    </figure>
                  </div>
                  <div className="rev_author">
                    <h4 className="mb-0 fs-md ft-medium">Madhu Sharma</h4>
                    <span className="fs-sm theme-cl">Team Manager</span>
                  </div>
                  <div className="sng_rev_caption text-center">
                    <div className="rev_desc mb-4">
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore voluptate velit esse cillum.</p>
                    </div>
                  </div>
                </div> */}
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
