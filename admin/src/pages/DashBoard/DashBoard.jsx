import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function DashBoard() {
    const [vendorCount, setVendorCount] = useState(0);
    const [employCount, setEmployCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [corporateCount, setCorporateCount] = useState(0);
    const [activeOrder, setActiveOrder] = useState(0);

    const fetchAllVendor = async () => {
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/all-vendor');
            const data = res.data.data;
            const  vendor = data.filter((item)=> item.Role === 'vendor')
            setVendorCount(vendor.length);
            const employData = data.filter((item) => item.Role === 'employ');
            setEmployCount(employData.length);
        } catch (error) {
            console.log('Internal server error', error);
        }
    };

    const fetchAllUser = async () => {
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/AllUser');
            const data = res.data.data;
            const corporateMember = data.filter((item) => item.UserType === "Corporate");
            setCorporateCount(corporateMember.length);
            const user = data.filter((item) => item.UserType === 'Normal')
            setUserCount(user.length);
        } catch (error) {
            console.log('Internal server error', error);
        }
    };

    const fetchAllOrder = async () => {
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-order');
            const data = res.data.data;
            setOrderCount(data.length);
            const activeOrders = data.filter((item) => item.OrderStatus !== "Service Done" && item.OrderStatus !== "Cancelled");
            setActiveOrder(activeOrders.length);
        } catch (error) {
            console.log('Internal server error', error);
        }
    };

    useEffect(() => {
        fetchAllVendor();
        fetchAllUser();
        fetchAllOrder();
    }, []);

    return (
        <div className="container dashboard">
            <h1 className="text-center mb-5">Welcome to the Dashboard</h1>
            <div className="row">
                <div className="col-md-4">
                    <Link to={'/vendors/all-vendor'} className="card shadow-sm border-0 rounded vendor-card">
                        <div className="card-body text-center">
                            <h5 className="card-title">All Vendors</h5>
                            <h2 className="card-text">{vendorCount}</h2>
                            <p className="card-description">Manage all registered vendors</p>
                        </div>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to={'/corporate-user/all-corporate-user'} className="card shadow-sm border-0 rounded corporate-card">
                        <div className="card-body text-center">
                            <h5 className="card-title">Corporate Users</h5>
                            <h2 className="card-text">{corporateCount}</h2>
                            <p className="card-description">Total Corporate Users in the system</p>
                        </div>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to={'/users/all-users'} className="card shadow-sm border-0 rounded user-card">
                        <div className="card-body text-center">
                            <h5 className="card-title">All Users</h5>
                            <h2 className="card-text">{userCount}</h2>
                            <p className="card-description">Total users in the system</p>
                        </div>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to={'/vendors/all-employ'} className="card shadow-sm border-0 rounded employ-card">
                        <div className="card-body text-center">
                            <h5 className="card-title">Blueace Members</h5>
                            <h2 className="card-text">{employCount}</h2>
                            <p className="card-description">Total Blueace Employees in the system</p>
                        </div>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to={'/Orders/all-order'} className="card shadow-sm border-0 rounded order-card">
                        <div className="card-body text-center">
                            <h5 className="card-title">All Orders</h5>
                            <h2 className="card-text">{orderCount}</h2>
                            <p className="card-description">Total orders processed this month</p>
                        </div>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to={'/Orders/all-order'} className="card shadow-sm border-0 rounded active-order-card">
                        <div className="card-body text-center">
                            <h5 className="card-title">Active Orders</h5>
                            <h2 className="card-text">{activeOrder}</h2>
                            <p className="card-description">Total active orders in the system</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
