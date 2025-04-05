import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import Toggle from '../../components/Forms/toggle';
import moment from 'moment';
import { Link } from 'react-router-dom';

function AllEmploy() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedVendor, setSelectedVendor] = useState(null); // State for selected vendor details

    // States for filter inputs
    const [filterEmail, setFilterEmail] = useState("");
    const [filterPhoneNumber, setFilterPhoneNumber] = useState("");
    const [filterCompanyName, setFilterCompanyName] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filterAddress, setFilterAddress] = useState("");


    const fetchVendorDetail = async () => {
        try {
            const res = await axios.get('http://localhost:7987/api/v1/all-vendor');
            const datasave = res.data.data;
            // console.log("all data",datasave)
            const filterData = datasave.filter((item) => item.Role === "employ")
            // console.log("all vendor",filterData)
            const r = filterData.reverse();
            setVendors(r);
        } catch (error) {
            toast.error('An error occurred while fetching Employee data.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchVendorDetail();
    }, [])

    const indexOfLastVendor = currentPage * productsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - productsPerPage;
    const filteredUsers = vendors.filter((user) => {
        const emailMatch = user.Email && user.Email.toLowerCase().includes(filterEmail.toLowerCase());
        const phoneNumberMatch = user.ContactNumber && user.ContactNumber.includes(filterPhoneNumber);
        const addressMatch = user.address && user.address.toLowerCase().includes(filterAddress.toLowerCase()); // Address filter
        const startDateMatch = startDate ? new Date(user.createdAt) >= new Date(startDate) : true;
        const endDateMatch = endDate ? new Date(user.createdAt) <= new Date(endDate) : true;

        return emailMatch && phoneNumberMatch && addressMatch && startDateMatch && endDateMatch;
    });

    const currentVendors = filteredUsers.slice(indexOfFirstVendor, indexOfLastVendor);

    const handleToggle = async (id, currentDeactiveStatus) => {
        try {
            const newDeactiveStatus = !currentDeactiveStatus;
            const response = await axios.put(`http://localhost:7987/api/v1/update-deactive-status/${id}`, {
                isDeactive: newDeactiveStatus
            })
            if (response.data.success) {
                toast.success('Employee status updated successfully.');
                await fetchVendorDetail();
            } else {
                toast.error('Failed to update Employee status.');
            }
        } catch (error) {
            toast.error("An error occurred while updating the deactive status")
            console.error("Toggle error:", error)
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:7987/api/v1/delete-vendor/${id}`);
            if (response.data.success) {
                toast.success('Employee deleted successfully!');
                await fetchVendorDetail(); // Fetch vendors again after deletion
            } else {
                toast.error('Failed to delete Employee');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the Employee.');
        }
    };

    const handleView = (vendor) => {
        setSelectedVendor(vendor); // Set the selected vendor details
        setModalVisible(true); // Open the modal
    };

    const headers = ['S.No', 'Company Name', 'Employee Name', 'Employee Number', 'Email', "Type", 'View', 'Deactive', 'Delete', 'Edit', 'Created At'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Employees'} subHeading={'Employees'} LastHeading={'All Employees'} backLink={'/users/all-users'} />
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
                                <div className="col-md-3">
                                    <label htmlFor="" className='form-label'>Search by Email</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Search by Email"
                                        value={filterEmail}
                                        onChange={(e) => setFilterEmail(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="" className='form-label'>Search by Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Search by Phone Number"
                                        value={filterPhoneNumber}
                                        onChange={(e) => setFilterPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="" className='form-label'>Search by Address</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Search by Address"
                                        value={filterAddress}
                                        onChange={(e) => setFilterAddress(e.target.value)}
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
                        elements={currentVendors.map((vendor, index) => (
                            <tr key={vendor._id}>
                                <td>{index + 1}</td>
                                <td className='fw-bolder'>{vendor.companyName}</td>
                                <td className='fw-bolder'>{vendor.ownerName || "Not-Available"}</td>
                                <td className='fw-bolder'>{vendor.ContactNumber || "Not-Available"}</td>
                                <td className='fw-bolder'>{vendor.Email || "Not-Available"}</td>
                                <td className='fw-bolder'>{vendor.Role || "Not-Available"}</td>
                                <td className='fw-bolder'>
                                    <button className="btn btn-info btn-activity-view rounded-pill px-4 py-2 shadow-sm" type="button" onClick={() => handleView(vendor)}>
                                        View
                                    </button>
                                </td>
                                {/* <td>{`${vendor.HouseNo}, ${vendor.address}, ${vendor.PinCode}` || "Not-Available"}</td> */}
                                <td>
                                    <Toggle
                                        isActive={vendor.isDeactive}
                                        onToggle={() => handleToggle(vendor._id, vendor.isDeactive)} // Pass vendor id and current active status
                                    />
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(vendor._id)} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                        Delete
                                    </button>
                                </td>
                                <td>
                                    <Link to={`/vendors/edit-vendor/${vendor._id}`} className="btn btn-danger">Edit</Link>
                                </td>
                                <td>{new Date(vendor.createdAt).toLocaleString() || "Not-Available"}</td>
                            </tr>
                        ))}
                        productLength={vendors.length}
                        productsPerPage={productsPerPage}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                        href="/vendors/add-employ"
                        text="Add Employee"
                        errorMsg=""
                        handleOpen={() => { }}
                        ExcelText="Export to Excel"
                        excelHref={'/download-employ-data'}
                    />
                    {modalVisible && selectedVendor && (
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="false">
                            <div className="modal-dialog modal-xl" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Employee Detail</h5>
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
                                                    <td style={{ width: '28%' }}>Employee Name</td>
                                                    <td>{selectedVendor.ownerName || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Employee Number</td>
                                                    <td>{selectedVendor.ContactNumber || "Not Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>Email</td>
                                                    <td>{selectedVendor.Email || "Not Available"}</td>
                                                </tr>
                                                {/* <tr>
                                                    <td style={{ width: '28%' }}>Year of Registration</td>
                                                    <td>{selectedVendor.yearOfRegistration || "Not Available"}</td>
                                                </tr> */}
                                                <tr>
                                                    <td style={{ width: '28%' }}>Registered Address</td>
                                                    <td>{`${selectedVendor.HouseNo}, ${selectedVendor.address}, ${selectedVendor.PinCode}` || "Not-Available"}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '28%' }}>PAN No</td>
                                                    <td>{selectedVendor.panNo || "Not Available"}</td>
                                                </tr>
                                                {/* <tr>
                                                    <td style={{ width: '28%' }}>GST No</td>
                                                    <td>{selectedVendor.gstNo || "Not Available"}</td>
                                                </tr> */}
                                                <tr>
                                                    <td style={{ width: '28%' }}>Aadhar No</td>
                                                    <td>{selectedVendor.adharNo || "Not Available"}</td>
                                                </tr>
                                                {/* <tr>
                                                    <td style={{ width: '28%' }}>Membership Plan</td>
                                                    <td>{selectedVendor?.memberShipPlan?.name || "No Plan is activated"}</td>
                                                </tr> */}
                                                <tr>
                                                    <td style={{ width: '28%' }}>Type</td>
                                                    <td>{selectedVendor?.Role || "No Plan is activated"}</td>
                                                </tr>
                                            </tbody>

                                        </table>
                                        {/* <h5 style={{ fontWeight: 600 }} className="mt-4">Members</h5> */}
                                        {/* <table className="table table-bordered mt-4">
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

                                        </table> */}
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
                                            {/* <div className="col-md-4 text-center">
                                                <h6 style={{ fontWeight: '700' }} className=' mb-3'>GST Image</h6>
                                                {selectedVendor.gstImage?.url ? (
                                                    <a href={selectedVendor.gstImage.url} target="_blank" rel="noopener noreferrer">
                                                        <img style={{ width: "100px", height: "auto", borderRadius: "8px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)" }} src={selectedVendor.gstImage.url} alt="GST" />
                                                    </a>
                                                ) : (
                                                    <p>No Image Available</p>
                                                )}
                                            </div> */}
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
                    )}
                </>
            )}
        </div>
    )
}

export default AllEmploy
