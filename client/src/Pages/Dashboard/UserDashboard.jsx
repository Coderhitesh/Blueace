import React, { act, useEffect, useState } from 'react';
import DashboardContent from './DashboardContent';
import MyListing from './MyListing';
import AddListing from './AddListing';
import SaveListing from './SaveListing';
import MyBooking from './MyBooking';
import Wallet from './Wallet';
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import UserAllOrder from './UserAllOrder';
import UserActiveOrder from './UserActiveOrder';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function UserDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard')
    // console.log(activeTab)
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [])

    const [activeOrder, setActiveOrder] = useState([])
    const [allOrder, setAllOrder] = useState([])
    const userDataString = sessionStorage.getItem('user');
    // console.log('datatype',userDataString)
    const userData = userDataString ? JSON.parse(userDataString) : null;
    // console.log('userdata',userData)
    const token = sessionStorage.getItem('token');
    const userId = userData?._id;


    const fetchOrderData = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/get-all-order')
            const orderData = res.data.data
            const filterData = orderData.filter((item) => item?.userId?._id === userData?._id)
            setAllOrder(filterData)
            const filterStatusData = filterData.filter((item) => item.OrderStatus !== 'Service Done' && item.OrderStatus !== 'Cancelled');
            // console.log('Filtered data by OrderStatus:', filterStatusData);
            setActiveOrder(filterStatusData)

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data.message || 'Internal server error in fetching orderData')
        }
    }

    useEffect(() => {
        fetchOrderData();
    }, [])

    // console.log('userdata', userData)

    const handleLogout = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/Logout', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            sessionStorage.clear();
            toast.success('Logout successfully');
            navigate('/sign-in');
        } catch (error) {
            console.log('Internal server in logout account', error);
            toast.error(error?.response?.data?.msg || 'Internal server error during logout');
        }
    };

    const handleDelete = async (userId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:7000/api/v1/delete-user/${userId}`);
                    sessionStorage.clear()
                    toast.success("User Deleted Successfully");
                    window.location.href = '/'
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your id deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.error);
                }
            }
        });
    };

    return (
        <>
            {/* =============================== Dashboard Header ========================== */}
            <section
                className="bg-cover position-relative"
                style={{ background: 'red url(assets/img/cover.jpg) no-repeat' }}
                data-overlay="3"
            >
                {/* <div className="abs-list-sec">
                    <a href="dashboard-Active-Order.html" className="add-list-btn">
                        <i className="fas fa-plus me-2"></i>Add Listing
                    </a>
                </div> */}
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="dashboard-head-author-clicl">
                                <div className="dashboard-head-author-thumb">
                               
                               

                                    {userData ? (

                                    <img src={userData?.userImage?.url} className="img-fluid" onError={(e)=>e.target.src = "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"} alt={userData.FullName} />
                                 
                                    ):null}
                                </div>
                                <div className="dashboard-head-author-caption">
                                    <div className="dashploio">
                                        <h4>{userData.FullName}</h4>
                                    </div>
                                    <div className="dashploio">
                                        <span className="agd-location">
                                            <i className="lni lni-map-marker me-1"></i>{`${userData.HouseNo}, ${userData.Street}, ${userData.City} (${userData.PinCode})`}
                                        </span>
                                    </div>
                                    {/* <div className="listing-rating high">
                                        <i className="fas fa-star active"></i>
                                        <i className="fas fa-star active"></i>
                                        <i className="fas fa-star active"></i>
                                        <i className="fas fa-star active"></i>
                                        <i className="fas fa-star active"></i>
                                    </div> */}
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
                                <li onClick={() => setActiveTab('Dashboard')} className={`${activeTab === 'Dashboard' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-dashboard me-2"></i>Dashboard
                                    </a>
                                </li>
                                <li onClick={() => setActiveTab('Active-Order')} className={`${activeTab === 'Active-Order' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-add-files me-2"></i>Active Order
                                    </a>
                                </li>
                                <li onClick={() => setActiveTab('User-All-Order')} className={`${activeTab === 'User-All-Order' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-files me-2"></i>All Orders
                                    </a>
                                </li>
                                {/* <li onClick={() => setActiveTab('saved-listing')} className={`${activeTab === 'saved-listing' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-bookmark me-2"></i>Saved Listing
                                    </a>
                                </li>
                                <li onClick={() => setActiveTab('my-booking')} className={`${activeTab === 'my-booking' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-briefcase me-2"></i>My Bookings
                                        <span className="count-tag bg-warning">4</span>
                                    </a>
                                </li>
                                <li onClick={() => setActiveTab('wallet')} className={`${activeTab === 'wallet' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-mastercard me-2"></i>Wallet
                                    </a>
                                </li> */}
                                {/* <li onClick={()=> setActiveTab('message')} className={`${activeTab === 'message' ? 'active' : ''}`}>
									<a>
										<i className="lni lni-envelope me-2"></i>Messages
										<span className="count-tag">4</span>
									</a>
								</li> */}
                            </ul>
                            <ul data-submenu-title="My Accounts">
                                <li onClick={() => setActiveTab('profile')} className={`${activeTab === 'profile' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-user me-2"></i>My Profile
                                    </a>
                                </li>
                                <li onClick={() => setActiveTab('changePassword')} className={`${activeTab === 'changePassword' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-lock-alt me-2"></i>Change Password
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => handleDelete(userId)}>
                                        <i className="lni lni-trash-can me-2"></i>Delete Account
                                    </a>
                                </li>
                                <li>
                                    <a onClick={handleLogout}>
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
                            <DashboardContent userData={userData} />
                        </>
                    )
                }
                {
                    activeTab === 'Active-Order' && (
                        <>
                            <UserActiveOrder activeOrder={activeOrder} />
                        </>
                    )
                }
                {
                    activeTab === 'User-All-Order' && (
                        <>
                            <UserAllOrder allOrder={allOrder} />
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
                            <Profile userData={userData} />
                        </>
                    )
                }
                {
                    activeTab === 'changePassword' && (
                        <>
                            <ChangePassword userData={userData} />
                        </>
                    )
                }

            </div>
            {/* ======================= dashboard Detail ======================== */}
        </>
    );
}

export default UserDashboard
