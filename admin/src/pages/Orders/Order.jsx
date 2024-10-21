import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import Toggle from '../../components/Forms/toggle';

function Order() {
    const [allOrders, setAllOrders] = useState([])
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/get-all-order')
            setAllOrders(res.data.data)
            setLoading(false)
        } catch (error) {
            console.log("Internal server error in fetching all orders")
        }
    }

    // Handle order status change
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:7000/api/v1/update-order-status/${orderId}`, { OrderStatus: newStatus });
            //    Swal.fire("Success", "Order status updated successfully", "success");
            toast.success('Order status updated successfully')
            fetchAllOrders()
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to update order status", "error");
        }
    };

    useEffect(() => {
        fetchAllOrders()
    }, [])

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:7000/api/v1/delete-vendor/${id}`);
            if (response.data.success) {
                toast.success('Vendor deleted successfully!');
                await fetchVendorDetail(); // Fetch vendors again after deletion
            } else {
                toast.error('Failed to delete Vendor');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the vendor.');
        }
    };


    const indexOfLastVendor = currentPage * productsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - productsPerPage;
    const currentallOrders = allOrders.slice(indexOfFirstVendor, indexOfLastVendor);

    const headers = ['S.No', 'Service Name', 'Service Type', 'User Name', 'User Type', 'Voice Note', 'Select Vendor', 'OrderStatus', 'Delete', 'Created At'];
    return (
        <div className='page-body'>
            <Breadcrumb heading={'Users'} subHeading={'Users'} LastHeading={'All Users'} backLink={'/users/all-users'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Table
                        headers={headers}
                        elements={currentallOrders.map((vendor, index) => (
                            <tr key={vendor._id}>
                                <td>{index + 1}</td>
                                <td className='fw-bolder'>{vendor?.serviceId?.name}</td>
                                <td className='fw-bolder'>{vendor?.serviceType}</td>
                                <td className='fw-bolder'>{vendor?.userId?.FullName || "Not-Available"}</td>
                                <td className='fw-bolder'>{vendor?.userId?.UserType || "Not-Available"}</td>
                                <td className='fw-bolder'>
                                    {vendor.voiceNote && (
                                        <audio controls>
                                            <source src={vendor.voiceNote.url} type="audio/webm" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    )}
                                </td>
                                <td className='fw-bolder'>{vendor?.userId?.UserType || "Not-Available"}</td>
                                <td>
                                    <select
                                        value={vendor.OrderStatus}
                                        onChange={(e) => handleOrderStatusChange(vendor._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Vendor Assign">Vendor Assign</option>
                                        <option value="Vendor Ready To Go">Vendor Ready To Go</option>
                                        <option value="Service Done">Service Done</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                {/* <td className='fw-bolder'>
                                    <button className="btn btn-info btn-activity-view rounded-pill px-4 py-2 shadow-sm" type="button" onClick={() => handleView(vendor)}>
                                        View
                                    </button>
                                </td> */}
                                {/* <td>
                                    <Toggle
                                        isActive={vendor.isDeactive}
                                        onToggle={() => handleToggle(vendor._id, vendor.isDeactive)} // Pass vendor id and current active status
                                    />
                                </td> */}
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
                    {/* {modalVisible && selectedVendor && (
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="false">
                            <div className="modal-dialog modal-xl" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Vendor Details</h5>
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
                                                    <td style={{ width: '28%' }}>Company Name</td>
                                                    <td>{selectedVendor.companyName || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Owner Name</td>
                                                    <td>{selectedVendor.ownerName || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Owner Number</td>
                                                    <td>{selectedVendor.ContactNumber || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Email</td>
                                                    <td>{selectedVendor.Email || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Year of Registration</td>
                                                    <td>{selectedVendor.yearOfRegistration || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Registered Address</td>
                                                    <td>{selectedVendor.registerAddress || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>PAN No</td>
                                                    <td>{selectedVendor.panNo || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>GST No</td>
                                                    <td>{selectedVendor.gstNo || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Aadhar No</td>
                                                    <td>{selectedVendor.adharNo || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Membership Plan</td>
                                                    <td>{selectedVendor?.memberShipPlan?.name || "No Plan is activated"}</td>
                                                </tr>
                                            </tbody>

                                        </table>
                                        <h5 style={{ fontWeight: 600 }} className="mt-4">Members</h5>
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
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}
                </>
            )}
        </div>
    )
}

export default Order
