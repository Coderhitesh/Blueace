import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Hero() {
  const [allBanner, setBanner] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-banner');
      const bannerData = res.data.data;
      const filterData = bannerData.filter((item) => item.active === true);
      setBanner(filterData);
      console.log('filterData', bannerData);
    } catch (error) {
      console.log('Internal server error in fetching banner', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {/* <!-- ======================= Home Banner ======================== --> */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-pause="false">
        <div className="carousel-inner">
          {allBanner &&
            allBanner.map((item, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
                data-bs-interval="3000" // Change slides every 3 seconds
              >
                <img src={item.bannerImage?.url} className="d-block w-100" alt="Banner" />
              </div>
            ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {/* <!-- ======================= Home Banner ======================== --> */}
    </>
  );
}

export default Hero;
