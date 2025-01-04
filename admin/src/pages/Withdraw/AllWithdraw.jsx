import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import moment from 'moment';

function AllWithdraw() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState(""); // For company name, email, and number filters
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedVendor, setSelectedVendor] = useState(null); // 


  const productsPerPage = 10;

  const fetchVendorDetail = async () => {
    try {
      const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-withdraw-request');
      const allData = res.data.data;
      setVendors(allData.reverse());
    } catch (error) {
      toast.error('An error occurred while fetching vendor data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorDetail();
  }, []);

  const handleBankDetail = (bank) => {
    setModalVisible(true);
    setSelectedVendor(bank);
  }

  // Handle status update
  const handleStatusChange = async (withdrawId, newStatus,vendor) => {
    try {
      const response = await axios.put(`https://www.api.blueaceindia.com/api/v1/update-withdraw-status/${withdrawId}`, {
        status: newStatus,
        vendorId: vendor // assuming this is the vendor ID
      });
      if (response.data.success) {
        toast.success('Withdraw status updated successfully.');
        fetchVendorDetail(); // Re-fetch vendor data to reflect status change
      } else {
        toast.error('Failed to update withdraw status.');
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Internal server error",error)
    }
  };

  // Filtering logic
  const filteredVendors = vendors.filter((vendor) => {
    const vendorDate = moment(vendor.createdAt);
    const startDateMatch = startDate ? vendorDate.isSameOrAfter(moment(startDate).startOf('day')) : true;
    const endDateMatch = endDate ? vendorDate.isSameOrBefore(moment(endDate).endOf('day')) : true;

    // Check if any of the fields (company name, email, number) match
    const filterTextMatch =
      (vendor?.vendor?.ownerName?.toLowerCase().includes(filterText.toLowerCase()) ||
        vendor?.vendor?.Email?.toLowerCase().includes(filterText.toLowerCase()) ||
        vendor?.vendor?.ContactNumber?.includes(filterText));

    return startDateMatch && endDateMatch && filterTextMatch;
  });

  // Pagination logic
  const indexOfLastVendor = currentPage * productsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - productsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  // Delete vendor
  const handleDelete = async (id) => {
    setLoading(true)
    try {
      const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-withdraw-request/${id}`);
      if (response.data.success) {
        toast.success('Withdraw Request deleted successfully.');
        fetchVendorDetail();
        setLoading(false)
      } else {
        toast.error('Failed to delete withdraw request.');
      }
    } catch (error) {
      toast.error('Error deleting the withdraw request.');
      console.log("Internal server error",error)
    }finally{
      setLoading(false)
    }
  };

  const headers = ['S.No', 'Amount', 'Name', 'Number', 'Email', "Role", "Bank Detail", "Status", 'Delete', 'Created At'];

  return (
    <div className='page-body'>
      <Breadcrumb heading={'Withdraw'} subHeading={'Withdraws'} LastHeading={'All Withdraw'} backLink={'/withdraw/all-withdraw'} />
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
                  <label htmlFor="" className='form-label'>Search by Company Name / Email / Number</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search by Company Name, Email, or Number"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
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
                <td>Rs.{vendor.amount}</td>
                <td>{vendor?.vendor?.ownerName || "Not-Available"}</td>
                <td>{vendor?.vendor?.ContactNumber || "Not-Available"}</td>
                <td>{vendor?.vendor?.Email || "Not-Available"}</td>
                <td>{vendor?.vendor?.Role || "Not-Available"}</td>
                <td>
                  {vendor?.vendor?.bankDetail ? (
                    <button className="btn btn-info btn-activity-view rounded-pill px-4 py-2 shadow-sm" type="button" onClick={() => handleBankDetail(vendor?.vendor?.bankDetail)}>
                      View
                    </button>
                  ) : (
                    <span>Bank Detail Not Available</span>
                  )}
                </td>
                <td>
                  <select
                    className="form-control"
                    value={vendor.status}
                    onChange={(e) => handleStatusChange(vendor._id, e.target.value,vendor?.vendor?._id)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-danger" disabled={loading} onClick={() => handleDelete(vendor._id)}>{loading ? 'Deleting..':'Delete'}</button>
                </td>
                <td>{new Date(vendor.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            productLength={filteredVendors.length}
            productsPerPage={productsPerPage}
            currentPage={currentPage}
            paginate={setCurrentPage}
            href=""
            text=""
          />
        </>
      )}
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
                      <td>Account Holder Name</td>
                      <td>{selectedVendor.accountHolderName || "Not Available"}</td>
                    </tr>
                    <tr>
                      <td>Account Number</td>
                      <td>{selectedVendor.accountNumber || "Not Available"}</td>
                    </tr>
                    <tr>
                      <td>Bank Name</td>
                      <td>{selectedVendor.bankName || "Not Available"}</td>
                    </tr>
                    <tr>
                      <td>Branch Name</td>
                      <td>{selectedVendor.branchName || "Not Available"}</td>
                    </tr>
                    <tr>
                      <td>IFSC Code</td>
                      <td>{selectedVendor.ifscCode || "Not Available"}</td>
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
    </div>
  );
}

export default AllWithdraw;
