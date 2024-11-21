import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import Toggle from '../../components/Forms/toggle';

function Order() {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedVendor, setSelectedVendor] = useState(null); // 
    const productsPerPage = 10;

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-order');
            setAllOrders(res.data.data);
            setLoading(false);
        } catch (error) {
            console.log("Internal server error in fetching all orders");
        }
    };

    // Handle order status change
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`https://www.api.blueaceindia.com/api/v1/update-order-status/${orderId}`, { OrderStatus: newStatus });

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
            const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-order/${id}`);
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

    const handleView = (vendor) => {
        setSelectedVendor(vendor); // Set the selected vendor details
        setModalVisible(true); // Open the modal
    };

    const indexOfLastVendor = currentPage * productsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - productsPerPage;
    const currentallOrders = allOrders.slice(indexOfFirstVendor, indexOfLastVendor);

    const headers = ['S.No', 'Service Name', 'Service Type', 'User Name', 'User Type', 'User Detail', 'Voice Note', 'Select Vendor', 'Service Day', 'Service Time', 'Vendor Member Allowted', 'OrderStatus', "Estimated Bill", "Bill Status", "Before Work Video", "After Work Video", 'Delete', 'Created At'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Orders'} subHeading={'Orders'} LastHeading={'All Orders'} backLink={'/Orders/all-order'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Table
                        headers={headers}
                        elements={currentallOrders.map((vendor, index) => (
                            <tr key={vendor._id}>
                                <td>{index + 1}</td>
                                <td className='fw-bolder'>{vendor?.serviceId?.subCategoryId?.name}</td>
                                <td className='fw-bolder'>{vendor?.serviceType}</td>
                                <td className='fw-bolder'>{vendor?.userId?.FullName || "Not-Available"}</td>
                                <td className='fw-bolder'>{vendor?.userId?.UserType || "Not-Available"}</td>
                                {/* User Detail Button to Open Modal */}
                                <td className='fw-bolder'>
                                    <button className="btn btn-info btn-activity-view rounded-pill px-4 py-2 shadow-sm" type="button" onClick={() => handleView(vendor?.userId)}>
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
                                        vendor.VendorAllotedStatus ? (
                                            <a href={`/Alloted/${vendor._id}?type=change-vendor`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                                Change Member
                                            </a>
                                        ):(
                                            <a href={`/Alloted/${vendor._id}`} className="btn btn-primary btn-activity-primary rounded-pill px-4 py-2 shadow-sm">
                                                Send Your Member
                                            </a>
                                        )
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
                                </td>

                                <td className='fw-bolder'>{vendor?.workingDay || 'Not Allowted'}</td>
                                <td className='fw-bolder'>{vendor?.workingTime || 'Not Allowted'}</td>
                                <td className='fw-bolder'>{vendor?.AllowtedVendorMember || 'Not Allowted'}</td>

                                <td className='fw-bolder'>
                                    {vendor?.userId?.UserType === 'Corporate' ? (
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
                                    )}
                                </td>

                                <td>
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
                                    {vendor.EstimatedBill?.statusOfBill ? 'Accepted' : 'Declined'}
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
                                <td>
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

                                                        <td>
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
                                <td>
                                    <button onClick={() => handleDelete(vendor._id)} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                        Delete
                                    </button>
                                </td>

                                <td>{new Date(vendor.createdAt).toLocaleString() || "Not-Available"}</td>
                            </tr>
                        ))}
                        productLength={allOrders.length}
                        productsPerPage={productsPerPage}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                        href=""
                        text=""
                        errorMsg=""
                        handleOpen={() => { }}
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
                                                    <td>{`${selectedVendor.HouseNo},${selectedVendor.Street},${selectedVendor.City} (${selectedVendor.PinCode})` || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Land Mark</td>
                                                    <td>{`${selectedVendor.NearByLandMark}` || "Not Available"}</td>
                                                </tr>

                                            </tbody>

                                        </table>
                                        {/* <h5 style={{ fontWeight: 600 }} className="mt-4">Members</h5>
                                        <table className="table table-bordered mt-4">
                                            <thead>
                                                <tr>
                                                    <th>Member Name</th>
                                                    <th>Aadhar Image</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    selectedVendor.member && selectedVendor.member.map((item, index) => (
                                                        <tr key={index}>
                                                            <td style={{ width: '28%' }}>{item.name}</td>
                                                            <td>{selectedVendor.panImage?.url ? (
                                                                <a href={item.memberAdharImage?.url} target="_blank" rel="noopener noreferrer">
                                                                    <img style={{ width: "100px", height: "auto", borderRadius: "8px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)" }} src={item.memberAdharImage?.url} alt={item.name} />
                                                                </a>
                                                            ) : (
                                                                <p>No Image Available</p>
                                                            )}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>

                                        </table>
                                        <h5 style={{ fontWeight: 600 }} className="mt-4">Documents</h5>
                                        <div className="row mt-2">
                                            <div className="col-md-4 text-center">
                                                <h6 style={{ fontWeight: '700' }} className=' mb-3'>PAN Image</h6>
                                                {selectedVendor.panImage?.url ? (
                                                    <a href={selectedVendor.panImage.url} target="_blank" rel="noopener noreferrer">
                                                        <img style={{ width: "100px", height: "auto", borderRadius: "8px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)" }} src={selectedVendor.panImage.url} alt="PAN" />
                                                    </a>
                                                ) : (
                                                    <p>No Image Available</p>
                                                )}
                                            </div>
                                            <div className="col-md-4 text-center">
                                                <h6 style={{ fontWeight: '700' }} className=' mb-3'>GST Image</h6>
                                                {selectedVendor.gstImage?.url ? (
                                                    <a href={selectedVendor.gstImage.url} target="_blank" rel="noopener noreferrer">
                                                        <img style={{ width: "100px", height: "auto", borderRadius: "8px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)" }} src={selectedVendor.gstImage.url} alt="GST" />
                                                    </a>
                                                ) : (
                                                    <p>No Image Available</p>
                                                )}
                                            </div>
                                            <div className="col-md-4 text-center">
                                                <h6 style={{ fontWeight: '700' }} className=' mb-3'>Aadhar Image</h6>
                                                {selectedVendor.adharImage?.url ? (
                                                    <a href={selectedVendor.adharImage.url} target="_blank" rel="noopener noreferrer">
                                                        <img style={{ width: "100px", height: "auto", borderRadius: "8px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)" }} src={selectedVendor.adharImage.url} alt="Aadhar" />
                                                    </a>
                                                ) : (
                                                    <p>No Image Available</p>
                                                )}
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Close</button>
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
