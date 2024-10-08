import React, { act, useEffect, useState } from 'react';
import DashboardContent from './DashboardContent';
import MyListing from './MyListing';
import AddListing from './AddListing';
import SaveListing from './SaveListing';
import MyBooking from './MyBooking';
import Wallet from './Wallet';
import Profile from './Profile';
import ChangePassword from './ChangePassword';

function Dashboard() {
	const [activeTab,setActiveTab] = useState('Dashboard')
	// console.log(activeTab)
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}, [])
	return (
		<>
			{/* =============================== Dashboard Header ========================== */}
			<section
				className="bg-cover position-relative"
				style={{ background: 'red url(assets/img/cover.jpg) no-repeat' }}
				data-overlay="3"
			>
				<div className="abs-list-sec">
					<a href="dashboard-add-listing.html" className="add-list-btn">
						<i className="fas fa-plus me-2"></i>Add Listing
					</a>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
							<div className="dashboard-head-author-clicl">
								<div className="dashboard-head-author-thumb">
									<img src="assets/img/t-7.png" className="img-fluid" alt="" />
								</div>
								<div className="dashboard-head-author-caption">
									<div className="dashploio">
										<h4>Charles D. Robinson</h4>
									</div>
									<div className="dashploio">
										<span className="agd-location">
											<i className="lni lni-map-marker me-1"></i>Sastri Nagar, New Delhi
										</span>
									</div>
									<div className="listing-rating high">
										<i className="fas fa-star active"></i>
										<i className="fas fa-star active"></i>
										<i className="fas fa-star active"></i>
										<i className="fas fa-star active"></i>
										<i className="fas fa-star active"></i>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* =============================== Dashboard Header ========================== */}

			{/* ======================= dashboard Detail ======================== */}
			<div className="goodup-dashboard-wrap gray px-4 py-5">
				<a
					className="mobNavigation"
					data-bs-toggle="collapse"
					href="#MobNav"
					role="button"
					aria-expanded="false"
					aria-controls="MobNav"
				>
					<i className="fas fa-bars me-2"></i>Dashboard Navigation
				</a>
				<div className="collapse" id="MobNav">
					<div className="goodup-dashboard-nav sticky-top">
						<div className="goodup-dashboard-inner">
							<ul data-submenu-title="Main Navigation">
								<li onClick={()=> setActiveTab('Dashboard')} className={`${activeTab === 'Dashboard' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-dashboard me-2"></i>Dashboard
									</a>
								</li>
								<li onClick={()=> setActiveTab('My-listings')} className={`${activeTab === 'My-listings' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-files me-2"></i>My Listings
									</a>
								</li>
								<li onClick={()=> setActiveTab('Add-listing')} className={`${activeTab === 'Add-listing' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-add-files me-2"></i>Add Listing
									</a>
								</li>
								<li onClick={()=> setActiveTab('saved-listing')} className={`${activeTab === 'saved-listing' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-bookmark me-2"></i>Saved Listing
									</a>
								</li>
								<li onClick={()=> setActiveTab('my-booking')} className={`${activeTab === 'my-booking' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-briefcase me-2"></i>My Bookings
										<span className="count-tag bg-warning">4</span>
									</a>
								</li>
								<li onClick={()=> setActiveTab('wallet')} className={`${activeTab === 'wallet' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-mastercard me-2"></i>Wallet
									</a>
								</li>
								{/* <li onClick={()=> setActiveTab('message')} className={`${activeTab === 'message' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-envelope me-2"></i>Messages
										<span className="count-tag">4</span>
									</a>
								</li> */}
							</ul>
							<ul data-submenu-title="My Accounts">
								<li onClick={()=> setActiveTab('profile')} className={`${activeTab === 'profile' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-user me-2"></i>My Profile
									</a>
								</li>
								<li onClick={()=> setActiveTab('changePassword')} className={`${activeTab === 'changePassword' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-lock-alt me-2"></i>Change Password
									</a>
								</li>
								<li>
									<a href="#" onClick={() => alert('Account deletion not implemented')}>
										<i className="lni lni-trash-can me-2"></i>Delete Account
									</a>
								</li>
								<li>
									<a>
										<i className="lni lni-power-switch me-2"></i>Log Out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{
					activeTab === 'Dashboard' && (
						<>
						<DashboardContent />
						</>
					) 
				}
				{
					activeTab === 'My-listings' && (
						<>
						<MyListing />
						</>
					) 
				}
				{
					activeTab === 'Add-listing' && (
						<>
						<AddListing />
						</>
					) 
				}
				{
					activeTab === 'saved-listing' && (
						<>
						<SaveListing />
						</>
					) 
				}
				{
					activeTab === 'my-booking' && (
						<>
						<MyBooking />
						</>
					) 
				}
				{
					activeTab === 'wallet' && (
						<>
						<Wallet />
						</>
					) 
				}
				{
					activeTab === 'profile' && (
						<>
						<Profile />
						</>
					) 
				}
				{
					activeTab === 'changePassword' && (
						<>
						<ChangePassword />
						</>
					) 
				}
				
			</div>
			{/* ======================= dashboard Detail ======================== */}
		</>
	);
}

export default Dashboard;
