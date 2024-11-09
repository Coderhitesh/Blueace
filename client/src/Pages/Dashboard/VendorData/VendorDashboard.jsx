import React, { useEffect, useState } from 'react'
import axios from 'axios'
function VendorDashboard({ userData }) {
    // console.log(userData)
    const [dashboard, setDashboard] = useState({})
    const token = sessionStorage.getItem('token');
    const [allOrderCount,setAllOrderCount] = useState(0)
    const [allActiveOrderCount,setAllActiveOrderCount] = useState(0)
    const [completeOrderCount,setCompleteOrderCount] = useState(0)
    const [cancelOrderCount,setCancelOrderCount] = useState(0)
    
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])
    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('https://www.api.blueaceindia.com/api/v1/getAnylaticalData?OrderStatus=Service Done&secondStatus=Pending', {
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log(data)
            setDashboard(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchDashboardData()
    }, [token])

    // console.log("object",userData)
    // const userId = userData?._id;

    const fetchOrderData = async () => {
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-order');
            const orderData = res.data.data;
            const filterData = orderData.filter((item) => item?.vendorAlloted?._id === userData?._id);
            setAllOrderCount(filterData.length);
            const filterStatusData = filterData.filter((item) => item.OrderStatus !== 'Service Done' && item.OrderStatus !== 'Cancelled');
            setAllActiveOrderCount(filterStatusData.length);
            const filterCompletOrder = filterData.filter((item) => item.OrderStatus === 'Service Done');
            setCompleteOrderCount(filterCompletOrder.length);
            const filterCancelOrder = filterData.filter((item) => item.OrderStatus === 'Cancelled');
            setCancelOrderCount(filterCancelOrder.length);
        } catch (error) {
            toast.error(error.response?.data.message || 'Internal server error in fetching orderData');
        }
    };

    useEffect(()=>{
        fetchOrderData();
    },[])

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
                            <h1 className="ft-medium">{userData.companyName}</h1>
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
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-danger rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{allActiveOrderCount}</h2>
                                <p className="p-0 m-0 text-light fs-md">Active Orders</p>
                                <i className="lni lni-empty-file"></i>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-success rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{allOrderCount}</h2>
                                <p className="p-0 m-0 text-light fs-md">All Orders</p>
                                <i className="lni lni-eye"></i>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-warning rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{completeOrderCount}</h2>
                                <p className="p-0 m-0 text-light fs-md">Complete Orders</p>
                                <i className="lni lni-comments"></i>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-purple rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{cancelOrderCount}</h2>
                                <p className="p-0 m-0 text-light fs-md">Cancel Orders</p>
                                <i className="lni lni-wallet"></i>
                            </div>
                        </div>
                    </div>


                </div>

            </div>
        </>
    )
}

export default VendorDashboard