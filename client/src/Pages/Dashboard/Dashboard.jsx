import React, { useEffect, useState } from 'react';
import VendorDashboard from './VendorData/VendorDashboard';
import axios from 'axios'
import AllVendorOrder from './VendorData/AllVendorOrder';
import ActiveVendorOrder from './VendorData/ActiveVendorOrder';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import VendorProfile from './VendorData/VendorProfile';
import VendorChangePassword from './VendorData/VendorChangePassword';
import VendorMember from './VendorData/VendorMember';
import AddVendorMember from './VendorData/AddVendorMember';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AddTimingSlot from './VendorData/AddTimingSlot';
import EditTimingSlot from './VendorData/EditTimingSlot';
import VerifyAccount from './VendorData/VerifyAccount';
import StarRating from '../../Components/StarRating/StarRating';

function Dashboard() {
    const navigate = useNavigate();
    const [activeOrder, setActiveOrder] = useState([]);
    const [allOrder, setAllOrder] = useState([]);
    const [allCompleteOrderCount, setCompleteOrderCount] = useState(0)
    const [allCancelOrderCount, setCancelOrderCount] = useState(0)
    const [activeTab, setActiveTab] = useState('Dashboard');
    const url = window.location.hash.substring(1);

    const [collapseState, setCollapseState] = useState(false);

    const toggleCollapse = () => {
        setCollapseState(prevState => !prevState);
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);
    const [userData, setUserData] = useState([])
    const userDataString = sessionStorage.getItem('user');
    const userDataMain = userDataString ? JSON.parse(userDataString) : null;
    const token = sessionStorage.getItem('token');
    const userId = userDataMain?._id;
    // console.log("userDataMain", userDataMain)
    const role = userDataMain?.Role
    const isVerified = userData.verifyed
    const slotAdded = userData?.workingHour
    const [readyToWork, setReadyToWork] = useState();
    // useEffect(()=>{
    //     setReadyToWork(userData.readyToWork)
    // },[])

    useEffect(() => {
        const fetchOrderById = async () => {
            try {
                const res = await axios.get(`https://api.blueaceindia.com/api/v1/get-order-by-id?vendorAlloted=${userId}`,);
                setAllOrder(res.data.data)
                const allData = res.data.data
                const activeData = allData.filter((item) => item.OrderStatus !== 'Service Done' && item.OrderStatus !== 'Cancelled');
                setActiveOrder(activeData)
                const completeData = allData.filter((item) => item.OrderStatus === 'Service Done')
                setCompleteOrderCount(completeData.length)
                const cancelOrderData = allData.filter((item) => item.OrderStatus === 'Cancelled')
                setCancelOrderCount(cancelOrderData.length)
            } catch (error) {
                console.log(error)
            }
        }
        fetchOrderById()
    }, [])

    const findUser = async () => {
        try {
            const res = await axios.get(`https://api.blueaceindia.com/api/v1/findUser/${userId}`)
            setUserData(res.data.data)
            setReadyToWork(res.data.data.readyToWork)
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        findUser();
        // fetchOrderById();
    }, []);

    useEffect(() => {
        if (url) {
            setActiveTab(url);
        } else {
            setActiveTab('Dashboard')
        }
    }, [url])

    const handleLogout = async () => {
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/vendor-logout', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            sessionStorage.clear();
            toast.success('Logout successfully');
            navigate('/sign-in');
        } catch (error) {
            toast.error(error?.response?.data?.msg || 'Internal server error during logout');
        }
    };

    // console.log('readyToWork',readyToWork)
    const handleChangeReadyToWork = async () => {
        try {
            // console.log('i am hit')
            const updatedStatus = !readyToWork;
            // console.log("updatedStatus",updatedStatus)
            setReadyToWork(updatedStatus);

            await axios.put(
                `https://api.blueaceindia.com/api/v1/update-ready-to-work-status/${userData._id}`,
                { readyToWork: updatedStatus }
            );
            toast.success('Status successfully');
        } catch (error) {
            console.error("Error updating ready to work status:", error);
            toast.error("Failed to update status");
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
                    await axios.delete(`https://api.blueaceindia.com/api/v1/delete-vendor/${userId}`);
                    sessionStorage.clear()
                    toast.success("User Deleted Successfully");
                    window.location.href = '/'
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your id deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    toast.error(error.response.data.error);
                }
            }
        });
    };

    // Function to collapse the navigation after a tab is selected
    const collapseNavigation = () => {
        const collapseElement = document.getElementById('MobNav');
        const collapseInstance = window.bootstrap.Collapse.getInstance(collapseElement);
        if (collapseInstance) {
            collapseInstance.hide();
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        collapseNavigation(); // Collapse navigation on tab change
    };

    return (
        <>
            <section
                className="bg-cover position-relative"
                style={{ background: 'red url(assets/img/cover.jpg) no-repeat' }}
                data-overlay="3"
            >
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="dashboard-head-author-clicl">
                                <div className="dashboard-head-author-thumb">
                                    {userData ? (
                                        <img
                                            src={
                                                userData?.vendorImage?.url ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.companyName || 'User')}&background=random`
                                            }
                                            className="img-fluid"
                                            onError={(e) =>
                                                (e.target.src = 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg')
                                            }
                                            alt={userData?.FullName || 'User Avatar'}
                                        />
                                    ) : null}
                                </div>
                                <div className="dashboard-head-author-caption">
                                    <div className="dashploio">
                                        <h4>{userData.companyName}</h4>
                                    </div>
                                    <div className="dashploio">
                                        <span className="agd-location">
                                            <i className="lni lni-map-marker me-1"></i>{`${userData.registerAddress}`}
                                        </span>
                                    </div>
                                    <div className="listing-rating high">
                                        {/* <i className="fas fa-star active"></i>
                                        <i className="fas fa-star active"></i>
                                        <i className="fas fa-star active"></i>
                                        <i className="fas fa-star active"></i>
                                        <i className="fas fa-star active"></i> */}
                                        <StarRating rating={userData.averageRating || 0} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="goodup-dashboard-wrap gray px-4 py-5">
                <a
                    className="mobNavigation"
                    role="button"
                    onClick={toggleCollapse}
                >
                    <i className="fas fa-bars me-2"></i>Dashboard Navigation
                </a>
                <div className={`collapse ${collapseState ? 'show' : ''}`} id="MobNav">
                    <div className="goodup-dashboard-nav">
                        {
                            role === 'employ' && (
                                <div className="goodup-dashboard-inner">
                                    <ul data-submenu-title="Main Navigation">
                                        <li onClick={() => handleTabClick('Dashboard')} className={`${activeTab === 'Dashboard' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-dashboard me-2"></i>Dashboard
                                            </a>
                                        </li>
                                        <li onClick={() => handleTabClick('Active-Order')} className={`${activeTab === 'Active-Order' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-files me-2"></i>Active Order
                                            </a>
                                        </li>
                                        <li onClick={() => handleTabClick('All-Order')} className={`${activeTab === 'All-Order' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-add-files me-2"></i>All Orders
                                            </a>
                                        </li>
                                        {
                                            !slotAdded && (
                                                <li onClick={() => handleTabClick('add-slot-time')} className={`${activeTab === 'add-slot-time' ? 'active' : ''}`}>
                                                    <a>
                                                        <i className="lni lni-bookmark me-2"></i>Add Slot Time
                                                    </a>
                                                </li>
                                            )
                                        }
                                        {
                                            slotAdded && (
                                                <li onClick={() => handleTabClick('edit-slot-time')} className={`${activeTab === 'edit-slot-time' ? 'active' : ''}`}>
                                                    <a>
                                                        <i className="lni lni-bookmark me-2"></i>Edit Slot Time
                                                    </a>
                                                </li>
                                            )
                                        }
                                        {
                                            isVerified === false && (
                                                <li onClick={() => handleTabClick('verify-account')} className={`${activeTab === 'verify-account' ? 'active' : ''}`}>
                                                    <a>
                                                        <i className="lni lni-bookmark me-2"></i>Verify Account
                                                    </a>
                                                </li>
                                            )
                                        }
                                        {/* <li onClick={() => handleTabClick('add-slot-time')} className={`${activeTab === 'add-slot-time' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-bookmark me-2"></i>Add Slot Time
                                            </a>
                                        </li>
                                        <li onClick={() => handleTabClick('edit-slot-time')} className={`${activeTab === 'edit-slot-time' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-bookmark me-2"></i>Edit Slot Time
                                            </a>
                                        </li> */}

                                    </ul>
                                    <ul data-submenu-title="My Accounts">
                                        <li onClick={() => handleTabClick('profile')} className={`${activeTab === 'profile' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-user me-2"></i>My Profile
                                            </a>
                                        </li>
                                        <li onClick={() => handleTabClick('changePassword')} className={`${activeTab === 'changePassword' ? 'active' : ''}`}>
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
                            )
                        }
                        {
                            role === 'vendor' && (
                                <div className="goodup-dashboard-inner">
                                    <ul data-submenu-title="Main Navigation">
                                        <li onClick={() => handleTabClick('Dashboard')} className={`${activeTab === 'Dashboard' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-dashboard me-2"></i>Dashboard
                                            </a>
                                        </li>
                                        <li onClick={() => handleTabClick('Active-Order')} className={`${activeTab === 'Active-Order' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-files me-2"></i>Active Order
                                            </a>
                                        </li>
                                        <li onClick={() => handleTabClick('All-Order')} className={`${activeTab === 'All-Order' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-add-files me-2"></i>All Orders
                                            </a>
                                        </li>
                                        <li onClick={() => handleTabClick('members')} className={`${activeTab === 'members' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-bookmark me-2"></i>Member
                                            </a>
                                        </li>
                                        <li onClick={() => handleTabClick('add-members')} className={`${activeTab === 'add-members' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-bookmark me-2"></i>Add Member
                                            </a>
                                        </li>
                                        {
                                            !slotAdded && (
                                                <li onClick={() => handleTabClick('add-slot-time')} className={`${activeTab === 'add-slot-time' ? 'active' : ''}`}>
                                                    <a>
                                                        <i className="lni lni-bookmark me-2"></i>Add Slot Time
                                                    </a>
                                                </li>
                                            )
                                        }
                                        {
                                            slotAdded && (
                                                <li onClick={() => handleTabClick('edit-slot-time')} className={`${activeTab === 'edit-slot-time' ? 'active' : ''}`}>
                                                    <a>
                                                        <i className="lni lni-bookmark me-2"></i>Edit Slot Time
                                                    </a>
                                                </li>
                                            )
                                        }
                                        {
                                            isVerified === false && (
                                                <li onClick={() => handleTabClick('verify-account')} className={`${activeTab === 'verify-account' ? 'active' : ''}`}>
                                                    <a>
                                                        <i className="lni lni-bookmark me-2"></i>Verify Account
                                                    </a>
                                                </li>
                                            )
                                        }
                                    </ul>
                                    <ul data-submenu-title="My Accounts">
                                        <li onClick={() => handleTabClick('profile')} className={`${activeTab === 'profile' ? 'active' : ''}`}>
                                            <a>
                                                <i className="lni lni-user me-2"></i>My Profile
                                            </a>
                                        </li>
                                        <li onClick={() => handleTabClick('changePassword')} className={`${activeTab === 'changePassword' ? 'active' : ''}`}>
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
                            )
                        }
                    </div>
                </div>
                {activeTab === 'Dashboard' && <VendorDashboard handleChangeReadyToWork={handleChangeReadyToWork} readyToWork={readyToWork} userData={userData} allOrder={allOrder} activeOrder={activeOrder} allCompleteOrderCount={allCompleteOrderCount} allCancelOrderCount={allCancelOrderCount} />}
                {activeTab === 'Active-Order' && <ActiveVendorOrder userData={userData} activeOrder={activeOrder} />}
                {activeTab === 'All-Order' && <AllVendorOrder userData={userData} allOrder={allOrder} />}
                {activeTab === 'members' && <VendorMember userData={userData} />}
                {activeTab === 'add-members' && <AddVendorMember userData={userData} />}
                {activeTab === 'profile' && <VendorProfile userData={userData} />}
                {activeTab === 'changePassword' && <VendorChangePassword userData={userData} />}
                {activeTab === 'add-slot-time' && <AddTimingSlot userData={userData} />}
                {activeTab === 'edit-slot-time' && <EditTimingSlot userData={userData} />}
                {activeTab === 'verify-account' && <VerifyAccount userData={userData} />}
            </div>
        </>
    );
}

export default Dashboard;
