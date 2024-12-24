import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Wallet({userData}) {
  const [allWithdraw, setAllWithDraw] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = userData?._id;

  const handleWalletFetch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://www.api.blueaceindia.com/api/v1/get-withdraw-request-by-vendorId/${userId}`);
      if (response.data?.data && Array.isArray(response.data.data)) {
        setAllWithDraw(response.data.data.reverse());
      } else {
        setAllWithDraw([]);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to load withdrawal requests");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleWalletFetch();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning';
      case 'approved':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-2">Wallet Dashboard</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Dashboard</li>
              <li className="breadcrumb-item active">Wallet</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-1">₹12,500</h4>
                  <p className="mb-0">Withdrawable Balance</p>
                </div>
                <div className="ms-3">
                  <i className="fas fa-wallet fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-1">₹18,000</h4>
                  <p className="mb-0">Total Earnings</p>
                </div>
                <div className="ms-3">
                  <i className="fas fa-money-bill-wave fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-1">312</h4>
                  <p className="mb-0">Total Reviews</p>
                </div>
                <div className="ms-3">
                  <i className="fas fa-star fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-1">616</h4>
                  <p className="mb-0">Total Orders</p>
                </div>
                <div className="ms-3">
                  <i className="fas fa-shopping-cart fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Requests Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-history me-2"></i>
              Withdrawal Requests
            </h5>
            <button className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              New Request
            </button>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : allWithdraw.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Request ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Vendor ID</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allWithdraw.map((request,index) => (
                    <tr key={request._id}>
                      <td>
                        <span className="fw-medium">#{request._id.slice(-8)}</span>
                      </td>
                      <td>
                        <span className="fw-bold">₹{request.amount.toLocaleString()}</span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">{request.vendor}</small>
                      </td>
                      <td>
                        {request.createdAt ? formatDate(request.createdAt) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <h5>No withdrawal requests found</h5>
              <p className="text-muted">Your withdrawal history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;