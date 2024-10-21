import React, { useEffect } from 'react'

function DashboardContent({ userData }) {
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}, [])

	return (
		<>
			<div className="goodup-dashboard-content">
				<div className="dashboard-tlbar d-block mb-5">
					<div className="row">
						<div className="colxl-12 col-lg-12 col-md-12">
							<h1 className="ft-medium">Hello, {userData.FullName}</h1>
							<nav aria-label="breadcrumb">
								<ol className="breadcrumb">
									<li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
									<li className="breadcrumb-item"><a href="#" className="theme-cl">Dashboard</a></li>
								</ol>
							</nav>
						</div>
					</div>
				</div>

				<div className="dashboard-widg-bar d-block">
					<div className="row">
						<div className="col-xl-12 col-lg-12 col-md-12 mb-3">
							<div className="alert bg-inverse text-light d-flex align-items-center" role="alert">
								<p className="p-0 m-0 ft-medium full-width">Your listing <a href="#" className="text-success">Wedding Willa Resort</a> has been approved!</p>
								<button type="button" className="btn-close text-light" data-bs-dismiss="alert" aria-label="Close"></button>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
							<div className="dsd-boxed-widget py-5 px-4 bg-danger rounded">
								<h2 className="ft-medium mb-1 fs-xl text-light count">46</h2>
								<p className="p-0 m-0 text-light fs-md">Active Listings</p>
								<i className="lni lni-empty-file"></i>
							</div>
						</div>
						<div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
							<div className="dsd-boxed-widget py-5 px-4 bg-success rounded">
								<h2 className="ft-medium mb-1 fs-xl text-light count">2615</h2>
								<p className="p-0 m-0 text-light fs-md">Views Listing</p>
								<i className="lni lni-eye"></i>
							</div>
						</div>
						<div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
							<div className="dsd-boxed-widget py-5 px-4 bg-warning rounded">
								<h2 className="ft-medium mb-1 fs-xl text-light count">312</h2>
								<p className="p-0 m-0 text-light fs-md">Total Reviews</p>
								<i className="lni lni-comments"></i>
							</div>
						</div>
						<div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
							<div className="dsd-boxed-widget py-5 px-4 bg-purple rounded">
								<h2 className="ft-medium mb-1 fs-xl text-light count">410</h2>
								<p className="p-0 m-0 text-light fs-md">Total Bookings</p>
								<i className="lni lni-wallet"></i>
							</div>
						</div>
					</div>

					{/* <!-- row --> */}
					<div className="row">

						{/* <!-- Area Chart --> */}
						<div className="col-md-8 col-sm-12">
							<div className="dash-card">
								<div className="dash-card-header">
									<h4 className="mb-0">View Chart</h4>
								</div>
								<div className="dash-card-body">
									<div className="chart" id="revenue-chart" style={{ height: '365px' }}></div>
								</div>
							</div>
						</div>

						{/* <!-- Donut Chart --> */}
						<div className="col-md-4 col-sm-12">
							<div className="dash-card">
								<div className="dash-card-header">
									<h4>Followers</h4>
								</div>
								<div className="ground-list ground-hover-list">
									<div className="ground ground-list-single">
										<a href="#">
											<img className="ground-avatar" src="assets/img/t-1.png" alt="..." />
											<span className="profile-status bg-online pull-right"></span>
										</a>

										<div className="ground-content">
											<h6><a href="#">Maryam Amiri</a></h6>
											<small className="text-fade"><i className="fas fa-map-marker-alt me-1"></i>New York, USA</small>
										</div>
									</div>

									<div className="ground ground-list-single">
										<a href="#">
											<img className="ground-avatar" src="assets/img/t-2.png" alt="..." />
											<span className="profile-status bg-offline pull-right"></span>
										</a>

										<div className="ground-content">
											<h6><a href="#">Maryam Amiri</a></h6>
											<small className="text-fade"><i className="fas fa-map-marker-alt me-1"></i>Canada, USA</small>
										</div>
									</div>

									<div className="ground ground-list-single">
										<a href="#">
											<img className="ground-avatar" src="assets/img/t-3.png" alt="..." />
											<span className="profile-status bg-working pull-right"></span>
										</a>

										<div className="ground-content">
											<h6><a href="#">Maryam Amiri</a></h6>
											<small className="text-fade"><i className="fas fa-map-marker-alt me-1"></i>Denver, USA</small>
										</div>
									</div>

									<div className="ground ground-list-single">
										<a href="#">
											<img className="ground-avatar" src="assets/img/t-4.png" alt="..." />
											<span className="profile-status bg-busy pull-right"></span>
										</a>

										<div className="ground-content">
											<h6><a href="#">Maryam Amiri</a></h6>
											<small className="text-fade"><i className="fas fa-map-marker-alt me-1"></i>Liverpool, UK</small>
										</div>
									</div>

									<div className="ground ground-list-single">
										<a href="#">
											<img className="ground-avatar" src="assets/img/t-5.png" alt="..." />
											<span className="profile-status bg-online pull-right"></span>
										</a>

										<div className="ground-content">
											<h6><a href="#">Maryam Amiri</a></h6>
											<small className="text-fade"><i className="fas fa-map-marker-alt me-1"></i>California</small>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
					{/* <!-- /.row --> */}

					<div className="row">
						<div className="col-lg-6 col-md-12">
							<div className="goodup-dashboard-grouping-list with-icons">
								<h4>Recent Activities</h4>
								<ul>
									<li>
										<i className="dsd-icon-uiyo ti-layers text-purple bg-light-purple"></i> Your listing <strong><a href="#">Hotel The Lalit</a></strong> has been approved!
										<a href="#" className="close-list-item"><i className="fa fa-close"></i></a>
									</li>

									<li>
										<i className="dsd-icon-uiyo ti-star text-success bg-light-success"></i> Christopher K. Allen left a review <div className="grping-list-rates high" data-rating="5.0"></div> on <strong><a href="#">Bluchee Burger</a></strong>
										<a href="#" className="close-list-item"><i className="fa fa-close"></i></a>
									</li>

									<li>
										<i className="dsd-icon-uiyo ti-heart text-warning bg-light-warning"></i> Someone bookmarked your <strong><a href="#">Snow Valley House</a></strong> listing!
										<a href="#" className="close-list-item"><i className="fa fa-close"></i></a>
									</li>

									<li>
										<i className="dsd-icon-uiyo ti-star text-info bg-light-info"></i> Jesus A. Rhodes left a review <div className="grping-list-rates mid" data-rating="3.8"></div> on <strong><a href="#">Sonal Cafe</a></strong>
										<a href="#" className="close-list-item"><i className="fa fa-close"></i></a>
									</li>

									<li>
										<i className="dsd-icon-uiyo ti-heart text-danger bg-light-danger"></i> Someone bookmarked your <strong><a href="#">Blue Bear Bar</a></strong> listing!
										<a href="#" className="close-list-item"><i className="fa fa-close"></i></a>
									</li>

									<li>
										<i className="dsd-icon-uiyo ti-star text-success bg-light-success"></i> Michael H. Bright left a review <div className="grping-list-rates high" data-rating="4.7"></div> on <strong><a href="#">Lucky Dhaba</a></strong>
										<a href="#" className="close-list-item"><i className="fa fa-close"></i></a>
									</li>

									<li>
										<i className="dsd-icon-uiyo ti-star text-purple bg-light-purple"></i> Arnold A. Lynn left a review <div className="grping-list-rates low" data-rating="2.8"></div> on <strong><a href="#">Madhu Sweet House</a></strong>
										<a href="#" className="close-list-item"><i className="fa fa-close"></i></a>
									</li>
								</ul>
							</div>
						</div>

						<div className="col-lg-6 col-md-12">
							<div className="goodup-dashboard-grouping-list invoices with-icons">
								<h4>Invoices</h4>
								<ul>

									<li><i className="dsd-icon-uiyo ti-files text-warning bg-light-warning"></i>
										<strong>Starter Plan</strong>
										<ul>
											<li className="unpaid">Unpaid</li>
											<li>Order: #LS5410</li>
											<li>Date: 16 Sep 2022</li>
										</ul>
										<div className="buttons-to-right">
											<a href="javascript:void(0);" className="button gray">View Invoice</a>
										</div>
									</li>

									<li><i className="dsd-icon-uiyo ti-files text-success bg-light-success"></i>
										<strong>Basic Plan</strong>
										<ul>
											<li className="paid">Paid</li>
											<li>Order: #LS5487</li>
											<li>Date: 19 Aug 2022</li>
										</ul>
										<div className="buttons-to-right">
											<a href="javascript:void(0);" className="button gray">View Invoice</a>
										</div>
									</li>

									<li><i className="dsd-icon-uiyo ti-files text-danger bg-light-danger"></i>
										<strong>Extended Plan</strong>
										<ul>
											<li className="pending">Pending</li>
											<li>Order: #LS6413</li>
											<li>Date: 07 Jul 2022</li>
										</ul>
										<div className="buttons-to-right">
											<a href="javascript:void(0);" className="button gray">View Invoice</a>
										</div>
									</li>

									<li><i className="dsd-icon-uiyo ti-files text-success bg-light-success"></i>
										<strong>Platinum Plan</strong>
										<ul>
											<li className="cancel">Cancel</li>
											<li>Order: #LS6100</li>
											<li>Date: 15 Jun 2022</li>
										</ul>
										<div className="buttons-to-right">
											<a href="javascript:void(0);" className="button gray">View Invoice</a>
										</div>
									</li>

									<li><i className="dsd-icon-uiyo ti-files text-warning bg-light-warning"></i>
										<strong>Extended Plan</strong>
										<ul>
											<li className="paid">Paid</li>
											<li>Order: #LS6257</li>
											<li>Date: 14 05 May 2022</li>
										</ul>
										<div className="buttons-to-right">
											<a href="javascript:void(0);" className="button gray">View Invoice</a>
										</div>
									</li>

									<li><i className="dsd-icon-uiyo ti-files text-info bg-light-info"></i>
										<strong>Platinum Plan</strong>
										<ul>
											<li className="unpaid">Unpaid</li>
											<li>Order: #LS6548</li>
											<li>Date: 10 May 2022</li>
										</ul>
										<div className="buttons-to-right">
											<a href="javascript:void(0);" className="button gray">View Invoice</a>
										</div>
									</li>

								</ul>
							</div>
						</div>
					</div>

				</div>

			</div>
		</>
	)
}

export default DashboardContent
