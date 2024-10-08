import React, { useEffect } from 'react'

function ListingsPage() {
	useEffect(()=>{
		window.scrollTo({
			top: 0,
			behavior:'smooth'
		})
	},[])
  return (
    <>
      {/* <!-- ============================ Search Tag & Filter Start ================================== --> */}
			<section class="cats-filters py-3">
				<div class="container">
					<div class="row justify-content-between align-items-center">
						
						<div class="col-xl-12 col-lg-12 col-md-12 col-12">
							<div class="Goodup-all-drp">
								
								<div class="Goodup-single-drp small">
									<div class="btn-group">
										<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Restaurants</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/fast-delivery.png" class="img-fluid" width="20" alt="" />Delivery</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/burger.png" class="img-fluid" width="20" alt="" />Burgers</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/booking.png" class="img-fluid" width="20" alt="" />Reservations</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/house.png" class="img-fluid" width="20" alt="" />Japanese</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/chinese-food.png" class="img-fluid" width="20" alt="" />Chinese</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/mexican-hat.png" class="img-fluid" width="20" alt="" />Mekician</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/dish.png" class="img-fluid" width="20" alt="" />Italian</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/tom-yum.png" class="img-fluid" width="20" alt="" />Thai</a></li>
										</ul>
									</div>
								</div>
								
								<div class="Goodup-single-drp small">
									<div class="btn-group">
										<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Home Services</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/hammer.png" class="img-fluid" width="20" alt="" />Contractors</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/coconut-tree.png" class="img-fluid" width="20" alt="" />Landscaping</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/broken-cable.png" class="img-fluid" width="20" alt="" />Electricians</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/padlock.png" class="img-fluid" width="20" alt="" />Locksmiths</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/basket.png" class="img-fluid" width="20" alt="" />Home Cleaning</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/delivery-truck.png" class="img-fluid" width="20" alt="" />Movers</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/home.png" class="img-fluid" width="20" alt="" />HVAC</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/plumbering.png" class="img-fluid" width="20" alt="" />Plumbers</a></li>
										</ul>
									</div>
								</div>
								
								<div class="Goodup-single-drp small">
									<div class="btn-group">
										<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Auto Services</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/wrench.png" class="img-fluid" width="20" alt="" />Auto Repairs</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/rental-car.png" class="img-fluid" width="20" alt="" />Car Dealers</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/sketch.png" class="img-fluid" width="20" alt="" />Auto Detailing</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/oil.png" class="img-fluid" width="20" alt="" />Oil Change</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/shopping-bag.png" class="img-fluid" width="20" alt="" />Body Shops</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/parking.png" class="img-fluid" width="20" alt="" />Parking</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/car-wash.png" class="img-fluid" width="20" alt="" />Car Wash</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/tow-truck.png" class="img-fluid" width="20" alt="" />Towing</a></li>
										</ul>
									</div>
								</div>
								
								<div class="Goodup-single-drp small">
									<div class="btn-group">
										<button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">More</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/towel-hanger.png" class="img-fluid" width="20" alt="" />Dry Cleaning</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/salon.png" class="img-fluid" width="20" alt="" />Hair salons</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/smartphone.png" class="img-fluid" width="20" alt="" />Phone Repair</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/weights.png" class="img-fluid" width="20" alt="" />Gyms</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/cocktail.png" class="img-fluid" width="20" alt="" />Bars & cafe</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/spa.png" class="img-fluid" width="20" alt="" />Massage</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/poinsettia.png" class="img-fluid" width="20" alt="" />Nightlife</a></li>
											<li><a class="dropdown-item" href="#"><img src="assets/img/icons/online-shopping.png" class="img-fluid" width="20" alt="" />Shopping</a></li>
										</ul>
									</div>
								</div>
								
								<div class="Goodup-single-drp small">
									<div class="btn-group">
										<button type="button" class="btn bg-dark text-light">Update</button>
									</div>
								</div>
							
							</div>
						</div>
						
					</div>
				</div>
			</section>
			<div class="clearfix"></div>
			{/* <!-- ============================ Search Tag & Filter End ================================== --> */}
			
			
			{/* <!-- ============================ Main Section Start ================================== --> */}
			<section class="gray py-5">
				<div class="container">
					<div class="row">
						
						<div class="col-xl-3 col-lg-3 col-md-12 col-sm-12">
							<div class="bg-white rounded mb-4">							
							
								<div class="sidebar_header d-flex align-items-center justify-content-between px-4 py-3 br-bottom">
									<h4 class="ft-medium fs-lg mb-0">Search Filter</h4>
									<div class="ssh-header">
										<a href="javascript:void(0);" class="clear_all ft-medium text-muted">Clear All</a>
										<a href="#search_open" data-bs-toggle="collapse" aria-expanded="false" role="button" class="collapsed _filter-ico ml-2"><i class="lni lni-text-align-right"></i></a>
									</div>
								</div>
								
								{/* <!-- Find New Property --> */}
								<div class="sidebar-widgets collapse miz_show" id="search_open" data-bs-parent="#search_open">
									<div class="search-inner">
										
										<div class="side-filter-box">
											<div class="side-filter-box-body">
												
												{/* <!-- Price Range --> */}
												{/* <div class="inner_widget_link">
													  <div class="btn-group d-flex justify-content-around price-btn-457">
														<button type="button" class="btn">$</button>
														<button type="button" class="btn">$$</button>
														<button type="button" class="btn active d14ixh">$$$</button>
														<button type="button" class="btn">$$$$</button>
													  </div>
												</div> */}
												
												{/* <!-- Suggested --> */}
												<div class="inner_widget_link">
													<h6 class="ft-medium">Suggested</h6>
													<ul class="no-ul-list filter-list">
														<li>
															<input id="a1" class="checkbox-custom" name="open" type="checkbox"/>
															<label for="a1" class="checkbox-custom-label">Open Now</label>
														</li>
														<li>
															<input id="a2" class="checkbox-custom" name="reservations" type="checkbox"/>
															<label for="a2" class="checkbox-custom-label">Reservations</label>
														</li>
														<li>
															<input id="a3" class="checkbox-custom" name="Mexican" type="checkbox"/>
															<label for="a3" class="checkbox-custom-label">Mexican</label>
														</li>
														<li>
															<input id="a4" class="checkbox-custom" name="Seafood" type="checkbox"/>
															<label for="a4" class="checkbox-custom-label">Seafood</label>
														</li>
														<li>
															<input id="a5" class="checkbox-custom" name="Takeout" type="checkbox"/>
															<label for="a5" class="checkbox-custom-label">Takeout</label>
														</li>
														
													</ul>
												</div>
												
												{/* <!-- Features --> */}
												<div class="inner_widget_link">
													<h6 class="ft-medium">Features</h6>
													<ul class="no-ul-list filter-list">
														<li>
															<input id="a6" class="checkbox-custom" name="Kids" type="checkbox" checked=""/>
															<label for="a6" class="checkbox-custom-label">Good for Kids</label>
														</li>
														<li>
															<input id="a7" class="checkbox-custom" name="Service" type="checkbox"/>
															<label for="a7" class="checkbox-custom-label">Waiter Service</label>
														</li>
														<li>
															<input id="a8" class="checkbox-custom" name="Open" type="checkbox"/>
															<label for="a8" class="checkbox-custom-label">Open to All</label>
														</li>
														<li>
															<input id="a9" class="checkbox-custom" name="Dogs" type="checkbox"/>
															<label for="a9" class="checkbox-custom-label">Dogs Allowed</label>
														</li>
														<li>
															<input id="a10" class="checkbox-custom" name="Outdoor" type="checkbox"/>
															<label for="a10" class="checkbox-custom-label">Outdoor Seating</label>
														</li>
														<li>
															<input id="a11" class="checkbox-custom" name="Hot" type="checkbox"/>
															<label for="a11" class="checkbox-custom-label">Hot and New</label>
														</li>
														<li>
															<input id="a12" class="checkbox-custom" name="Breakfast" type="checkbox"/>
															<label for="a12" class="checkbox-custom-label">Breakfast</label>
														</li>
														<li>
															<a class="ft-bold d14ixh" href="javascript:void(0);">See More</a>
														</li>
													</ul>
												</div>
												
												{/* <!-- Neighborhoods --> */}
												<div class="inner_widget_link">
													<h6 class="ft-medium">Neighborhoods</h6>
													<ul class="no-ul-list filter-list">
														<li>
															<input id="b1" class="checkbox-custom" name="Alta" type="checkbox" checked=""/>
															<label for="b1" class="checkbox-custom-label">Alta Vista</label>
														</li>
														<li>
															<input id="b2" class="checkbox-custom" name="Monticello" type="checkbox"/>
															<label for="b2" class="checkbox-custom-label">Monticello Park</label>
														</li>
														<li>
															<input id="b3" class="checkbox-custom" name="Beacon" type="checkbox"/>
															<label for="b3" class="checkbox-custom-label">Beacon Hill</label>
														</li>
														<li>
															<input id="b4" class="checkbox-custom" name="Near" type="checkbox"/>
															<label for="b4" class="checkbox-custom-label">Near Northwest</label>
														</li>
														<li>
															<input id="b5" class="checkbox-custom" name="North" type="checkbox"/>
															<label for="b5" class="checkbox-custom-label">North Central</label>
														</li>
														<li>
															<input id="b6" class="checkbox-custom" name="Northwest1" type="checkbox"/>
															<label for="b6" class="checkbox-custom-label">Northwest</label>
														</li>
														<li>
															<input id="b7" class="checkbox-custom" name="Pecan" type="checkbox"/>
															<label for="b7" class="checkbox-custom-label">Pecan Valley</label>
														</li>
														<li>
															<input id="b8" class="checkbox-custom" name="Prospect" type="checkbox"/>
															<label for="b8" class="checkbox-custom-label">Prospect Hill</label>
														</li>
														<li>
															<input id="b9" class="checkbox-custom" name="South" type="checkbox"/>
															<label for="b9" class="checkbox-custom-label">South Central</label>
														</li>
														<li>
															<a class="ft-bold d14ixh" href="javascript:void(0);">See More</a>
														</li>
													</ul>
												</div>
												
												{/* <!-- Bird's-eye View --> */}
												<div class="inner_widget_link">
													<h6 class="ft-medium">Bird's-eye View</h6>
													<ul class="no-ul-list filter-list">
														<li>
															<input id="c1" class="checkbox-custom" name="blc" type="checkbox" checked=""/>
															<label for="c1" class="checkbox-custom-label">Within 4 blocks</label>
														</li>
														<li>
															<input id="c2" class="checkbox-custom" name="1km" type="checkbox"/>
															<label for="c2" class="checkbox-custom-label">Walking (1 mi.)</label>
														</li>
														<li>
															<input id="c3" class="checkbox-custom" name="2km" type="checkbox"/>
															<label for="c3" class="checkbox-custom-label">Biking (2 mi.)</label>
														</li>
														<li>
															<input id="c4" class="checkbox-custom" name="5km" type="checkbox"/>
															<label for="c4" class="checkbox-custom-label">Driving (5 mi.)</label>
														</li>
														<li>
															<input id="c5" class="checkbox-custom" name="10km" type="checkbox"/>
															<label for="c5" class="checkbox-custom-label">Driving (10 mi.)</label>
														</li>
													</ul>
												</div>
												
												<div class="form-group filter_button">
													<button type="submit" class="btn theme-bg text-light rounded full-width">22 Results Show</button>
												</div>
												
											</div>
										</div>
										
									</div>							
								</div>
							</div>
							{/* <!-- Sidebar End --> */}
						
						</div>
						
						{/* <!-- Item Wrap Start --> */}
						<div class="col-xl-9 col-lg-9 col-md-12 col-sm-12">
							
							{/* <!-- row --> */}
							<div class="row justify-content-center gx-3">
							
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status open me-2">Open</div>
												<div class="Goodup-featured-tag">Featured</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-1.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-1.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Wedding</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">Rajwara Marriage Home<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Pritampura, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 365 795 4526</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average high">4.3</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">2 min ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status close me-2">Closed</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-2.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-2.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Sports</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">Decathlon Sport House<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>NSP, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 365 874 6310</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average mid">3.5</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">10 min ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status open me-2">Open</div>
												<div class="Goodup-featured-tag">Featured</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-3.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-3.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Hotels</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">The Gold Hotel Lalit<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Munirka, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 365 874 2140</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average high">4.4</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">3 Hours ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status open me-2">open</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-4.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-4.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Zym & Health</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">Fitness Revolution Gym<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Saket, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 368 740 5100</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average mid">4.9</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">1 days ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status close me-2">Closed</div>
												<div class="Goodup-featured-tag">Featured</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-5.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-5.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Beauty & Makeup</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">Pretty Woman Smart Batra<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Rohini, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 365 854 7230</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average mid">3.2</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">2 days ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status open me-2">Open</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-6.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-6.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Night Party</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">The Sartaj Blue Night<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Sastri Nagar, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 635 890 7500</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average high">4.5</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">3 days ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status close me-2">Closed</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-7.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-7.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Cafe & Bar</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">Pizza Delight Cafe<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Rithala, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 639 572 4160</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average poor">2.8</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">4 days ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status open me-2">Open</div>
												<div class="Goodup-featured-tag">Featured</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-8.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-8.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Shopping Mall</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">The Great Allante Shop<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Munirka, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 365 874 1400</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average mid">3.7</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">3 days ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status open me-2">Open</div>
												<div class="Goodup-featured-tag">Featured</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-9.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-1.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Wedding</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">Rajwara Marriage Home<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Pritampura, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 365 795 4526</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average high">4.3</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">2 min ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status close me-2">Closed</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-10.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-2.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Sports</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">Decathlon Sport House<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>NSP, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 365 874 6310</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average mid">3.5</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">10 min ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status open me-2">Open</div>
												<div class="Goodup-featured-tag">Featured</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-11.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-3.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Hotels</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">The Gold Hotel Lalit<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Munirka, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 365 874 2140</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average high">4.4</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">3 Hours ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{/* <!-- Single --> */}
								<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
									<div class="Goodup-grid-wrap">
										<div class="Goodup-grid-upper">
											<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											<div class="Goodup-pos ab-left">
												<div class="Goodup-status open me-2">open</div>
											</div>
											<div class="Goodup-grid-thumb">
												<a href="listing-search-v1.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-12.jpg" class="img-fluid" alt="" /></a>
											</div>
										</div>
										<div class="Goodup-grid-fl-wrap">
											<div class="Goodup-caption px-3 py-2">
												<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-4.png" class="img-fluid circle" alt="" /></a></div>
												<div class="Goodup-cates"><a href="search.html">Zym & Health</a></div>
												<h4 class="mb-0 ft-medium medium"><a href="listing-search-v1.html" class="text-dark fs-md">Fitness Revolution Gym<span class="verified-badge"><i class="fas fa-check-circle"></i></span></a></h4>
												<div class="Goodup-middle-caption mt-3">
													<div class="Goodup-location"><i class="fas fa-map-marker-alt"></i>Rithala, New Delhi</div>
													<div class="Goodup-call"><i class="fas fa-phone-alt"></i>+91 368 740 5100</div>
												</div>
											</div>
											<div class="Goodup-grid-footer py-3 px-3">
												<div class="Goodup-ft-first">
													<div class="Goodup-rating">
														<div class="Goodup-pr-average mid">4.9</div>
														<div class="Goodup-rates">
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
															<i class="fas fa-star"></i>
														</div>
													</div>
													<div class="Goodup-price-range">
														
														
														
														
													</div>
												</div>
												<div class="Goodup-ft-last">
													<span class="small">1 days ago</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								
							</div>
							{/* <!-- /row --> */}
							
							<div class="row">
								<div class="col-lg-12 col-md-12 col-sm-12">
									<ul class="pagination">
										<li class="page-item">
										  <a class="page-link" href="#" aria-label="Previous">
											<span class="fas fa-arrow-circle-right"></span>
											<span class="sr-only">Previous</span>
										  </a>
										</li>
										<li class="page-item"><a class="page-link" href="#">1</a></li>
										<li class="page-item"><a class="page-link" href="#">2</a></li>
										<li class="page-item active"><a class="page-link" href="#">3</a></li>
										<li class="page-item"><a class="page-link" href="#">...</a></li>
										<li class="page-item"><a class="page-link" href="#">18</a></li>
										<li class="page-item">
										  <a class="page-link" href="#" aria-label="Next">
											<span class="fas fa-arrow-circle-right"></span>
											<span class="sr-only">Next</span>
										  </a>
										</li>
									</ul>
								</div>
							</div>
							
						</div>
						
					</div>
				</div>
			</section>
			{/* <!-- ============================ Main Section End ================================== --> */}
    </>
  )
}

export default ListingsPage
