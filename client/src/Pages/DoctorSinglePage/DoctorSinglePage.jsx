import React, { useEffect } from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function DoctorSinglePage() {
    const images = [
        'assets/img/med/1.jpg',
        'assets/img/med/2.jpg',
        'assets/img/med/3.jpg',
        'assets/img/med/4.jpg',
        'assets/img/med/5.jpg',
        'assets/img/med/6.jpg',
        'assets/img/med/7.jpg',
        'assets/img/med/8.jpg',
    ];

     // Slick Slider settings
     const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior:'smooth'
        })
    },[])
  return (
    <div>
      {/* <!-- ======================= Searchbar Banner ======================== --> */}
      <div className="featured-slick">
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={index} className="dlf-flew">
                        <a href={img} className="mfp-gallery">
                            <img src={img} className="img-fluid mx-auto" alt="" />
                        </a>
                    </div>
                ))}
            </Slider>
            <div className="ftl-diope">
                <a href="javascript:void(0);" className="btn bg-white text-dark ft-medium rounded">See 20+ Photos</a>
            </div>
            <div className="Goodup-ops-bhri">
                <div className="Goodup-lkp-flex d-flex align-items-start justify-content-start">
                    <div className="Goodup-lkp-caption ps-3">
                        <div className="Goodup-lkp-title">
                            <h1 className="text-light mb-0 ft-bold">Sake Cafe Sushi Bar & Grill</h1>
                        </div>
                        <div className="Goodup-ft-first">
                            <div className="Goodup-rating">
                                <div className="Goodup-rates">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                            </div>
                            <div className="Goodup-price-range">
                                <span className="ft-medium text-light">34 Reviews</span>
                                <div className="d-inline ms-2">
                                    <span className="active"><i className="fas fa-dollar-sign"></i></span>
                                    <span className="active"><i className="fas fa-dollar-sign"></i></span>
                                    <span className="active"><i className="fas fa-dollar-sign"></i></span>
                                </div>
                            </div>
                        </div>
                        <div className="d-block mt-3">
                            <div className="list-lioe">
                                <div className="list-lioe-single">
                                    <span className="ft-medium text-info"><i className="fas fa-check-circle me-1"></i>Claimed</span>
                                </div>
                                <div className="list-lioe-single ms-2 ps-3 seperate">
                                    <a href="javascript:void(0);" className="text-light ft-medium">Cardiologist</a>,<a href="javascript:void(0);" className="text-light ft-medium ms-1">Neurologist</a>,<a href="javascript:void(0);" className="text-light ft-medium ms-1">Pulmonologist</a>,<a href="javascript:void(0);" className="text-light ft-medium ms-1">Orthopedic Surgeon</a>
                                </div>
                            </div>
                        </div>
                        <div className="d-block mt-1">
                            <div className="list-lioe">
                                <div className="list-lioe-single">
                                    <span className="ft-medium text-danger">Closed</span>
                                    <span className="text-light ft-medium ms-2">11:00 AM - 12:00 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
			{/* <!-- ======================= Searchbar Banner ======================== --> */}
			
			{/* <!-- ============================ Listing Details Start ================================== --> */}
			<section class="gray py-5 position-relative">
				<div class="container">
					<div class="row">
						<div class="col-xl-8 col-lg-8 col-md-12 col-sm-12">
							
							{/* <!-- About The Business --> */}
							<div class="bg-white rounded mb-4">
								<div class="jbd-01 px-4 py-4">
									<div class="jbd-details">
										<h5 class="ft-bold fs-lg">About the Business</h5>
										
										<div class="d-block mt-3">
											<p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur</p>
											<p class="p-0 m-0">Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur</p>
										</div>
									</div>
									
								</div>
							</div>
							
							{/* <!-- Amenities and More --> */}
							<div class="bg-white rounded mb-4">
								<div class="jbd-01 px-4 py-4">
									<div class="jbd-details">
										<h5 class="ft-bold fs-lg">Amenities and More</h5>
										
										<div class="Goodup-all-features-list mt-3">
											<ul>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="" alt="" /><span>Health Score 8.7 / 10</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Offers Delivery</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Offers Takeout</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Reservations</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Staff wears masks</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Vegan Options</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Vegetarian Options</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Accepts Credit Cards</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Casual</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Moderate Noise</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Offers Catering</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Good for Groups</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Good For Kids</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Good for Breakfast</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Brunch, Lunch, Dinner</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Private Lot Parking</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Waiter Service</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Free Wi-Fi</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Beer & Wine</span></div></li>
												<li><div class="Goodup-afl-pace"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Drive-Thru</span></div></li>
												<li><div class="Goodup-afl-pace deactive"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Wheelchair Accessible</span></div></li>
												<li><div class="Goodup-afl-pace deactive"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>TV Services</span></div></li>
												<li><div class="Goodup-afl-pace deactive"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Outdoor Seating</span></div></li>
												<li><div class="Goodup-afl-pace deactive"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Happy Hour</span></div></li>
												<li><div class="Goodup-afl-pace deactive"><img src="assets/img/verify.svg" class="img-fluid" alt="" /><span>Pets Allow</span></div></li>
											</ul>
										</div>
									</div>
									
								</div>
							</div>
							
							{/* <!-- Frequently Asked Questions --> */}
							<div class="d-block mb-2">
								<div class="jbd-01 py-2">
									<div class="jbd-details">
										<h5 class="ft-bold fs-lg">Frequently Asked Questions</h5>
										
										<div class="d-block mt-3">
											<div id="accordion2" class="accordion">
												<div class="card">
													<div class="card-header" id="h7">
													  <h5 class="mb-0">
														<button class="btn btn-link" data-bs-toggle="collapse" data-bs-target="#ord7" aria-expanded="true" aria-controls="ord7">
															Can I get GoodUP listing for free?
														</button>
													  </h5>
													</div>

													<div id="ord7" class="collapse show" aria-labelledby="h7" data-parent="#accordion2">
													  <div class="card-body">
														Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
													  </div>
													</div>
												</div>
												<div class="card">
													<div class="card-header" id="h8">
													  <h5 class="mb-0">
														<button class="btn btn-link collapsed" data-bs-toggle="collapse" data-bs-target="#ord8" aria-expanded="false" aria-controls="ord8">
															How to Permanently Delete Files From Windows?
														</button>
													  </h5>
													</div>
													<div id="ord8" class="collapse" aria-labelledby="h8" data-parent="#accordion2">
													  <div class="card-body">
														Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
													  </div>
													</div>
												</div>
												<div class="card">
													<div class="card-header" id="h9">
													  <h5 class="mb-0">
														<button class="btn btn-link collapsed" data-bs-toggle="collapse" data-bs-target="#ord9" aria-expanded="false" aria-controls="ord9">
															Can I get GoodUP listing for free?
														</button>
													  </h5>
													</div>
													<div id="ord9" class="collapse" aria-labelledby="h9" data-parent="#accordion2">
													  <div class="card-body">
														Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
													  </div>
													</div>
												</div>
												<div class="card">
													<div class="card-header" id="h4">
													  <h5 class="mb-0">
														<button class="btn btn-link collapsed" data-bs-toggle="collapse" data-bs-target="#ord4" aria-expanded="false" aria-controls="ord4">
															For GoodUp which lisence is better for business purpose?
														</button>
													  </h5>
													</div>

													<div id="ord4" class="collapse" aria-labelledby="h4" data-parent="#accordion2">
													  <div class="card-body">
														Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
													  </div>
													</div>
												</div>
											</div>
										</div>
									</div>
									
								</div>
							</div>
							
							
							{/* <!-- Recommended Reviews --> */}
							<div class="bg-white rounded mb-4">
								<div class="jbd-01 px-4 py-4">
									<div class="jbd-details mb-4">
										<h5 class="ft-bold fs-lg">Recommended Reviews</h5>
										<div class="reviews-comments-wrap">
										
											{/* <!-- reviews-comments-item -->   */}
											<div class="reviews-comments-item">
												<div class="review-comments-avatar">
													<img src="assets/img/t-1.png" class="img-fluid" alt="" /> 
												</div>
												<div class="reviews-comments-item-text">
													<h4><a href="#">Kayla E. Claxton</a><span class="reviews-comments-item-date"><i class="ti-calendar theme-cl me-1"></i>27 Oct 2019</span></h4>
													<span class="agd-location"><i class="lni lni-map-marker me-1"></i>Sastri Nagar, New Delhi</span>
													<div class="listing-rating high"><i class="fas fa-star active"></i><i class="fas fa-star active"></i><i class="fas fa-star active"></i><i class="fas fa-star active"></i><i class="fas fa-star active"></i></div>
													<div class="clearfix"></div>
													<p>" Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. "</p>
													<div class="pull-left reviews-reaction">
														<a href="#" class="comment-like active"><i class="ti-thumb-up"></i> 12</a>
														<a href="#" class="comment-dislike active"><i class="ti-thumb-down"></i> 1</a>
														<a href="#" class="comment-love active"><i class="ti-heart"></i> 07</a>
													</div>
												</div>
											</div>
											{/* <!--reviews-comments-item end-->   */}
											
											{/* <!-- reviews-comments-item -->   */}
											<div class="reviews-comments-item">
												<div class="review-comments-avatar">
													<img src="assets/img/t-2.png" class="img-fluid" alt="" /> 
												</div>
												<div class="reviews-comments-item-text">
													<h4><a href="#">Amy M. Taylor</a><span class="reviews-comments-item-date"><i class="ti-calendar theme-cl me-1"></i>2 Nov May 2019</span></h4>
													<span class="agd-location"><i class="lni lni-map-marker me-1"></i>Pritampura, New Delhi</span>
													<div class="listing-rating mid"><i class="fas fa-star active"></i><i class="fas fa-star active"></i><i class="fas fa-star active"></i><i class="fas fa-star active"></i><i class="fas fa-star"></i></div>
													<div class="clearfix"></div>
													<p>" Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. "</p>
													<div class="pull-left reviews-reaction">
														<a href="#" class="comment-like active"><i class="ti-thumb-up"></i> 12</a>
														<a href="#" class="comment-dislike active"><i class="ti-thumb-down"></i> 1</a>
														<a href="#" class="comment-love active"><i class="ti-heart"></i> 07</a>
													</div>
												</div>
											</div>
											{/* <!--reviews-comments-item end--> */}
											
											{/* <!-- reviews-comments-item -->   */}
											<div class="reviews-comments-item">
												<div class="review-comments-avatar">
													<img src="assets/img/t-3.png" class="img-fluid" alt="" /> 
												</div>
												<div class="reviews-comments-item-text">
													<h4><a href="#">Susan C. Daggett</a><span class="reviews-comments-item-date"><i class="ti-calendar theme-cl me-1"></i>10 Nov 2019</span></h4>
													<span class="agd-location"><i class="lni lni-map-marker me-1"></i>Denver, United State</span>
													<div class="listing-rating good"><i class="fas fa-star active"></i><i class="fas fa-star active"></i><i class="fas fa-star active"></i><i class="fas fa-star active"></i><i class="fas fa-star"></i></div>
													<div class="clearfix"></div>
													<p>" Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. "</p>
													<div class="pull-left reviews-reaction">
														<a href="#" class="comment-like active"><i class="ti-thumb-up"></i> 12</a>
														<a href="#" class="comment-dislike active"><i class="ti-thumb-down"></i> 1</a>
														<a href="#" class="comment-love active"><i class="ti-heart"></i> 07</a>
													</div>
												</div>
											</div>
											{/* <!--reviews-comments-item end--> */}
											
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
							
							{/* <!-- Location & Hours --> */}
							<div class="bg-white rounded mb-4">
								<div class="jbd-01 px-4 py-4">
									<div class="jbd-details mb-4">
										<h5 class="ft-bold fs-lg">Location & Hours</h5>
										<div class="Goodup-lot-wrap d-block">
											<div class="row g-4">
												<div class="col-xl-6 col-lg-6 col-md-12">
													<div class="list-map-lot">
														<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.0148908503734!2d80.97350361499701!3d26.871267983145383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd9a9f6d1727%3A0xb87eabf63f7e4cee!2sCafe%20Repertwahr!5e0!3m2!1sen!2sin!4v1649059491407!5m2!1sen!2sin" width="100%" height="250" style={{border:'0'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
													</div>
													<div class="list-map-capt">
														<div class="lio-pact"><span class="ft-medium text-info">2919 N Flores St</span></div>
														<div class="lio-pact"><span class="hkio-oilp ft-bold">San Antonio, TX 78212</span></div>
														<div class="lio-pact"><p class="ft-medium">Alta Vista</p></div>
													</div>
												</div>
												<div class="col-xl-6 col-lg-6 col-md-12">
													<table class="table table-borderless">
														<tbody>
															<tr>
																<th scope="row">Mon</th>
																<td>5:00 PM - 8:30 PM</td>
																<td class="text-success">Open now</td>
															</tr>
															<tr>
																<td>Tue</td>
																<td>5:00 PM - 8:30 PM</td>
																<td></td>
															</tr>
															<tr>
																<td>Wed</td>
																<td>5:00 PM - 8:30 PM</td>
																<td></td>
															</tr>
															<tr>
																<td>Thu</td>
																<td>5:00 PM - 8:30 PM</td>
																<td></td>
															</tr>
															<tr>
																<td>Fri</td>
																<td>5:00 PM - 6:30 PM</td>
																<td></td>
															</tr>
															<tr>
																<td>Sat</td>
																<td>Closed</td>
																<td></td>
															</tr>
															<tr>
																<td>Sun</td>
																<td>Closed</td>
																<td></td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							
							
							{/* <!-- Drop Your Review --> */}
							<div class="bg-white rounded mb-4">
								<div class="jbd-01 px-4 py-4">
									<div class="jbd-details mb-4">
										<h5 class="ft-bold fs-lg">Drop Your Review</h5>
										<div class="review-form-box form-submit mt-3">
											<form>
												<div class="row">
													
													<div class="col-lg-12 col-md-12 col-sm-12">
														<div class="form-group mb-3">
															<label class="ft-medium small mb-1">Choose Rate</label>
															<select class="form-control rounded">
																<option>Choose Rating</option>
																<option>1 Star</option>
																<option>2 Star</option>
																<option>3 Star</option>
																<option>4 Star</option>
																<option>5 Star</option>
															</select>
														</div>
													</div>
													
													<div class="col-lg-6 col-md-6 col-sm-12">
														<div class="form-group mb-3">
															<label class="ft-medium small mb-1">Name</label>
															<input class="form-control rounded" type="text" placeholder="Your Name" />
														</div>
													</div>
													
													<div class="col-lg-6 col-md-6 col-sm-12">
														<div class="form-group mb-3">
															<label class="ft-medium small mb-1">Email</label>
															<input class="form-control rounded" type="email" placeholder="Your Email" />
														</div>
													</div>
													
													<div class="col-lg-12 col-md-12 col-sm-12">
														<div class="form-group mb-3">
															<label class="ft-medium small mb-1">Review</label>
															<textarea class="form-control rounded ht-140" placeholder="Review"></textarea>
														</div>
													</div>
													
													<div class="col-lg-12 col-md-12 col-sm-12">
														<div class="form-group">
															<button type="submit" class="btn theme-bg text-light rounded">Submit Review</button>
														</div>
													</div>
													
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
							
						</div>
						
						{/* <!-- Sidebar --> */}
						<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12">
							
							{/* <!-- Make Appointment --> */}
							<div class="jb-apply-form bg-white rounded py-4 px-4 border mb-4">
								<h4 class="ft-bold mb-1">Make An Appointment</h4>
								
								<div class="Goodup-boo-space mt-3">
									<div class="row">
										<div class="col-lg-12 col-md-12 col-sm-12 col-12">
											<div class="form-group mb-3">
												<label class="ft-medium small mb-1">Select Date</label>
												<div class="cld-box">
													<i class="ti-calendar"></i>
													<input type="text" name="checkin" class="form-control" value="10/24/2020" placeholder="Check In" />
												</div>
											</div>
										</div>
										<div class="col-lg-12 col-md-12 col-sm-12 col-12">
											<div class="form-group mb-3">
												<label class="ft-medium small mb-1">Name</label>
												<input type="text" class="border form-control rounded ps-3" />
											</div>
										</div>
										<div class="col-lg-12 col-md-12 col-sm-12 col-12">
											<div class="form-group mb-3">
												<label class="ft-medium small mb-1">Email</label>
												<input type="text" class="border form-control rounded ps-3" />
											</div>
										</div>
										<div class="col-lg-12 col-md-12 col-sm-12 col-12">
											<div class="form-group mb-3">
												<label class="ft-medium small mb-1">Phone</label>
												<input type="text" class="border form-control rounded ps-3" />
											</div>
										</div>
										
										<div class="col-lg-12 col-md-12 col-sm-12">
											<a href="#" class="btn text-light rounded full-width theme-bg ft-medium">Make Appointment</a>
										</div>
									</div>
								</div>
							</div>
							
							{/* <!-- Business Info --> */}
							<div class="jb-apply-form bg-white rounded py-4 px-4 mb-4">
								<div class="uli-list-info">
									<ul>
										
										<li>
											<div class="list-uiyt">
												<div class="list-iobk"><i class="fas fa-globe"></i></div>
												<div class="list-uiyt-capt"><h5>Live Site</h5><p>https://www.Goodup.com/</p></div>
											</div>
										</li>
										
										<li>
											<div class="list-uiyt">
												<div class="list-iobk"><i class="fas fa-envelope"></i></div>
												<div class="list-uiyt-capt"><h5>Drop a Mail</h5><p>support@Hover.com</p></div>
											</div>
										</li>
										
										<li>
											<div class="list-uiyt">
												<div class="list-iobk"><i class="fas fa-phone"></i></div>
												<div class="list-uiyt-capt"><h5>Call Us</h5><p>(210) 659 584 756</p></div>
											</div>
										</li>
										<li>
											<div class="list-uiyt">
												<div class="list-iobk"><i class="fas fa-map-marker-alt"></i></div>
												<div class="list-uiyt-capt"><h5>Get Directions</h5><p>2919 N Flores St San Antonio, TX 78212</p></div>
											</div>
										</li>
										
									</ul>
								</div>
							</div>

							
							<div class="row g-3 mb-3">
								<div class="col-4"><a href="javascript:void(0);" class="adv-btn full-width"><i class="fas fa-camera"></i>Add Phoos</a></div>
								<div class="col-4"><a href="javascript:void(0);" class="adv-btn full-width"><i class="fas fa-share"></i>Share</a></div>
								<div class="col-4"><a href="javascript:void(0);" class="adv-btn full-width"><i class="fas fa-heart"></i>Save</a></div>
							</div>
							
						</div>
						
					</div>
				</div>
			</section>
			{/* <!-- ============================ Listing Details End ================================== --> */}
			
			{/* <!-- ======================= Related Listings ======================== --> */}
			<section class="space min">
				<div class="container">
				
					<div class="row justify-content-center">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
							<div class="sec_title position-relative text-center mb-5">
								<h6 class="theme-cl mb-0">Related Listing</h6>
								<h2 class="ft-bold">Recently Viewed Listing</h2>
							</div>
						</div>
					</div>
					
					{/* <!-- row --> */}
					<div class="row justify-content-center">
					
						{/* <!-- Single --> */}
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
							<div class="Goodup-grid-wrap">
								<div class="Goodup-grid-upper">
									<div class="Goodup-pos ab-left">
										<div class="Goodup-status close me-2">Closed</div>
									</div>
									<div class="Goodup-grid-thumb">
										<a href="single-listing-detail-2.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-5.jpg" class="img-fluid" alt="" /></a>
									</div>
									<div class="Goodup-rating overlay">
										<div class="Goodup-pr-average high">4.8</div>
										<div class="Goodup-aldeio">
											<div class="Goodup-rates">
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
											</div>
											<div class="Goodup-all-review"><span>46 Reviews</span></div>
										</div>
									</div>
								</div>
								<div class="Goodup-grid-fl-wrap">
									<div class="Goodup-caption px-3 py-2">
										<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-1.png" class="img-fluid circle" alt="" /></a></div>
										<h4 class="mb-0 ft-medium medium"><a href="single-listing-detail-2.html" class="text-dark fs-md">Pretty Woman Smart Batra</a></h4>
										<div class="Goodup-location"><i class="fas fa-map-marker-alt me-1 theme-cl"></i>Munirka, New Delhi</div>
										<div class="Goodup-middle-caption mt-3">
											<p>At vero eos et accusamus et iusto odio dignissimos ducimus</p>
										</div>
									</div>
									<div class="Goodup-grid-footer py-2 px-3">
										<div class="Goodup-ft-first">
											<a href="half-map-search-2.html" class="Goodup-cats-wrap"><div class="cats-ico bg-2"><i class="lni lni-slim"></i></div><span class="cats-title">Beauty &amp; Makeup</span></a>
										</div>
										<div class="Goodup-ft-last">
											<div class="Goodup-inline">
												<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-envelope position-absolute"></i></button></div>
												<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						{/* <!-- Single --> */}
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
							<div class="Goodup-grid-wrap">
								<div class="Goodup-grid-upper">
									<div class="Goodup-pos ab-left">
										<div class="Goodup-status open me-2">Open</div>
										<div class="Goodup-featured-tag">Featured</div>
									</div>
									<div class="Goodup-grid-thumb">
										<a href="single-listing-detail-2.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-6.jpg" class="img-fluid" alt="" /></a>
									</div>
									<div class="Goodup-rating overlay">
										<div class="Goodup-pr-average high">4.1</div>
										<div class="Goodup-aldeio">
											<div class="Goodup-rates">
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
											</div>
											<div class="Goodup-all-review"><span>17 Reviews</span></div>
										</div>
									</div>
								</div>
								<div class="Goodup-grid-fl-wrap">
									<div class="Goodup-caption px-3 py-2">
										<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-2.png" class="img-fluid circle" alt="" /></a></div>
										<h4 class="mb-0 ft-medium medium"><a href="single-listing-detail-2.html" class="text-dark fs-md">The Sartaj Blue Night</a></h4>
										<div class="Goodup-location"><i class="fas fa-map-marker-alt me-1 theme-cl"></i>Sastri Nagar, New Delhi</div>
										<div class="Goodup-middle-caption mt-3">
											<p>At vero eos et accusamus et iusto odio dignissimos ducimus</p>
										</div>
									</div>
									<div class="Goodup-grid-footer py-2 px-3">
										<div class="Goodup-ft-first">
											<a href="half-map-search-2.html" class="Goodup-cats-wrap"><div class="cats-ico bg-3"><i class="lni lni-cake"></i></div><span class="cats-title">Night Party</span></a>
										</div>
										<div class="Goodup-ft-last">
											<div class="Goodup-inline">
												<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-envelope position-absolute"></i></button></div>
												<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						{/* <!-- Single --> */}
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
							<div class="Goodup-grid-wrap">
								<div class="Goodup-grid-upper">
									<div class="Goodup-pos ab-left">
										<div class="Goodup-status open me-2">Open</div>
									</div>
									<div class="Goodup-grid-thumb">
										<a href="single-listing-detail-2.html" class="d-block text-center m-auto"><img src="assets/img/listing/l-7.jpg" class="img-fluid" alt="" /></a>
									</div>
									<div class="Goodup-rating overlay">
										<div class="Goodup-pr-average mid">3.6</div>
										<div class="Goodup-aldeio">
											<div class="Goodup-rates">
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
											</div>
											<div class="Goodup-all-review"><span>30 Reviews</span></div>
										</div>
									</div>
								</div>
								<div class="Goodup-grid-fl-wrap">
									<div class="Goodup-caption px-3 py-2">
										<div class="Goodup-author"><a href="author-detail.html"><img src="assets/img/t-3.png" class="img-fluid circle" alt="" /></a></div>
										<h4 class="mb-0 ft-medium medium"><a href="single-listing-detail-2.html" class="text-dark fs-md">Pizza Delight Cafe Shop</a></h4>
										<div class="Goodup-location"><i class="fas fa-map-marker-alt me-1 theme-cl"></i>102 Satirio, Canada</div>
										<div class="Goodup-middle-caption mt-3">
											<p>At vero eos et accusamus et iusto odio dignissimos ducimus</p>
										</div>
									</div>
									<div class="Goodup-grid-footer py-2 px-3">
										<div class="Goodup-ft-first">
											<a href="half-map-search-2.html" class="Goodup-cats-wrap"><div class="cats-ico bg-4"><i class="lni lni-coffee-cup"></i></div><span class="cats-title">Coffee &amp; Bars</span></a>
										</div>
										<div class="Goodup-ft-last">
											<div class="Goodup-inline">
												<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-envelope position-absolute"></i></button></div>
												<div class="Goodup-bookmark-btn"><button type="button"><i class="lni lni-heart-filled position-absolute"></i></button></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						
					</div>
					{/* <!-- row --> */}
					
				</div>
			</section>
			{/* <!-- ======================= Related Listings ======================== --> */}
    </div>
  )
}

export default DoctorSinglePage
