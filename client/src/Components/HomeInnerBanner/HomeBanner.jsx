import React, { useEffect, useState } from "react";
import homeInner from './home-inner-banner.webp';
import axios from 'axios'

function HomeBanner(){
    const [offerBanner,setOfferBanner] = useState([])
    const fetchBannerData = async () => {
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-promotional-banner')
            const data = res.data.data
            const filterData = data.filter((item)=> item.active === true)
            setOfferBanner(filterData)
        } catch (error) {
            console.log('Internal server error in fetching offer banner',error)
        }
    }
    useEffect(()=>{
        fetchBannerData();
    },[])
    return(
        <>
        <div className="container-fluid p-0">
            <div className="row">
                {
                    offerBanner && offerBanner.slice(0,1).map((item,index)=>(
                        <img key={index} src={item.bannerImage?.url} className="img-fluid rounded" alt="book now" />
                    ))
                }
            </div>
        </div>
        </>
    )
}

export default HomeBanner;