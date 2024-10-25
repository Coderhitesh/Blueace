import React, { useState } from 'react';

function UserActiveOrder({ userData, activeOrder }) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Calculate the current orders to display
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = activeOrder.slice(indexOfFirstOrder, indexOfLastOrder);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="goodup-dashboard-content">
            <div className="dashboard-tlbar d-block mb-5">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12">
                        <h1 className="ft-medium">Active Order</h1>
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
                                        <i className="fa fa-file-alt me-2 theme-cl fs-sm"></i>Active Orders
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
                                                <th style={{ whiteSpace: "nowrap" }}>Vendor Company</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Vendor Email</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Vendor Number</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Order Status</th>
                                                <th style={{ whiteSpace: "nowrap" }}>Order Esitmate</th>

                                                <th style={{ whiteSpace: "nowrap" }}>Before Work Image</th>
                                                <th style={{ whiteSpace: "nowrap" }}>After Work Image</th>

                                                {/* <th style={{whiteSpace:"nowrap"}}>City</th>
                                                <th style={{whiteSpace:"nowrap"}}>Pin Code</th>
                                                <th style={{whiteSpace:"nowrap"}}>Address</th>
                                                <th style={{whiteSpace:"nowrap"}}>Message</th> */}
                                                {/* <th style={{whiteSpace:"nowrap"}}>Voice Note</th> */}
                                                {/* <th style={{whiteSpace:"nowrap"}}>Created At</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders && currentOrders.length > 0 ? (
                                                currentOrders.map((order) => (

                                                    <tr key={order._id}>
                                                        {/* {console.log(order)} */}
                                                        {/* <td><img style={{ width: '100px', height: '80px' }} src={order?.serviceId?.serviceImage?.url} alt={order?.serviceId?.name} /></td> */}
                                                        <td>{order?.serviceId?.name}</td>
                                                        <td>{order.serviceType}</td>
                                                        <td>{order?.vendorAlloted?.companyName || "Vendor is not allowted"}</td>
                                                        <td>{order?.vendorAlloted?.Email || "Vendor is not allowted"}</td>
                                                        <td>{order?.vendorAlloted?.ContactNumber || "Vendor is not allowted"}</td>
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
                                                        </td>
                                                        {/* <td>{order.city}</td>
                                                        <td>{order.pinCode}</td>
                                                        <td>{`${order.houseNo}, ${order.street}, ${order.nearByLandMark}`}</td> */}
                                                        {/* <td>{order.message}</td> */}
                                                        {/* <td>
                                                            {order.voiceNote && (
                                                                <audio controls>
                                                                    <source src={order.voiceNote.url} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            )}
                                                        </td> */}
                                                        {/* <td>{new Date(order.createdAt).toLocaleString()}</td> */}
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

export default UserActiveOrder;
