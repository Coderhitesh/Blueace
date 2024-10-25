import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

function ActiveVendorOrder({ userData, activeOrder }) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // State to store selected images for each order
    const [beforeWorkImage, setBeforeWorkImage] = useState({});
    const [afterWorkImage, setAfterWorkImage] = useState({});

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
            toast.success('Order status updated successfully');
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to update order status", "error");
        }
    };

    // Handle Before Work Image Upload
    const handleBeforeWorkImageUpload = async (orderId) => {
        // console.log("orderid",orderId)
        const formData = new FormData();
        formData.append('beforeWorkImage', beforeWorkImage[orderId]);

        try {
            await axios.put(`http://localhost:7000/api/v1/update-befor-work-image/${orderId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Before work image uploaded successfully');
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to upload before work image", "error");
        }
    };

    // Handle After Work Image Upload
    const handleAfterWorkImageUpload = async (orderId) => {
        const formData = new FormData();
        formData.append('afterWorkImage', afterWorkImage[orderId]);

        try {
            await axios.put(`http://localhost:7000/api/v1/update-after-work-image/${orderId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('After work image uploaded successfully');
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to upload after work image", "error");
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
                                                {/* <th style={{ whiteSpace: 'nowrap' }}>Service Image</th> */}
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Name</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Type</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Name</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Email</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Number</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>User Address</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>LandMark</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Voice Note</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Make Estimated </th>

                                                <th style={{ whiteSpace: 'nowrap' }}>Watch Estimated </th>
                                                <th style={{ whiteSpace: 'nowrap' }}> Estimated Status</th>


                                                <th style={{ whiteSpace: 'nowrap' }}>Order Status</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Before Work Image</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>After Work Image</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders && currentOrders.length > 0 ? (
                                                currentOrders.map((order) => (
                                                    <tr key={order._id}>
                                                        {/* <td><img style={{ width: '100px', height: '80px' }} src={order?.serviceId?.serviceImage?.url} alt={order?.serviceId?.name} /></td> */}
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
                                                            <button onClick={() => window.location.href = `/make-esitimated-bill?OrderId=${order._id}&vendor=${order?.vendorAlloted?._id}`} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }} className='btn btn-sm theme-bg text-light rounded ft-medium' >
                                                                Estimated Budget
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => {
                                                                    const estimatedBillStr = JSON.stringify(order.EstimatedBill);
                                                                    window.location.href = `/see-esitimated-bill?OrderId=${order._id}&vendor=${order?.vendorAlloted?._id}&Estimate=${encodeURIComponent(estimatedBillStr)}`;
                                                                }}
                                                                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}
                                                                className='btn btn-sm theme-bg text-light rounded ft-medium'
                                                                disabled={!order.EstimatedBill}
                                                            >
                                                                {order?.EstimatedBill ? "See Budget" : "Bill Not Available"}
                                                            </button>
                                                        </td>
                                                        <td className={`text-center ${order.EstimatedBill?.statusOfBill ? 'text-success' : 'text-danger'}`}>
                                                          {/* { console.log(order.EstimatedBill?._id?.statusOfBill)} */}
                                                            {order.EstimatedBill?.statusOfBill ? 'Accepted' : 'Declined'}
                                                        </td>

                                                        <td>
                                                            <select
                                                                value={order.OrderStatus}
                                                                onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                                            >
                                                                <option defaultValue={order.OrderStatus}>{order.OrderStatus}</option>
                                                                <option value="Service Done">Service Done</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="file"
                                                                id={`before-file-input-${order._id}`}
                                                                style={{ display: 'none' }}  // Hide the actual file input
                                                                onChange={(e) => setBeforeWorkImage({ ...beforeWorkImage, [order._id]: e.target.files[0] })}
                                                            />

                                                            {/* Small icon button to trigger file input */}
                                                            <button
                                                                className='btn btn-sm p-1'
                                                                onClick={() => document.getElementById(`before-file-input-${order._id}`).click()}
                                                                style={{ background: 'transparent', border: 'none', fontSize: '1rem' }}
                                                            >
                                                                <i className="fas fa-upload" aria-hidden="true"></i>  {/* FontAwesome upload icon */}
                                                            </button>

                                                            <button
                                                                className='btn btn-sm theme-bg text-light rounded ft-medium'
                                                                onClick={() => handleBeforeWorkImageUpload(order._id)}
                                                                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                            >
                                                                Upload
                                                            </button>
                                                        </td>

                                                        <td>
                                                            <input
                                                                type="file"
                                                                id={`file-input-${order._id}`}
                                                                style={{ display: 'none' }}  // Hide the actual file input
                                                                onChange={(e) => setAfterWorkImage({ ...afterWorkImage, [order._id]: e.target.files[0] })}
                                                            />

                                                            {/* Small icon button to trigger file input */}
                                                            <button
                                                                className='btn btn-sm p-1'
                                                                onClick={() => document.getElementById(`file-input-${order._id}`).click()}
                                                                style={{ background: 'transparent', border: 'none', fontSize: '1rem' }}
                                                            >
                                                                <i className="fas fa-upload" aria-hidden="true"></i>  {/* FontAwesome upload icon */}
                                                            </button>

                                                            <button
                                                                className='btn btn-sm theme-bg text-light rounded ft-medium'
                                                                onClick={() => handleAfterWorkImageUpload(order._id)}
                                                                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                            >
                                                                Upload
                                                            </button>
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
