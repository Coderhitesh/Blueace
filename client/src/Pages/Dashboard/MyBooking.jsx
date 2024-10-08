import React, { useEffect } from 'react'

function MyBooking() {
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    },[])
  return (
    <>
      <div class="goodup-dashboard-content">
					<div class="dashboard-tlbar d-block mb-5">
						<div class="row">
							<div class="colxl-12 col-lg-12 col-md-12">
								<h1 class="ft-medium">My Bookings</h1>
								<nav aria-label="breadcrumb">
									<ol class="breadcrumb">
										<li class="breadcrumb-item text-muted"><a href="#">Home</a></li>
										<li class="breadcrumb-item text-muted"><a href="#">Dashboard</a></li>
										<li class="breadcrumb-item"><a href="#" class="theme-cl">My Bookings</a></li>
									</ol>
								</nav>
							</div>
						</div>
					</div>
					
					<div class="dashboard-widg-bar d-block">
						<div class="row">
							<div class="col-xl-12 col-lg-12">
								<div class="dashboard-list-wraps bg-white rounded mb-4">
									<div class="dashboard-list-wraps-head br-bottom py-3 px-3">
										<div class="dashboard-list-wraps-flx">
											<h4 class="mb-0 ft-medium fs-md"><i class="fas fa-shopping-basket me-2 theme-cl fs-sm"></i>All Bookings</h4>	
										</div>
									</div>
									
									<div class="dashboard-list-wraps-body py-3 px-3">
										<div class="dashboard-bookings-wraps">
											
											{/* <!-- Single booking List --> */}
											<div class="dsd-single-bookings-wraps">
												<div class="dsd-single-book-thumb"><img src="assets/img/t-1.png" class="img-fluid circle" alt="" /></div>	
												<div class="dsd-single-book-caption">
													<div class="dsd-single-book-title"><h5>Steven I. Gonzales<span class="bko-dates">10 July 2021</span></h5></div>
													<div class="ico-content">
														<ul>
															<li><div class="px-2 py-1 medium bg-light-success rounded text-success">Paid</div></li>
															<li><div class="px-2 py-1 medium bg-light-danger rounded text-danger">Pending</div></li>
														</ul>
													</div>
													<div class="dsd-single-descr">
														<div class="dsd-single-item"><span class="dsd-item-title">Listing Item:</span><span class="dsd-item-info">Snow Valley Resorts</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Booking Date:</span><span class="dsd-item-info">10 July 2022 - 17 July 2022</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Member:</span><span class="dsd-item-info">2 Adults, 3 Child</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Mail:</span><span class="dsd-item-info">Stevenmail@gmail.com</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Phone:</span><span class="dsd-item-info">(20) 256 458 7596</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Ammount:</span><span class="dsd-item-info">$2,240</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Payment:</span><span class="dsd-item-info">Via Credit Card</span></div>
													</div>
													<div class="dsd-single-book-footer">
														<a href="javascript:void(0);" class="btn btn-aprd mr-1"><i class="fas fa-check-circle me-1"></i>Approved</a>
														<a href="javascript:void(0);" class="btn btn-reject mr-1"><i class="fas fa-trash me-1"></i>Reject</a>
														<a href="javascript:void(0);" class="btn btn-message"><i class="fas fa-envelope me-1"></i>Message</a>
													</div>
												</div>
											</div>
											
											{/* <!-- Single booking List --> */}
											<div class="dsd-single-bookings-wraps">
												<div class="dsd-single-book-thumb"><img src="assets/img/t-2.png" class="img-fluid circle" alt="" /></div>	
												<div class="dsd-single-book-caption">
													<div class="dsd-single-book-title"><h5>James M. Gonzalez<span class="bko-dates">06 May 2021</span></h5></div>
													<div class="ico-content">
														<ul>
															<li><div class="px-2 py-1 medium bg-light-success rounded text-success">Paid</div></li>
															<li><div class="px-2 py-1 medium bg-light-info rounded text-info">Confirmed</div></li>
														</ul>
													</div>
													<div class="dsd-single-descr">
														<div class="dsd-single-item"><span class="dsd-item-title">Listing Item:</span><span class="dsd-item-info">Snow Valley Resorts</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Booking Date:</span><span class="dsd-item-info">10 July 2022 - 17 July 2022</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Member:</span><span class="dsd-item-info">2 Adults, 3 Child</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Mail:</span><span class="dsd-item-info">Stevenmail@gmail.com</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Phone:</span><span class="dsd-item-info">(20) 256 458 7596</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Ammount:</span><span class="dsd-item-info">$2,240</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Payment:</span><span class="dsd-item-info">Via Credit Card</span></div>
													</div>
													<div class="dsd-single-book-footer">
														<a href="javascript:void(0);" class="btn btn-aprd mr-1"><i class="fas fa-check-circle me-1"></i>Approved</a>
														<a href="javascript:void(0);" class="btn btn-reject mr-1"><i class="fas fa-trash me-1"></i>Reject</a>
														<a href="javascript:void(0);" class="btn btn-message"><i class="fas fa-envelope me-1"></i>Message</a>
													</div>
												</div>
											</div>
											
											{/* <!-- Single booking List --> */}
											<div class="dsd-single-bookings-wraps">
												<div class="dsd-single-book-thumb"><img src="assets/img/t-3.png" class="img-fluid circle" alt="" /></div>	
												<div class="dsd-single-book-caption">
													<div class="dsd-single-book-title"><h5>Diane J. Mack<span class="bko-dates">17 Apr 2022</span></h5></div>
													<div class="ico-content">
														<ul>
															<li><div class="px-2 py-1 medium bg-light-warning rounded text-warning">Unpaid</div></li>
															<li><div class="px-2 py-1 medium bg-light-danger rounded text-danger">Pending</div></li>
														</ul>
													</div>
													<div class="dsd-single-descr">
														<div class="dsd-single-item"><span class="dsd-item-title">Listing Item:</span><span class="dsd-item-info">Snow Valley Resorts</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Booking Date:</span><span class="dsd-item-info">10 July 2022 - 17 July 2022</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Member:</span><span class="dsd-item-info">2 Adults, 3 Child</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Mail:</span><span class="dsd-item-info">Stevenmail@gmail.com</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Phone:</span><span class="dsd-item-info">(20) 256 458 7596</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Ammount:</span><span class="dsd-item-info">$2,240</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Payment:</span><span class="dsd-item-info">Via Credit Card</span></div>
													</div>
													<div class="dsd-single-book-footer">
														<a href="javascript:void(0);" class="btn btn-aprd mr-1"><i class="fas fa-check-circle me-1"></i>Approved</a>
														<a href="javascript:void(0);" class="btn btn-reject mr-1"><i class="fas fa-trash me-1"></i>Reject</a>
														<a href="javascript:void(0);" class="btn btn-message"><i class="fas fa-envelope me-1"></i>Message</a>
													</div>
												</div>
											</div>
											
											{/* <!-- Single booking List --> */}
											<div class="dsd-single-bookings-wraps">
												<div class="dsd-single-book-thumb"><img src="assets/img/t-4.png" class="img-fluid circle" alt="" /></div>	
												<div class="dsd-single-book-caption">
													<div class="dsd-single-book-title"><h5>Maria J. Barber<span class="bko-dates">10 July 2021</span></h5></div>
													<div class="ico-content">
														<ul>
															<li><div class="px-2 py-1 medium bg-light-success rounded text-success">Paid</div></li>
															<li><div class="px-2 py-1 medium bg-light-danger rounded text-danger">Pending</div></li>
														</ul>
													</div>
													<div class="dsd-single-descr">
														<div class="dsd-single-item"><span class="dsd-item-title">Listing Item:</span><span class="dsd-item-info">Snow Valley Resorts</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Booking Date:</span><span class="dsd-item-info">10 July 2022 - 17 July 2022</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Member:</span><span class="dsd-item-info">2 Adults, 3 Child</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Mail:</span><span class="dsd-item-info">Stevenmail@gmail.com</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Phone:</span><span class="dsd-item-info">(20) 256 458 7596</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Ammount:</span><span class="dsd-item-info">$2,240</span></div>
														<div class="dsd-single-item"><span class="dsd-item-title">Payment:</span><span class="dsd-item-info">Via Credit Card</span></div>
													</div>
													<div class="dsd-single-book-footer">
														<a href="javascript:void(0);" class="btn btn-aprd mr-1"><i class="fas fa-check-circle me-1"></i>Approved</a>
														<a href="javascript:void(0);" class="btn btn-reject mr-1"><i class="fas fa-trash me-1"></i>Reject</a>
														<a href="javascript:void(0);" class="btn btn-message"><i class="fas fa-envelope me-1"></i>Message</a>
													</div>
												</div>
											</div>
										
										</div>
									</div>
								</div>
							</div>
						</div>
							
					</div>
		
				</div>
    </>
  )
}

export default MyBooking
