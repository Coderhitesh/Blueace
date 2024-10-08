import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function FeatureAuthorHome() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    autoplaySpeed: 3000, 
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const authors = [
    {
      name: "James R. Smith",
      location: "San Francisco",
      listings: 32,
      image: "assets/img/t-1.png",
      social: {
        facebook: "#",
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Howard L. Gallegos",
      location: "San Francisco",
      listings: 40,
      image: "assets/img/t-2.png",
      social: {
        facebook: "#",
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
        name: "James R. Smith",
        location: "San Francisco",
        listings: 32,
        image: "assets/img/t-1.png",
        social: {
          facebook: "#",
          linkedin: "#",
          twitter: "#",
          instagram: "#"
        }
      },
    {
      name: "Howard L. Gallegos",
      location: "San Francisco",
      listings: 40,
      image: "assets/img/t-2.png",
      social: {
        facebook: "#",
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
        name: "James R. Smith",
        location: "San Francisco",
        listings: 32,
        image: "assets/img/t-1.png",
        social: {
          facebook: "#",
          linkedin: "#",
          twitter: "#",
          instagram: "#"
        }
      },
    {
      name: "Howard L. Gallegos",
      location: "San Francisco",
      listings: 40,
      image: "assets/img/t-2.png",
      social: {
        facebook: "#",
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
        name: "James R. Smith",
        location: "San Francisco",
        listings: 32,
        image: "assets/img/t-1.png",
        social: {
          facebook: "#",
          linkedin: "#",
          twitter: "#",
          instagram: "#"
        }
      },
  ];

  return (
    <>
      <section>
        <div className="container grey">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="sec_title position-relative text-center mb-5">
                <h6 className="mb-0 theme-cl">Featured Authors</h6>
                <h2 className="ft-bold">Meet Top Authors in Delhi</h2>
              </div>
            </div>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <Slider {...settings}>
                {authors.map((author, index) => (
                  <div key={index} className="single-list">
                    <div className="Goodup-author-wrap">
                      {author.listings > 30 && (
                        <div className="Goodup-author-tag new">New</div>
                      )}
                      <div className="Goodup-author-lists">{author.listings} Listings</div>
                      <div className="Goodup-author-thumb">
                        <a href="author-detail.html">
                          <img src={author.image} className="img-fluid circle" alt={author.name} />
                        </a>
                      </div>
                      <div className="Goodup-author-caption">
                        <h4 className="fs-md mb-0 ft-medium m-catrio">
                          <a href="author-detail.html">{author.name}</a>
                        </h4>
                        <div className="Goodup-location">
                          <i className="fas fa-map-marker-alt me-1 theme-cl"></i>
                          {author.location}
                        </div>
                      </div>
                      <div className="Goodup-author-links">
                        <ul className="Goodup-social">
                          <li><a href={author.social.facebook}><i className="lni lni-facebook-filled"></i></a></li>
                          <li><a href={author.social.linkedin}><i className="lni lni-linkedin-original"></i></a></li>
                          <li><a href={author.social.twitter}><i className="lni lni-twitter-original"></i></a></li>
                          <li><a href={author.social.instagram}><i className="lni lni-instagram-original"></i></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FeatureAuthorHome;
