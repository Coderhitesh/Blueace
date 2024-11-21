import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import './vendorCss.css'
import verifiedImage from './verifiedImage.png'
function VendorDashboard({ userData, readyToWork, handleChangeReadyToWork, allCompleteOrderCount, allCancelOrderCount, allOrder, activeOrder }) {
    // console.log(userData)
    const [dashboard, setDashboard] = useState({})
    const token = sessionStorage.getItem('token');
    const [allOrderCount, setAllOrderCount] = useState(0)
    const [allActiveOrderCount, setAllActiveOrderCount] = useState(0)
    const [completeOrderCount, setCompleteOrderCount] = useState(0)
    const [cancelOrderCount, setCancelOrderCount] = useState(0)
    const isVerified = userData?.verifyed
    const role = userData?.Role
    // const [readyToWork, setReadyToWork] = useState(userData?.readyToWork || true);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])
    // console.log("readyToWork 2",readyToWork)
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

    // const handleChangeReadyToWork = async () => {
    //     try {
    //         const updatedStatus = !readyToWork;
    //         setReadyToWork(updatedStatus);

    //         await axios.put(
    //             `https://www.api.blueaceindia.com/api/v1/update-ready-to-work-status/${userData._id}`,
    //             { readyToWork: updatedStatus }
    //         );
    //         toast.success('Status successfully');
    //     } catch (error) {
    //         console.error("Error updating ready to work status:", error);
    //         toast.error("Failed to update status");
    //     }
    // };

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

    useEffect(() => {
        fetchOrderData();
    }, [])

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
                        <div className="col-xl-9 col-lg-9 col-md-12">
                            <h1 className="ft-medium">{userData.companyName}</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#" className="theme-cl">Dashboard</a></li>
                                </ol>
                            </nav>
                        </div>
                        {/* {
                            role === 'vendor' && ( */}
                                <div className="col-xl-3 col-lg-3 col-md-12">
                                    <div className="row">
                                        <div className="col-xl-12 d-flex justify-content-center mb-2 col-lg-12 col-md-12">
                                            {
                                                isVerified && (
                                                    <img style={{ width: "80px" }} src={verifiedImage} alt={userData.companyName} />
                                                )
                                            }
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12">
                                            <label className="ready-to-work-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={readyToWork}
                                                    onChange={handleChangeReadyToWork}
                                                />
                                                <span className="checkbox-text">Ready to Work</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            {/* )
                        }  */}


                    </div>
                </div>

                <div className="dashboard-widg-bar d-block">

                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-danger rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{activeOrder.length || 0}</h2>
                                <p className="p-0 m-0 text-light fs-md">Active Orders</p>
                                <i className="lni lni-empty-file"></i>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-success rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{allOrder.length || 0}</h2>
                                <p className="p-0 m-0 text-light fs-md">All Orders</p>
                                <i className="lni lni-eye"></i>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-warning rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{allCompleteOrderCount}</h2>
                                <p className="p-0 m-0 text-light fs-md">Complete Orders</p>
                                <i className="lni lni-comments"></i>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-purple rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{allCancelOrderCount}</h2>
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