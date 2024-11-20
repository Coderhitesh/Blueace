import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Hero() {
  const [allBanner,setBanner] = useState([])

  const fetchData = async() => {
    try {
      const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-banner')
      const bannerData = res.data.data
      const filterData = bannerData.filter((item) => item.active === true)
      setBanner(filterData)
      console.log(filterData)
    } catch (error) {
      console.log('Internal server error in fetching banner',error)
    }
  }

  useEffect(()=>{
    fetchData();
  },[])

  return (
    <>
      {/* <!-- ======================= Home Banner ======================== --> */}
      <div id="carouselExample" class="carousel slide">
        <div class="carousel-inner">
          {
            allBanner && allBanner.map((item,index)=>(
          <div key={index} class={`carousel-item ${index === 1 ? 'active' : ''} `}>
            <img src={item.bannerImage?.url} class="d-block w-100" alt="..." />
          </div>
            ))
          }
          {/* <div class="carousel-item">
            <img src={banner1} class="d-block w-100" alt="..." />
          </div>
          <div class="carousel-item">
            <img src={banner} class="d-block w-100" alt="..." />
          </div> */}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      {/* <!-- ======================= Home Banner ======================== --> */}
    </>
  );
}

export default Hero;
