import React, { useState } from 'react';

function AllVendorOrder({ userData, allOrder }) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Calculate the current orders to display
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = allOrder.slice(indexOfFirstOrder, indexOfLastOrder);
    const vendorType = userData.Role
    // Handle page change
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
                                <li className="breadcrumb-item text-muted"><a href="/vendor-dashboard">Dashboard</a></li>
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
                                                {/* <th style={{ whiteSpace: "nowrap" }}>Service Image</th> */}
                                                <th style={{ whiteSpace: "nowrap" }}>Service Name</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Service Type</th>
                                                <th style={{ whiteSpace: "nowrap" }}>User Name</th>
                                                <th style={{ whiteSpace: "nowrap" }}>User Email</th>
                                                <th style={{ whiteSpace: "nowrap" }}>User Number</th>
                                                <th style={{ whiteSpace: "nowrap" }}>User Address</th>
                                                <th style={{ whiteSpace: "nowrap" }}>LandMark</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Date</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Day</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Service Time</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Voice Note</th>
                                                {
                                                    vendorType === 'vendor' && (
                                                        <th style={{ whiteSpace: 'nowrap' }}>Allowted Member</th>
                                                    )
                                                }
                                                <th style={{ whiteSpace: "nowrap" }}>Order Status</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Watch Estimated</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Estimated Status</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Before Work Video</th>
                                                <th style={{ whiteSpace: "nowrap" }}>After Work Video</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Bill Amount</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Payment Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders && currentOrders.length > 0 ? (
                                                currentOrders.map((order) => (
                                                    <tr key={order._id}>
                                                        {/* <td><img style={{ width: '100px', height: '80px' }} src={order?.serviceId?.serviceImage?.url} alt={order?.serviceId?.name} /></td> */}
                                                        <td>{order?.serviceId?.subCategoryId?.name}</td>
                                                        <td>{order.serviceType}</td>
                                                        <td>{order?.userId?.FullName || "User is not available"}</td>
                                                        <td>{order?.userId?.Email || "User is not available"}</td>
                                                        <td>{order?.userId?.ContactNumber || "User is not available"}</td>
                                                        <td>{`${order?.userId?.HouseNo}, ${order?.userId?.Street}, ${order?.userId?.City}, ${order?.userId?.PinCode}` || "User is not available"}</td>
                                                        <td>{order?.userId?.NearByLandMark || "User is not available"}</td>
                                                        <td>{new Date(order?.workingDate).toLocaleDateString() || "Date is not available"}</td>
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
                                                        {
                                                            vendorType === 'vendor' && (
                                                                <td>{order.AllowtedVendorMember || 'No Member Allowted'}</td>
                                                            )
                                                        }

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
                                                        <td className={`text-center ${order.EstimatedBill?.statusOfBill ? 'text-success' : 'text-danger'}`}>
                                                            {/* { console.log(order.EstimatedBill?._id?.statusOfBill)} */}
                                                            {order.EstimatedBill?.statusOfBill ? 'Accepted' : 'Declined'}
                                                        </td>
                                                        {/* <td>
                                                            {order?.beforeWorkImage?.url ? (
                                                                <img style={{ width: '100px', height: '80px' }} src={order?.beforeWorkImage?.url} alt={order?.serviceId?.name} />
                                                            ) : (
                                                                <span>No image uploaded</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {order?.afterWorkImage?.url ? (
                                                                <img style={{ width: '100px', height: '80px' }} src={order?.afterWorkImage?.url} alt={order?.serviceId?.name} />
                                                            ) : (
                                                                <span>No image uploaded</span>
                                                            )}
                                                        </td> */}
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

                                                        {/* <td>{order.city}</td>
                                                       <td>{order.pinCode}</td>
                                                       <td>{`${order.houseNo}, ${order.street}, ${order.nearByLandMark}`}</td> */}
                                                        {/* <td>{order.message}</td> */}

                                                        {/* <td>{new Date(order.createdAt).toLocaleString()}</td> */}
                                                        {order.totalAmount ? (
                                                            <td>Rs.{order.totalAmount || 'Not available'}</td>
                                                        ) : (
                                                            <td>{order.totalAmount || 'Not available'}</td>
                                                        )}
                                                        <td>{order?.PaymentStatus || "User is not available"}</td>
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

export default AllVendorOrder
