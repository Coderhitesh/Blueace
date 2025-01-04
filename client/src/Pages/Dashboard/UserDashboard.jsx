import React, { useEffect, useState } from 'react';
import DashboardContent from './DashboardContent';
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import UserAllOrder from './UserAllOrder';
import UserActiveOrder from './UserActiveOrder';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/js/dist/collapse'; // Ensure Bootstrap JavaScript for collapse is available

function UserDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard');
    

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);
    const [userData, setUserData] = useState([])
    const [activeOrder, setActiveOrder] = useState([]);
    const [allOrder, setAllOrder] = useState([]);
    const [completeOrderCount,setCompleteOrderCount] = useState(0)
    const [cancelOrderCount,setCancelOrderCount] = useState(0)
    const userDataString = sessionStorage.getItem('user');
    const userDataMain = userDataString ? JSON.parse(userDataString) : null;
    const token = sessionStorage.getItem('token');
    const userId = userDataMain?._id;
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        const findUser = async () => {
            try {
                const res = await axios.get(`https://api.blueaceindia.com/api/v1/findUser/${userId}`)
                setUserData(res.data.data)
            } catch (error) {
                console.log(error)
            }
        }
        findUser()
    },[])

    // console.log("userdata",userData)

    const fetchOrderById = async () => {
        setLoading(false)
        try {
            const res = await axios.get(`https://api.blueaceindia.com/api/v1/get-order-by-user-id?userId=${userId}`, );
            setAllOrder(res.data.data)
            // console.log("order by id",res.data.data)
            const allData = res.data.data
            const activeData = allData.filter((item) => item.OrderStatus !== 'Service Done' && item.OrderStatus !== 'Cancelled');
            setActiveOrder(activeData)
            const filterCompletOrder = allData.filter((item) => item.OrderStatus === 'Service Done');
            setCompleteOrderCount(filterCompletOrder.length);
            const filterCancelOrder = allData.filter((item) => item.OrderStatus === 'Cancelled');
            setCancelOrderCount(filterCancelOrder.length);
            setLoading(false)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        // fetchOrderData();
        // findUser();
        fetchOrderById();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/Logout', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://api.blueaceindia.com/api/v1/delete-user/${userId}`);
                    sessionStorage.clear();
                    toast.success('User Deleted Successfully');
                    window.location.href = '/';
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your id deleted.',
                        icon: 'success',
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.error);
                }
            }
        });
    };

    // Close the collapse when a tab is clicked
    const handleTabClick = (tab) => {
        setActiveTab(tab);

        // Manually trigger collapse close if it's open
        const collapseElement = document.getElementById('MobNav');
        if (collapseElement.classList.contains('show')) {
            const bootstrapCollapse = window.bootstrap.Collapse.getInstance(collapseElement);
            bootstrapCollapse.hide();
        }
    };

    if (!token) {
        return <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="container">
                <div className="row">
                    <div className="col text-center">
                        <div className="alert alert-danger" role="alert">
                            <h1 className="display-4">You are not logged in.</h1>
                            <p className="lead">Please login to access your dashboard.</p>
                            <a href="/sign-in" className="btn btn-primary btn-lg custom-btn">Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
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
                            <div style={{zIndex:0}} className="dashboard-head-author-clicl">
                                <div className="dashboard-head-author-thumb">
                                    {userData ? (
                                        <img
                                            src={
                                                userData?.userImage?.url ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.FullName || 'User')}&background=random`
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
                                        <h4>{userData.FullName}</h4>
                                    </div>
                                    <div className="dashploio">
                                        <span className="agd-location">
                                            <i className="lni lni-map-marker me-1"></i>{`${userData.HouseNo}, ${userData.address} (${userData.PinCode})`}
                                        </span>
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
                    data-bs-toggle="collapse"
                    href="#MobNav"
                    role="button"
                    aria-expanded="false"
                    aria-controls="MobNav"
                >
                    <i className="fas fa-bars me-2"></i>Dashboard Navigation
                </a>
                <div className="collapse" id="MobNav">
                    <div className="goodup-dashboard-nav">
                        <div className="goodup-dashboard-inner">
                            <ul data-submenu-title="Main Navigation">
                                <li onClick={() => handleTabClick('Dashboard')} className={`${activeTab === 'Dashboard' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-dashboard me-2"></i>Dashboard
                                    </a>
                                </li>
                                <li onClick={() => handleTabClick('Active-Order')} className={`${activeTab === 'Active-Order' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-add-files me-2"></i>Active Order
                                    </a>
                                </li>
                                <li onClick={() => handleTabClick('User-All-Order')} className={`${activeTab === 'User-All-Order' ? 'active' : ''}`}>
                                    <a>
                                        <i className="lni lni-files me-2"></i>All Orders
                                    </a>
                                </li>
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
                    </div>
                </div>

                {activeTab === 'Dashboard' && <DashboardContent userData={userData} activeOrder={activeOrder} allOrder={allOrder} completeOrderCount={completeOrderCount} cancelOrderCount={cancelOrderCount} loading={loading} />}
                {activeTab === 'Active-Order' && <UserActiveOrder userData={userData} activeOrder={activeOrder} />}
                {activeTab === 'User-All-Order' && <UserAllOrder allOrder={allOrder} userData={userData} />}
                {activeTab === 'profile' && <Profile userData={userData} />}
                {activeTab === 'changePassword' && <ChangePassword userData={userData} />}
            </div>
        </>
    );
}

export default UserDashboard;
