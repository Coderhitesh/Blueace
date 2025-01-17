import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function UserAllOrder({ userData, allOrder }) {

    const [showModalFor, setShowModalFor] = useState(null); // Store the ID of the order for which the modal is open
    const [reviews, setReviews] = useState({}); // Store rating and comment for each order

    const openModal = (orderId) => {
        setShowModalFor(orderId);
    };

    const closeModal = () => {
        setShowModalFor(null);
    };

    const handleRatingChange = (orderId, value) => {
        setReviews((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                rating: value,
            },
        }));
    };

    const handleCommentChange = (orderId, event) => {
        const { value } = event.target;
        setReviews((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                comment: value,
            },
        }));
    };

    const handleSubmitReview = async (orderId, vendorId) => {
        const { rating, comment } = reviews[orderId] || {};

        if (!rating || !comment) {
            toast.error('Please provide a rating and comment.');
            return;
        }

        const reviewData = {
            rating,
            review: comment,
            vendorId,
            userId: userData._id,
        };

        try {
            const response = await axios.post('https://api.blueaceindia.com/api/v1/create-vendor-rating', reviewData);

            if (response.data.success) {
                toast.success('Rating submitted successfully!');
                setReviews((prev) => ({ ...prev, [orderId]: {} }));
                closeModal();
            } else {
                toast.error(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('There was an error submitting your review.');
        }
    };


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = allOrder.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="goodup-dashboard-content">
            <div className="dashboard-tlbar d-block mb-5">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12">
                        <h1 className="ft-medium">All Orders</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
                                <li className="breadcrumb-item text-muted"><a href="/user-dashboard">Dashboard</a></li>
                                <li className="breadcrumb-item"><a className="theme-cl">All Orders</a></li>
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
                                                <th style={{ whiteSpace: "nowrap" }}>Review</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Service Name</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Service Type</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Vendor Company</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Vendor Email</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Vendor Number</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Allowted Member</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Date</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Day</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Time</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Order Status</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Order Esitmate</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Before Work Image</th>
                                                <th style={{ whiteSpace: "nowrap" }}>After Work Image</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Bill Amount</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Payment Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders && currentOrders.length > 0 ? (
                                                currentOrders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td style={{ whiteSpace: 'nowrap' }}>
                                                            <button type="button" className="btn btn-danger" onClick={() => openModal(order._id)}>
                                                                Give Review
                                                            </button>
                                                        </td>
                                                        <td>{order?.serviceId?.subCategoryId?.name}</td>
                                                        <td>{order.serviceType}</td>
                                                        <td>{order?.vendorAlloted?.companyName || "Vendor is not allowted"}</td>
                                                        <td>{order?.vendorAlloted?.Email || "Vendor is not allowted"}</td>
                                                        <td>{order?.vendorAlloted?.ContactNumber || "Vendor is not allowted"}</td>
                                                        <td>{order.AllowtedVendorMember || 'No Member Allowted'}</td>
                                                        <td>{new Date(order?.workingDate).toLocaleDateString() || 'Date is not Allowted'}</td>
                                                        <td>{order.workingDay || 'Vendor is not Allowted'}</td>
                                                        <td>{order.workingTime || 'Vendor is not Allowted'}</td>
                                                        <td>{order.OrderStatus}</td>
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
                                                        <td>
                                                            {order?.beforeWorkVideo?.url ? (
                                                                <video
                                                                    width="200"
                                                                    height="120"
                                                                    controls
                                                                    style={{ borderRadius: '5px' }}
                                                                >
                                                                    <source src={order?.beforeWorkVideo?.url} type="video/mp4" />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            ) : (
                                                                <span>No video uploaded</span>
                                                            )}
                                                        </td>

                                                        <td>
                                                            {order?.afterWorkVideo?.url ? (
                                                                <video
                                                                    width="200"
                                                                    height="120"
                                                                    controls
                                                                    style={{ borderRadius: '5px' }}
                                                                >
                                                                    <source src={order?.afterWorkVideo?.url} type="video/mp4" />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            ) : (
                                                                <span>No video uploaded</span>
                                                            )}
                                                        </td>
                                                        {/* {console.log("order",order)} */}
                                                        {/* Review Modal */}
                                                        {showModalFor === order._id && (
                                                            <div className="custom-modal-overlay" style={{ display: 'block' }}>
                                                                <div className="custom-modal-container">
                                                                    <div className="custom-modal-content">
                                                                        <div className="custom-modal-header">
                                                                            <span className="custom-close-btn" onClick={closeModal}>
                                                                                <i className="fa fa-times"></i>
                                                                            </span>
                                                                        </div>
                                                                        <div className="custom-modal-body text-center">
                                                                            <h4>Add a Comment and Rate</h4>
                                                                            <div className="rating">
                                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                                    <span
                                                                                        key={star}
                                                                                        onClick={() => handleRatingChange(order._id, star)}
                                                                                        className={`star ${reviews[order._id]?.rating >= star ? 'filled' : ''}`}
                                                                                    >
                                                                                        ☆
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                            <textarea
                                                                                className="form-control mb-3"
                                                                                placeholder="What is your view?"
                                                                                rows="3"
                                                                                value={reviews[order._id]?.comment || ''}
                                                                                onChange={(e) => handleCommentChange(order._id, e)}
                                                                            ></textarea>
                                                                            <button
                                                                                className="btn btn-primary send-review-btn"
                                                                                onClick={() => handleSubmitReview(order._id, order?.vendorAlloted?._id)}
                                                                            >
                                                                                Send Review
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {order.totalAmount ? (
                                                            <td>Rs.{order.totalAmount || 'Not available'}</td>
                                                        ) : (
                                                            <td>{order.totalAmount || 'Not available'}</td>
                                                        )}
                                                        <td>{order.PaymentStatus || 'Not available'}</td>

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
                                        {Array.from({ length: Math.ceil(allOrder.length / itemsPerPage) }, (_, i) => (
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

export default UserAllOrder
