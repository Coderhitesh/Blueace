import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './category.css'
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function Category() {
    const { name } = useParams();
    const [subCategory, setSubCategory] = useState(null);  // Set to null initially to check loading state
    const [service, setService] = useState([])

    const formatName = (name) => {
        return name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const newName = formatName(name);
    console.log('name',newName)

    const fetchdata = async () => {
        try {
            const res = await axios.get(`https://api.blueaceindia.com/api/v1/get-service-category-by-name/${name}`);
            setSubCategory(res.data.data);
            console.log('data',res.data)
        } catch (error) {
            console.log(error);
        }
    };

    const fetchServiceData = async () => {
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-service')
            const data = res.data.data
            const filterData = data.filter((item) => item?.subCategoryId?.name === newName)
            setService(filterData)
            console.log(filterData)
        } catch (error) {
            console.log("Internal server error in fetchin service data", error);
        }
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior:'smooth'
        })
        fetchServiceData();
        fetchdata();
    }, [name]);

    // Render a loading state while the data is being fetched
    if (!subCategory) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <section className='p-0'>
                <div className='container-fluid p-0'>
                    <div className='row'>
                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={true}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="category-mySwiper"
                        >
                            {subCategory.sliderImage && subCategory.sliderImage.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={item.url} alt={subCategory.name} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                <div className='container mt-4'>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <h2 className='text-center mt-4 fw-bold'>{subCategory.name}</h2>

                            {/* Render HTML safely */}
                            <p className='text-center' dangerouslySetInnerHTML={{ __html: subCategory.description }}></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='gray mt-5'>
                <div className='container text-center'>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className='category-title align-item-center'>
                                <h3 className='fw-bold text-uppercase bg-primary text-white p-2'>
                                    Type of {subCategory.name}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        {/* Render other sub-category data as needed */}
                        {
                            service && service.map((item, index) => (
                                <div className='col-lg-4 mt-5' key={index}>
                                    <Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`}>
                                        <div className='card p-1 border-0'>
                                            <img src={item.serviceImage?.url} alt={item.name} />
                                            <h4 className='fw-bold mt-3 mb-3'>{item.name}</h4>
                                        </div>
                                    </Link>


                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        </>
    );
}

export default Category;
