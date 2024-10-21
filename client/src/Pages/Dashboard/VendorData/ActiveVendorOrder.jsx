import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

function ActiveVendorOrder({ userData, activeOrder }) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Calculate the current orders to display
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = activeOrder.slice(indexOfFirstOrder, indexOfLastOrder);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle order status change
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:7000/api/v1/update-order-status/${orderId}`, { OrderStatus: newStatus });
            //    Swal.fire("Success", "Order status updated successfully", "success");
            toast.success('Order status updated successfully')
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
                        <h1 className="ft-medium">Active Orders</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
                                <li className="breadcrumb-item text-muted"><a href="/user-dashboard">Dashboard</a></li>
                                <li className="breadcrumb-item"><a className="theme-cl">Active Orders</a></li>
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
                                        <i className="fa fa-file-alt me-2 theme-cl fs-sm"></i>All Orders
                                    </h4>
                                </div>
                            </div>

                            <div className="dashboard-list-wraps-body py-3 px-3">
                                <div className="dashboard-listing-wraps table-responsive">
                                    <table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Image</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Name</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Type</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Name</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Email</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Number</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Address</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>LandMark</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Voice Note</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Order Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders && currentOrders.length > 0 ? (
                                                currentOrders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td><img style={{ width: '100px', height: '80px' }} src={order?.serviceId?.serviceImage?.url} alt={order?.serviceId?.name} /></td>
                                                        <td>{order?.serviceId?.name}</td>
                                                        <td>{order.serviceType}</td>
                                                        <td>{order?.userId?.FullName || "User is not available"}</td>
                                                        <td>{order?.userId?.Email || "User is not available"}</td>
                                                        <td>{order?.userId?.ContactNumber || "User is not available"}</td>
                                                        <td>{`${order?.userId?.HouseNo}, ${order?.userId?.Street}, ${order?.userId?.City}, ${order?.userId?.PinCode}` || "User is not available"}</td>
                                                        <td>{order?.userId?.NearByLandMark || "User is not available"}</td>
                                                        <td>
                                                            {order.voiceNote && (
                                                                <audio controls>
                                                                    <source src={order.voiceNote.url} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={order.OrderStatus}
                                                                onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Vendor Assign">Vendor Assign</option>
                                                                <option value="Vendor Ready To Go">Vendor Ready To Go</option>
                                                                <option value="Service Done">Service Done</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="12" className="text-center">
                                                        No Active Orders
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

export default ActiveVendorOrder
