import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ahu from './ahu.webp';
import fancoil from './fancoil-unit.webp';
import chillerWaterCassets from './Chilled-Water-Cassette.webp';
import highWallFancoil from './High-Wall-Fan-Coil-Unit.webp';
import GrillDuffusser from './grill-difuser.webp';
import chillerWaterp from './water-chiller-plant.webp';
import ibrSteam from './ibr-steam-boiler.webp';
import coolingHeating from './cooling-heating-coil.webp';
import dxCooling from './dx-cooling-seystems.webp';
import DuctableACHitachi from './Ductable-AC-Hitachi.webp';
import vrfHitachi from './hitachi-vrv-vrf-system.webp';
import hitachiMakeWallMount from './Hitachi-Make-Wall-Mounted-Split-AC.webp';
import heatPump from './heat-pump.webp';


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import axios from 'axios';

function FeatureListHome() {
	const [allService, setAllService] = useState([])

	const fetchServiceData = async () => {
		try {
			const res = await axios.get('https://api.blueace.co.in/api/v1/get-all-service');
			let data = res.data.data;

			for (let i = data.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[data[i], data[j]] = [data[j], data[i]];
			}

			setAllService(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchServiceData();
	}, []);

	return (
		<>
			<div className='container-fluid mb-5 product-list'>
				<div className='container'>
					<div class="row justify-content-center pt-4">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
							<div class="sec_title position-relative text-center mb-5">
								<h6 class="theme-cl mb-0">Product</h6>
								<h2 class="ft-bold">Our Products List</h2>
							</div>
						</div>
					</div>
					<Swiper slidesPerView={3} spaceBetween={30} freeMode={true}
						pagination={{
							clickable: true,
						}}
						breakpoints={{
							320: {
								slidesPerView: 1,
								spaceBetween: 20,
							},
							375: {
								slidesPerView: 1,
								spaceBetween: 20,
							},
							425: {
								slidesPerView: 1,
								spaceBetween: 20,
							},
							640: {
								slidesPerView: 2,
								spaceBetween: 20,
							},
							768: {
								slidesPerView: 2,
								spaceBetween: 40,
							},
							1024: {
								slidesPerView: 4,
								spaceBetween: 50,
							},
						}}

						modules={[FreeMode, Pagination]}
						className="mySwiper"
					>
						{
							allService && allService.slice(0,12).map((item, index) => (
								<SwiperSlide key={index}>
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">

											<div class="Goodup-grid-thumb">
												<Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`} class="d-block text-center m-auto"><img src={item.serviceImage?.url} class="img-fluid" alt={item.name} /></Link>
											</div>
											{/* <div class="Goodup-rating overlay">
												<div class="Goodup-pr-average high">4.8</div>
												<div class="Goodup-aldeio">
													<div class="Goodup-rates">
														<i class="fas fa-star"></i>
														<i class="fas fa-star"></i>
														<i class="fas fa-star"></i>
														<i class="fas fa-star"></i>
														<i class="fas fa-star"></i>
													</div>
													<div class="Goodup-all-review"><span>Reviews</span></div>
												</div>
											</div> */}
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<h4 class="mb-0 ft-medium medium"><Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`} class="text-dark fs-md fw-bold">{item.name}</Link></h4>
												{/* <div class="Goodup-location"><i class="fas fa-map-marker-alt me-1 theme-cl text-dark"></i>Naraina Industrial Area, Phase – 01</div> */}
												<div class="Goodup-middle-caption mt-3">
													{/* <p>At vero eos et accusamus et iusto </p> */}
												</div>
											</div>
											<div class="Goodup-grid-footer py-2 px-3">
												<div class="Goodup-ft-first">
													<Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`} class="Goodup-cats-wrap"><div class="cats-ico bg-2"><i class="lni lni-slim"></i></div><span class="cats-title">Blueace Limited</span></Link>
												</div>
												<div class="Goodup-ft-last">
													<div class="Goodup-inline">
														{/* <div class="Goodup-bookmark-btn"><button type="button">Get Enquiry</button></div> */}
														<div class="Goodup-bookmark-btn "><button type="button"><Link to={`/service/${item.name.replace(/\s+/g, '-').toLowerCase()}`}>Get Enquiry <i class="lni lni-envelope position-absolute"></i></Link></button></div>

													</div>
												</div>
											</div>
										</div>
									</div>
								</SwiperSlide>
							))
						}


					</Swiper>
				</div>
			</div>

		</>
	);
}

export default FeatureListHome;
