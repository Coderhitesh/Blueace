import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import Toggle from '../../components/Forms/toggle';
import moment from 'moment';

function AllVendors() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [filterText, setFilterText] = useState("");
    const [registerAddress, setRegisterAddress] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const productsPerPage = 10;

    const fetchVendorDetail = async () => {
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/all-vendor');
            const vendorsData = res.data.data.filter((item) => item.Role === "vendor").reverse();
            setVendors(vendorsData);
        } catch (error) {
            toast.error('An error occurred while fetching vendor data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorDetail();
    }, []);

    // Filtering logic
    const filteredVendors = vendors.filter((vendor) => {
        const companyNameMatch = vendor.companyName.toLowerCase().includes(filterText.toLowerCase());
        const registerAddressMatch = vendor.registerAddress.toLowerCase().includes(registerAddress.toLowerCase());
        const vendorDate = moment(vendor.createdAt);
        const startDateMatch = startDate ? vendorDate.isSameOrAfter(moment(startDate).startOf('day')) : true;
        const endDateMatch = endDate ? vendorDate.isSameOrBefore(moment(endDate).endOf('day')) : true;

        return companyNameMatch && registerAddressMatch && startDateMatch && endDateMatch;
    });

    // Pagination logic
    const indexOfLastVendor = currentPage * productsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - productsPerPage;
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

    // Toggle vendor active/deactive status
    const handleToggle = async (id, currentDeactiveStatus) => {
        try {
            const response = await axios.put(`https://www.api.blueaceindia.com/api/v1/update-deactive-status/${id}`, {
                isDeactive: !currentDeactiveStatus
            });
            if (response.data.success) {
                toast.success('Vendor status updated successfully.');
                fetchVendorDetail();
            } else {
                toast.error('Failed to update vendor status.');
            }
        } catch (error) {
            toast.error("Error updating the status");
        }
    };

    // Delete vendor
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-vendor/${id}`);
            if (response.data.success) {
                toast.success('Vendor deleted successfully.');
                fetchVendorDetail();
            } else {
                toast.error('Failed to delete vendor.');
            }
        } catch (error) {
            toast.error('Error deleting the vendor.');
        }
    };

    const handleView = (vendor) => {
        setSelectedVendor(vendor);
        setModalVisible(true);
    };

    const headers = ['S.No', 'Company Name', 'Owner Name', 'Owner Number', 'Email', "Type", 'View', 'Deactive', 'Delete', 'Created At'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Vendors'} subHeading={'Vendors'} LastHeading={'All Vendors'} backLink={'/users/all-users'} />
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
                                    <label htmlFor="" className='form-label'>Search by Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Search by Company Name"
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="" className='form-label'>Search by Address</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Search by Register Address"
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

                    {/* Vendor Table */}
                    <Table
                        headers={headers}
                        elements={currentVendors.map((vendor, index) => (
                            <tr key={vendor._id}>
                                <td>{index + 1}</td>
                                <td>{vendor.companyName}</td>
                                <td>{vendor.ownerName || "Not-Available"}</td>
                                <td>{vendor.ContactNumber || "Not-Available"}</td>
                                <td>{vendor.Email || "Not-Available"}</td>
                                <td>{vendor.Role || "Not-Available"}</td>
                                <td>
                                    <button className="btn btn-info" onClick={() => handleView(vendor)}>View</button>
                                </td>
                                <td>
                                    <Toggle
                                        isActive={vendor.isDeactive}
                                        onToggle={() => handleToggle(vendor._id, vendor.isDeactive)}
                                    />
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDelete(vendor._id)}>Delete</button>
                                </td>
                                <td>{new Date(vendor.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        productLength={filteredVendors.length}
                        productsPerPage={productsPerPage}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                        href="/vendors/add-vendor"
                        text="Add Vendor"
                    />

                    {/* Modal for Vendor Details */}
                    {/* Modal for Vendor Details */}
                    {modalVisible && selectedVendor && (
                        <div className="modal fade show" style={{ display: 'block' }}>
                            <div className="modal-dialog modal-xl">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Vendor Details</h5>
                                        <button className="close" onClick={() => setModalVisible(false)}>&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Company Name:</h6>
                                                <p>{selectedVendor.companyName}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Owner Name:</h6>
                                                <p>{selectedVendor.ownerName || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Contact Number:</h6>
                                                <p>{selectedVendor.ContactNumber || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Email:</h6>
                                                <p>{selectedVendor.Email || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Year of Registration:</h6>
                                                <p>{selectedVendor.yearOfRegistration || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Register Address:</h6>
                                                <p>{selectedVendor.registerAddress || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>PAN Number:</h6>
                                                <p>{selectedVendor.panNo || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>GST Number:</h6>
                                                <p>{selectedVendor.gstNo || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Aadhar Number:</h6>
                                                <p>{selectedVendor.adharNo || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Payment Status:</h6>
                                                <p>{selectedVendor.PaymentStatus || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Average Rating:</h6>
                                                <p>{selectedVendor.averageRating || "Not Available"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Verified:</h6>
                                                <p>{selectedVendor.verifyed ? "Yes" : "No"}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                                                <h6 className=' mb-2'>Ready to Work:</h6>
                                                <p>{selectedVendor.readyToWork ? "Yes" : "No"}</p>
                                            </div>

                                            {/* Image Section */}
                                            <div className="row">
                                            <div className=" col-lg-6 col-md-6 col-sm-6 mb-3">
                                                <h6>PAN Image:</h6>
                                                {selectedVendor.panImage?.url ? (
                                                    <img src={selectedVendor.panImage.url} className=' mt-2' alt="PAN" style={{ width: '50%', height: '150px'  }} />
                                                ) : (
                                                    <p>Not Available</p>
                                                )}
                                            </div>
                                            <div className=" col-lg-6 col-md-6 col-sm-6 mb-3">
                                                <h6>Aadhar Image:</h6>
                                                {selectedVendor.adharImage?.url ? (
                                                    <img src={selectedVendor.adharImage.url} className=' mt-2' alt="Aadhar" style={{ width: '50%', height: '150px'  }} />
                                                ) : (
                                                    <p>Not Available</p>
                                                )}
                                            </div>
                                            <div className=" col-lg-6 col-md-6 col-sm-6 mb-3">
                                                <h6>GST Image:</h6>
                                                {selectedVendor.gstImage?.url ? (
                                                    <img src={selectedVendor.gstImage.url} className=' mt-2' alt="GST" style={{ width: '50%', height: '150px'  }} />
                                                ) : (
                                                    <p>Not Available</p>
                                                )}
                                            </div>
                                            <div className=" col-lg-6 col-md-6 col-sm-6 mb-3">
                                                <h6>Vendor Image:</h6>
                                                {selectedVendor.vendorImage?.url ? (
                                                    <img src={selectedVendor.vendorImage.url} className=' mt-2' alt="Vendor" style={{ width: '50%', height: '150px'  }} />
                                                ) : (
                                                    <p>Not Available</p>
                                                )}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" onClick={() => setModalVisible(false)}>Close</button>
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

export default AllVendors;