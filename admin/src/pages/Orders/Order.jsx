import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import moment from 'moment';

function Order() {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedVendor, setSelectedVendor] = useState(null); // 
    const productsPerPage = 10;
    const [registerAddress, setRegisterAddress] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [paymentModel, setPaymentModel] = useState(false)
    const [paymentDetail, setPaymentDetail] = useState(null)

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-order');
            console.log("res.data.data",res.data.data)
            setAllOrders(res.data.data);
            setLoading(false);
        } catch (error) {
            console.log("Internal server error in fetching all orders");
        }
    };

    // Handle order status change
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`https://api.blueaceindia.com/api/v1/update-order-status/${orderId}`, { OrderStatus: newStatus });

            toast.success('Order status updated successfully');
            fetchAllOrders();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to update order status", "error");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://api.blueaceindia.com/api/v1/delete-order/${id}`);
            if (response.data.success) {
                toast.success('Order deleted successfully!');
                await fetchAllOrders(); // Fetch vendors again after deletion
            } else {
                toast.error('Failed to delete Order');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the order.');
            console.log(error);
        }
    };

    // Open modal and set selected user details
    const handleUserDetailModal = (user) => {
        setSelectedUser(user);
        // Open Bootstrap modal manually
        const modal = new window.bootstrap.Modal(document.getElementById('userDetailModal'));
        modal.show();
    };

    const handleViewPayment = (vendor) => {
        setPaymentDetail(vendor)
        setPaymentModel(true)
    }

    const handleRedirect = (vendorId) => {
        window.location.href = `/show-vendor/${vendorId}`;
    }

    const handleView = (vendor) => {
        setSelectedVendor(vendor); // Set the selected vendor details
        setModalVisible(true); // Open the modal
    };

    // Filtering logic
    const filteredVendors = allOrders.filter((vendor) => {
        // const companyNameMatch = vendor.companyName.toLowerCase().includes(filterText.toLowerCase());
        const registerAddressMatch = vendor.address.toLowerCase().includes(registerAddress.toLowerCase());
        const vendorDate = moment(vendor.createdAt);
        const startDateMatch = startDate ? vendorDate.isSameOrAfter(moment(startDate).startOf('day')) : true;
        const endDateMatch = endDate ? vendorDate.isSameOrBefore(moment(endDate).endOf('day')) : true;

        return registerAddressMatch && startDateMatch && endDateMatch;
    });

    const indexOfLastVendor = currentPage * productsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - productsPerPage;
    const currentallOrders = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

    const headers = ['S.No', 'Service Name', 'Service Type', 'User Name', 'User Type', 'Is AMC User', 'Service Address', 'User Detail', 'Vendor Allowted Detail', 'Voice Note', 'Message', 'Select Vendor', 'Select Employee', 'Service Day', 'Service Time', 'Vendor Member Allowted', 'OrderStatus', "Estimated Bill", "Bill Status", "See Error Code", "Before Work Video", "After Work Video", "Payment Detail", 'Delete', 'Created At'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Orders'} subHeading={'Orders'} LastHeading={'All Orders'} backLink={'/Orders/all-order'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>

                    {/* Filter Section */}
                    <div className="filter-section mb-4">
                        <button className="btn btn-primary" onClick={() => setShowFilter(!showFilter)}>
                            {showFilter ? "Hide Filter" : "Show Filter"}
                        </button>
                        {showFilter && (
                            <div className="mt-2 row">
                                {/* <div className="col-md-3">
                                    <label htmlFor="" className='form-label'>Search by Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Search by Company Name"
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                    />
                                </div> */}
                                <div className="col-md-3">
                                    <label htmlFor="" className='form-label'>Search by Address</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Search by Order Address"
                                        value={registerAddress}
                                        onChange={(e) => setRegisterAddress(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="" className='form-label'>Search by Starting Date</label>
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        value={startDate ? moment(startDate).format("YYYY-MM-DD") : ""}
                                        onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="" className='form-label'>Search by Ending Date</label>
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        value={endDate ? moment(endDate).format("YYYY-MM-DD") : ""}
                                        onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Table
                        headers={headers}
                        elements={currentallOrders.map((vendor, index) => (
                            <tr key={vendor._id}>
                                <td>{index + 1}</td>
                                <td className='fw-bolder'>{vendor?.serviceId?.subCategoryId?.name}</td>
                                <td className='fw-bolder'>{vendor?.serviceType}</td>
                                <td className='fw-bolder'>{vendor?.userId?.FullName || "Not-Available"}</td>
                                <td className='fw-bolder'>{vendor?.userId?.UserType || "Not-Available"}</td>
                                <td className='fw-bolder'>{vendor?.userId?.isAMCUser ? 'Yes' : 'No'}</td>
                                <td className='fw-bolder'>{vendor?.address || "Not-Available"}</td>
                                {/* User Detail Button to Open Modal */}
                                <td className='fw-bolder'>
                                    <button className="btn btn-info btn-activity-view rounded-pill px-4 py-2 shadow-sm" type="button" onClick={() => handleView(vendor?.userId)}>
                                        View
                                    </button>
                                </td>
                                <td className='fw-bolder'>
                                    <button 
                                    className="btn btn-info btn-activity-view rounded-pill px-4 py-2 shadow-sm" 
                                    type="button" 
                                    onClick={() => handleRedirect(vendor?.vendorAlloted?._id)}
                                    disabled={vendor?.VendorAllotedBoolean === false}
                                    >
                                        View
                                    </button>
                                </td>
                                <td className='fw-bolder'>
                                    {vendor.voiceNote ? (
                                        <audio style={{ width: '200px' }} controls>
                                            <source src={vendor.voiceNote.url} type="audio/webm" />
                                        </audio>
                                    ) : 'No voice note'}
                                </td>

                                <td className='fw-bolder'>{vendor?.message}</td>

                                {/* <td style={{ whiteSpace: 'nowrap' }}>
                                    {vendor?.userId?.UserType === 'Corporate' ? (
                                        <a href={`/Alloted/${vendor._id}`} className="btn btn-primary btn-activity-primary rounded-pill px-4 py-2 shadow-sm">
                                            Send Your Member
                                        </a>
                                    ) : (
                                        vendor.VendorAllotedStatus ? (
                                            <a href={`/Alloted/${vendor._id}?type=change-vendor`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                                Change Vendor
                                            </a>
                                        ) : (
                                            <a href={`/Alloted/${vendor._id}`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                                Allot Vendor
                                            </a>
                                        )
                                    )}
                                </td> */}
                                <td style={{ whiteSpace: 'nowrap' }}>
                                    {vendor?.userId?.UserType === 'Corporate' ? (
                                        vendor.VendorAllotedStatus === 'Accepted' || vendor.VendorAllotedStatus === 'Send Request' ? (
                                            <a href={`/Alloted/${vendor._id}?type=change-vendor`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                                Change Member
                                            </a>
                                        ) : (
                                            <a href={`/Alloted/${vendor._id}`} className="btn btn-primary btn-activity-primary rounded-pill px-4 py-2 shadow-sm">
                                                Send Your Member
                                            </a>
                                        )
                                    ) : (
                                        vendor.VendorAllotedStatus === 'Accepted' || vendor.VendorAllotedStatus === 'Send Request' ? (
                                            <a href={`/Alloted/${vendor._id}?type=change-vendor`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                                Change Vendor
                                            </a>
                                        ) : (
                                            <a href={`/Alloted/${vendor._id}`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                                Allot Vendor
                                            </a>
                                        )
                                    )}
                                </td>
                                {/* <td style={{whiteSpace:'nowrap'}}>
                                    {vendor.VendorAllotedStatus === 'Accepted' || vendor.VendorAllotedStatus === 'Send Request' ? (
                                            <a href={`/alloted-employee/${vendor._id}?type=change-vendor`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                                Change Member
                                            </a>
                                        ) : (
                                            <a href={`/alloted-employee/${vendor._id}`} className="btn btn-primary btn-activity-primary rounded-pill px-4 py-2 shadow-sm">
                                                Send Your Member
                                            </a>
                                        )}
                                </td> */}
                                <td className='fw-bolder' style={{ whiteSpace: "nowrap" }}>
                                    <a href={`/alloted-employee/${vendor._id}`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                        Send Member
                                    </a>
                                </td>

                                <td className='fw-bolder'>{vendor?.workingDay || 'Not Allowted'}</td>
                                <td className='fw-bolder'>{vendor?.workingTime || 'Not Allowted'}</td>
                                <td className='fw-bolder'>{vendor?.AllowtedVendorMember || 'Not Allowted'}</td>

                                <td className='fw-bolder'>
                                    {vendor?.OrderStatus}
                                    {/* {vendor?.userId?.UserType === 'Corporate' ? (
                                        <select
                                            name="orderStatus"
                                            defaultValue={vendor?.OrderStatus || ""}
                                            onChange={(e) => handleOrderStatusChange(vendor._id, e.target.value)}
                                        >
                                            <option value="">Order Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Vendor Assigned">Vendor Assigned</option>
                                            <option value="Vendor Ready To Go">Vendor Ready To Go</option>
                                            <option value="Service Done">Service Done</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    ) : (
                                        vendor?.OrderStatus || "Not-Available"
                                    )} */}
                                </td>

                                <td className='fw-bolder'>
                                    <button
                                        onClick={() => {
                                            const estimatedBillStr = JSON.stringify(vendor.EstimatedBill);
                                            window.location.href = `/see-esitimated-bill?OrderId=${vendor._id}&vendor=${vendor?.vendorAlloted?._id}&Estimate=${encodeURIComponent(estimatedBillStr)}`;
                                        }}
                                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}
                                        className='btn btn-info btn-activity-view rounded-pill px-4 py-2 shadow-sm'
                                        disabled={!vendor.EstimatedBill}
                                    >
                                        {vendor?.EstimatedBill ? "See Budget" : "Bill Not Available"}
                                    </button>
                                </td>
                                <td className={`text-center ${vendor.EstimatedBill?.statusOfBill ? 'text-success' : 'text-danger'}`}>
                                    {/* { console.log(vendor.EstimatedBill?._id?.statusOfBill)} */}
                                    {vendor.EstimatedBill?.statusOfBill ? 'Accepted' : 'Bill Not Generated Yet'}
                                </td>

                                <td className='fw-bolder'>
                                    <button
                                        onClick={() => {
                                            window.location.href = `/show-error-code/${vendor._id}`;
                                        }}
                                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}
                                        className='btn btn-info btn-activity-view rounded-pill px-4 py-2 shadow-sm'
                                        // disabled={!vendor.EstimatedBill}
                                    >
                                        See Error Code
                                    </button>
                                </td>

                                {/* <td className='fw-bolder'>
                                    {vendor?.beforeWorkImage?.url ? (
                                        <img style={{ width: '100px', height: '80px' }} src={vendor?.beforeWorkImage?.url} alt={vendor?.serviceId?.name} />
                                    ) : (
                                        <span>No image uploaded</span>
                                    )}
                                </td>
                                <td className='fw-bolder'>
                                    {vendor?.afterWorkImage?.url ? (
                                        <img style={{ width: '100px', height: '80px' }} src={vendor?.afterWorkImage?.url} alt={vendor?.serviceId?.name} />
                                    ) : (
                                        <span>No image uploaded</span>
                                    )}
                                </td> */}
                                <td className='fw-bolder'>
                                    {vendor?.beforeWorkVideo?.url ? (
                                        <video
                                            width="200"
                                            height="120"
                                            controls
                                            style={{ borderRadius: '5px' }}
                                        >
                                            <source src={vendor?.beforeWorkVideo?.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <span>No video uploaded</span>
                                    )}
                                </td>

                                <td className='fw-bolder'>
                                    {vendor?.afterWorkVideo?.url ? (
                                        <video
                                            width="200"
                                            height="120"
                                            controls
                                            style={{ borderRadius: '5px' }}
                                        >
                                            <source src={vendor?.afterWorkVideo?.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <span>No video uploaded</span>
                                    )}
                                </td>
                                <td className='fw-bolder'>
                                    {vendor?.PaymentStatus === 'paid' ? (
                                        <button className="btn btn-info btn-activity-view rounded-pill px-4 py-2 shadow-sm" type="button" onClick={() => handleViewPayment(vendor)}>
                                            View
                                        </button>
                                    ) : (
                                        <span>Service Not Done</span>
                                    )}
                                </td>
                                <td className='fw-bolder'>
                                    <button onClick={() => handleDelete(vendor._id)} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                        Delete
                                    </button>
                                </td>

                                <td>{new Date(vendor.createdAt).toLocaleString() || "Not-Available"}</td>
                            </tr>
                        ))}
                        productLength={filteredVendors.length}
                        productsPerPage={productsPerPage}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                        href=""
                        text=""
                        errorMsg=""
                        handleOpen={() => { }}
                        ExcelText="Export Vendor Order"
                        excelHref={'/download-vendor-order'}
                        EmployeeOrderText="Export Employee Order"
                        EmployeeOrderHref={'/download-employ-data'}
                        AMCOrderText="Export AMC User Order"
                        AMCOrderHref={'/download-amc-order'}
                    />

                    {modalVisible && selectedVendor && (
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="false">
                            <div className="modal-dialog modal-xl" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">User Details</h5>
                                        <button type="button" className="close" onClick={() => setModalVisible(false)} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">

                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Field</th>
                                                    <th>Information</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '28%' }}>User Name</td>
                                                    <td>{selectedVendor.FullName || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Number</td>
                                                    <td>{selectedVendor.ContactNumber || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Email</td>
                                                    <td>{selectedVendor.Email || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>User Type</td>
                                                    <td>{selectedVendor.UserType || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Address</td>
                                                    <td>{`${selectedVendor.HouseNo},${selectedVendor.address} (${selectedVendor.PinCode})` || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Land Mark</td>
                                                    <td>{`${selectedVendor.NearByLandMark}` || "Not Available"}</td>
                                                </tr>

                                            </tbody>

                                        </table>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentModel && paymentDetail && (
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="false">
                            <div className="modal-dialog modal-xl" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Bank Detail</h5>
                                        <button type="button" className="close" onClick={() => setPaymentModel(false)} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Field</th>
                                                    <th>Information</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Transaction Id</td>
                                                    <td>{paymentDetail.transactionId || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Total Amount</td>
                                                    <td>Rs.{paymentDetail.totalAmount || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Vendor Commission Amount</td>
                                                    <td>Rs.{paymentDetail.vendorCommissionAmount || "Not Available"}</td>
                                                </tr>

                                            </tbody>

                                        </table>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setPaymentModel(false)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Order;
