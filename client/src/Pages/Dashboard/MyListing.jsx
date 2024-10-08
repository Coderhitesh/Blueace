import React, { useEffect } from 'react';

function MyListing() {
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    },[])
    return (
        <>
            {/* ======================= dashboard Detail ======================== */}
            <div className="goodup-dashboard-content">
                    <div className="dashboard-tlbar d-block mb-5">
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <h1 className="ft-medium">Manage Listings</h1>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
                                        <li className="breadcrumb-item text-muted"><a href="#">Dashboard</a></li>
                                        <li className="breadcrumb-item"><a href="#" className="theme-cl">Manage Listings</a></li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-widg-bar d-block">
                        <div className="row">
                            <div className="col-xl-12 col-lg-12">
                                <div className="dashboard-list-wraps bg-white rounded mb-4">
                                    <div className="dashboard-list-wraps-head br-bottom py-3 px-3">
                                        <div className="dashboard-list-wraps-flx">
                                            <h4 className="mb-0 ft-medium fs-md">
                                                <i className="fa fa-file-alt me-2 theme-cl fs-sm"></i>My Listings
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="dashboard-list-wraps-body py-3 px-3">
                                        <div className="dashboard-listing-wraps">
                                            {/* Single Listing Item */}
                                            <div className="dsd-single-listing-wraps">
                                                <div className="dsd-single-lst-thumb">
                                                    <img src="assets/img/listing/l-1.jpg" className="img-fluid" alt="" />
                                                </div>
                                                <div className="dsd-single-lst-caption">
                                                    <div className="dsd-single-lst-title">
                                                        <h5>Rajwara Marriage Home</h5>
                                                    </div>
                                                    <span className="agd-location">
                                                        <i className="lni lni-map-marker me-1"></i>Sastri Nagar, New Delhi
                                                    </span>
                                                    <div className="ico-content">
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
                                                                <span className="ft-medium">34 Reviews</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="dsd-single-lst-footer">
                                                        <a href="javascript:void(0);" className="btn btn-edit mr-1">
                                                            <i className="fas fa-edit me-1"></i>Edit
                                                        </a>
                                                        <a href="javascript:void(0);" className="btn btn-view mr-1">
                                                            <i className="fas fa-eye me-1"></i>View
                                                        </a>
                                                        <a href="javascript:void(0);" className="btn btn-delete">
                                                            <i className="fas fa-trash me-1"></i>Delete
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <!-- Single Listing Item --> */}
											<div class="dsd-single-listing-wraps">
												<div class="dsd-single-lst-thumb"><img src="assets/img/listing/l-2.jpg" class="img-fluid" alt="" /></div>	
												<div class="dsd-single-lst-caption">
													<div class="dsd-single-lst-title"><h5>Decathlon Sport House</h5></div>
													<span class="agd-location"><i class="lni lni-map-marker me-1"></i>Sastri Nagar, New Delhi</span>
													<div class="ico-content">
														<div class="Goodup-ft-first">
															<div class="Goodup-rating">
																<div class="Goodup-rates">
																	<i class="fas fa-star"></i>
																	<i class="fas fa-star"></i>
																	<i class="fas fa-star"></i>
																	<i class="fas fa-star"></i>
																	<i class="fas fa-star"></i>
																</div>
															</div>
															<div class="Goodup-price-range">
																<span class="ft-medium">34 Reviews</span>
															</div>
														</div>	
													</div>
													<div class="dsd-single-lst-footer">
														<a href="javascript:void(0);" class="btn btn-edit mr-1"><i class="fas fa-edit me-1"></i>Edit</a>
														<a href="javascript:void(0);" class="btn btn-view mr-1"><i class="fas fa-eye me-1"></i>View</a>
														<a href="javascript:void(0);" class="btn btn-delete"><i class="fas fa-trash me-1"></i>Delete</a>
													</div>
												</div>
											</div>
											
											{/* <!-- Single Listing Item --> */}
											<div class="dsd-single-listing-wraps">
												<div class="dsd-single-lst-thumb"><img src="assets/img/listing/l-3.jpg" class="img-fluid" alt="" /></div>	
												<div class="dsd-single-lst-caption">
													<div class="dsd-single-lst-title"><h5>The Gold Hotel Lalit</h5></div>
													<span class="agd-location"><i class="lni lni-map-marker me-1"></i>Sastri Nagar, New Delhi</span>
													<div class="ico-content">
														<div class="Goodup-ft-first">
															<div class="Goodup-rating">
																<div class="Goodup-rates">
																	<i class="fas fa-star"></i>
																	<i class="fas fa-star"></i>
																	<i class="fas fa-star"></i>
																	<i class="fas fa-star"></i>
																	<i class="fas fa-star"></i>
																</div>
															</div>
															<div class="Goodup-price-range">
																<span class="ft-medium">34 Reviews</span>
															</div>
														</div>	
													</div>
													<div class="dsd-single-lst-footer">
														<a href="javascript:void(0);" class="btn btn-edit mr-1"><i class="fas fa-edit me-1"></i>Edit</a>
														<a href="javascript:void(0);" class="btn btn-view mr-1"><i class="fas fa-eye me-1"></i>View</a>
														<a href="javascript:void(0);" class="btn btn-delete"><i class="fas fa-trash me-1"></i>Delete</a>
													</div>
												</div>
											</div>

                                            {/* You can repeat similar blocks for other listing items */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}

export default MyListing;
