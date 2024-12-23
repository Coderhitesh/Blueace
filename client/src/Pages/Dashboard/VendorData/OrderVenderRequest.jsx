import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

function OrderVenderRequest({ userData }) {
    // Pagination state
    const [activeOrder, setActiveOrder] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const userId = userData?._id;

    // Calculate the current orders to display
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = activeOrder.slice(indexOfFirstOrder, indexOfLastOrder);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleFetchRequestOrder = async () => {
        try {
            const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/get-order-by-id?vendorAlloted=${userId}`,);
                // setAllOrder(res.data.data)
                const allData = res.data.data
                const requestOrder = allData.filter((item) => item.VendorAllotedStatus === 'Send Request')
                setActiveOrder(requestOrder)
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    useEffect(()=>{
        handleFetchRequestOrder();
    },[])

    // Handle order status change
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`https://www.api.blueaceindia.com/api/v1/update-vendor-order-request/${orderId}`, { VendorAllotedStatus: newStatus });
            toast.success('Order status updated successfully');
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to update order status", "error");
        }
    };

    return (
        <div className="goodup-dashboard-content">
            <div className="dashboard-tlbar d-block mb-5">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12">
                        <h1 className="ft-medium">Order Request</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
                                <li className="breadcrumb-item text-muted"><a href="vendor-dashboard">Dashboard</a></li>
                                <li className="breadcrumb-item"><a className="theme-cl">Order Request</a></li>
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
                                        <i className="fa fa-file-alt me-2 theme-cl fs-sm"></i>Order Request
                                    </h4>
                                </div>
                            </div>

                            <div className="dashboard-list-wraps-body py-3 px-3">
                                <div className="dashboard-listing-wraps table-responsive">
                                    <table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                {/* <th style={{ whiteSpace: 'nowrap' }}>Service Image</th> */}
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Name</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Type</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Name</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Email</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Number</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Address</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>LandMark</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Day</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Time</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Voice Note</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Order Request </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders && currentOrders.length > 0 ? (
                                                currentOrders.map((order) => (
                                                    <tr key={order._id}>
                                                        {/* <td><img style={{ width: '100px', height: '80px' }} src={order?.serviceId?.serviceImage?.url} alt={order?.serviceId?.name} /></td> */}
                                                        <td>{order?.serviceId?.subCategoryId?.name}</td>
                                                        <td>{order.serviceType}</td>
                                                        {/* <td>{order?.userId?.FullName || "User is not available"}</td> */}
                                                        <td>{order?.fullName || order?.userId?.fullName || "User is not available"}</td>
                                                        <td>{order?.email || order?.userId?.Email || "User is not available"}</td>
                                                        <td>{order?.phoneNumber || order?.userId?.ContactNumber || "User is not available"}</td>
                                                        <td>{`${order?.houseNo}, ${order?.address}, ${order?.pinCode}` || "User is not available"}</td>
                                                        <td>{order?.nearByLandMark || "User is not available"}</td>
                                                        <td>{order?.workingDay || "User is not available"}</td>
                                                        <td>{order?.workingTime || "User is not available"}</td>
                                                        <td>
                                                            {order.voiceNote && (
                                                                <audio controls>
                                                                    <source src={order.voiceNote.url} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            ) || 'Not Available'}
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={order.VendorAllotedStatus}
                                                                className='form-control'
                                                                style={{ width: "150px", fontSize: '16px', paddingLeft: '3px', paddingRight: '3px' }}
                                                                onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                                            >
                                                                <option defaultValue={order.VendorAllotedStatus}>{order.VendorAllotedStatus}</option>
                                                                <option value="Accepted">Accepted</option>
                                                                <option value="Reject">Reject</option>
                                                            </select>
                                                        </td>

                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="12" className="text-center">
                                                        No Order request
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                </div>
                                <nav className="mt-3">
                                    <ul className="pagination justify-content-center">
                                        {Array.from({ length: Math.ceil(activeOrder.length / itemsPerPage) }, (_, i) => (
                                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => paginate(i + 1)}>
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderVenderRequest
