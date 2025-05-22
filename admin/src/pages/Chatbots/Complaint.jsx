import React, { useState, useEffect } from 'react';

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const allowedStatuses = ['pending', 'in-progress', 'resolved', 'rejected'];

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.chatbot.adsdigitalmedia.com/api/auth/complaints?metacode=chatbot-QUP9P-CCQS2');
      const data = await response.json();
      
      if (data && data.bookings) {
        setComplaints(data.bookings);
        setTotalComplaints(data.total || 0);
        setCurrentPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch complaints: ' + err.message);
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  // Change complaint status
  const changeStatus = async (complaintId, newStatus) => {
    try {
      const response = await fetch('https://api.chatbot.adsdigitalmedia.com/api/auth/change-status-complains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: complaintId,
          status: newStatus
        })
      });
      
      if (response.ok) {
        // Update the local state
        setComplaints(prev => 
          prev.map(complaint => 
            complaint._id === complaintId 
              ? { ...complaint, status: newStatus }
              : complaint
          )
        );
        alert('Status updated successfully!');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
      console.error('Error updating status:', err);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = searchTerm === '' || 
      complaint.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complaintId.toLowerCase().includes(`comp-${searchTerm}`.toLowerCase());
    
    const matchesName = nameFilter === '' || 
      complaint.name.toLowerCase().includes(nameFilter.toLowerCase());
    
    const matchesPhone = phoneFilter === '' || 
      complaint.phone.includes(phoneFilter);
    
    const matchesStatus = statusFilter === '' || 
      complaint.status === statusFilter;
    
    const complaintDate = new Date(complaint.createdAt);
    const matchesDateFrom = dateFromFilter === '' || 
      complaintDate >= new Date(dateFromFilter);
    
    const matchesDateTo = dateToFilter === '' || 
      complaintDate <= new Date(dateToFilter + 'T23:59:59');
    
    return matchesSearch && matchesName && matchesPhone && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'comp-status-pending';
      case 'in-progress': return 'comp-status-progress';
      case 'resolved': return 'comp-status-resolved';
      case 'rejected': return 'comp-status-rejected';
      default: return 'comp-status-default';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setNameFilter('');
    setPhoneFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setStatusFilter('');
  };

  if (loading) {
    return (
      <div className="comp-container">
        <div className="comp-loading">
          <div className="comp-spinner"></div>
          <span>Loading complaints...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .comp-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .comp-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .comp-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .comp-title {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }

        .comp-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .comp-body {
          padding: 24px;
        }

        .comp-alert {
          background: #f8d7da;
          color: #721c24;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .comp-alert-close {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
        }

        .comp-filters {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .comp-filters-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #495057;
        }

        .comp-filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          align-items: end;
        }

        .comp-form-group {
          display: flex;
          flex-direction: column;
        }

        .comp-label {
          font-size: 14px;
          font-weight: 500;
          color: #495057;
          margin-bottom: 6px;
        }

        .comp-input,
        .comp-select {
          padding: 10px 12px;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s ease;
          background: white;
        }

        .comp-input:focus,
        .comp-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .comp-help-text {
          font-size: 12px;
          color: #6c757d;
          margin-top: 4px;
        }

        .comp-btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .comp-btn-outline {
          background: white;
          color: #6c757d;
          border: 2px solid #e9ecef;
        }

        .comp-btn-outline:hover {
          background: #f8f9fa;
          border-color: #dee2e6;
        }

        .comp-btn-primary {
          background: #667eea;
          color: white;
        }

        .comp-btn-primary:hover {
          background: #5a6fd8;
        }

        .comp-results-info {
          color: #6c757d;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .comp-filter-active {
          color: #667eea;
          font-weight: 500;
        }

        .comp-table-container {
          overflow-x: auto;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .comp-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .comp-table-header {
          background: #343a40;
          color: white;
        }

        .comp-table th,
        .comp-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .comp-table th {
          font-weight: 600;
          font-size: 14px;
        }

        .comp-table tbody tr:hover {
          background: #f8f9fa;
        }

        .comp-table-empty {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .comp-table-empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .comp-complaint-id {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 13px;
        }

        .comp-name {
          font-weight: 500;
          color: #212529;
        }

        .comp-phone {
          color: #667eea;
          text-decoration: none;
        }

        .comp-phone:hover {
          text-decoration: underline;
        }

        .comp-category,
        .comp-service {
          font-size: 13px;
          color: #6c757d;
        }

        .comp-description {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          color: #495057;
        }

        .comp-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .comp-status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .comp-status-progress {
          background: #cce5ff;
          color: #004085;
        }

        .comp-status-resolved {
          background: #d4edda;
          color: #155724;
        }

        .comp-status-rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .comp-status-default {
          background: #e2e3e5;
          color: #383d41;
        }

        .comp-date {
          font-size: 13px;
          color: #6c757d;
        }

        .comp-dropdown {
          position: relative;
          display: inline-block;
        }

        .comp-dropdown-btn {
          background: white;
          border: 2px solid #667eea;
          color: #667eea;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .comp-dropdown-btn:hover {
          background: #f8f9fa;
        }

        .comp-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-width: 150px;
          z-index: 1000;
          display: none;
        }

        .comp-dropdown-menu.show {
          display: block;
        }

        .comp-dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          color: #495057;
        }

        .comp-dropdown-item:hover {
          background: #f8f9fa;
        }

        .comp-dropdown-item.active {
          background: #667eea;
          color: white;
        }

        .comp-dropdown-item:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .comp-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .comp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .comp-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .comp-container {
            padding: 10px;
          }
          
          .comp-filters-grid {
            grid-template-columns: 1fr;
          }
          
          .comp-table-container {
            font-size: 12px;
          }
          
          .comp-table th,
          .comp-table td {
            padding: 8px;
          }
        }
      `}</style>

      <div className="comp-container">
        <div className="comp-card">
          <div className="comp-header">
            <h1 className="comp-title">Complaint Management System</h1>
            <div className="comp-badge">{totalComplaints} Total</div>
          </div>
          
          <div className="comp-body">
            {error && (
              <div className="comp-alert">
                {error}
                <button className="comp-alert-close" onClick={() => setError('')}>
                  ×
                </button>
              </div>
            )}

            {/* Filters Section */}
            <div className="comp-filters">
              <h3 className="comp-filters-title">Filters</h3>
              <div className="comp-filters-grid">
                <div className="comp-form-group">
                  <label className="comp-label">Search by Complaint ID</label>
                  <input
                    type="text"
                    className="comp-input"
                    placeholder="Enter complaint number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="comp-help-text">You can search with or without 'COMP-' prefix</div>
                </div>
                
                <div className="comp-form-group">
                  <label className="comp-label">Name</label>
                  <input
                    type="text"
                    className="comp-input"
                    placeholder="Filter by name..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                </div>
                
                <div className="comp-form-group">
                  <label className="comp-label">Phone</label>
                  <input
                    type="text"
                    className="comp-input"
                    placeholder="Filter by phone..."
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                  />
                </div>
                
                <div className="comp-form-group">
                  <label className="comp-label">Status</label>
                  <select
                    className="comp-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    {allowedStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="comp-form-group">
                  <label className="comp-label">Date From</label>
                  <input
                    type="date"
                    className="comp-input"
                    value={dateFromFilter}
                    onChange={(e) => setDateFromFilter(e.target.value)}
                  />
                </div>
                
                <div className="comp-form-group">
                  <label className="comp-label">Date To</label>
                  <input
                    type="date"
                    className="comp-input"
                    value={dateToFilter}
                    onChange={(e) => setDateToFilter(e.target.value)}
                  />
                </div>
                
                <div className="comp-form-group">
                  <button
                    className="comp-btn comp-btn-outline"
                    onClick={clearFilters}
                    title="Clear all filters"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="comp-results-info">
              Showing {filteredComplaints.length} of {totalComplaints} complaints
              {(searchTerm || nameFilter || phoneFilter || statusFilter || dateFromFilter || dateToFilter) && 
                <span className="comp-filter-active"> (filtered)</span>
              }
            </div>

            {/* Table */}
            <div className="comp-table-container">
              <table className="comp-table">
                <thead className="comp-table-header">
                  <tr>
                    <th>Complaint ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Category</th>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="comp-table-empty">
                        <div className="comp-table-empty-icon">📥</div>
                        <p>No complaints found matching your criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <tr key={complaint._id}>
                        <td>
                          <span className="comp-complaint-id">{complaint.complaintId}</span>
                        </td>
                        <td className="comp-name">{complaint.name}</td>
                        <td>
                          <a href={`tel:${complaint.phone}`} className="comp-phone">
                            {complaint.phone}
                          </a>
                        </td>
                        <td className="comp-category">{complaint.selectedCategory}</td>
                        <td className="comp-service">{complaint.selectedService}</td>
                        <td>
                          <div className="comp-description" title={complaint.description}>
                            {complaint.description}
                          </div>
                        </td>
                        <td>
                          <span className={`comp-status ${getStatusClass(complaint.status)}`}>
                            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}
                          </span>
                        </td>
                        <td className="comp-date">{formatDate(complaint.createdAt)}</td>
                        <td>
                          <StatusDropdown 
                            complaint={complaint} 
                            allowedStatuses={allowedStatuses}
                            onStatusChange={changeStatus}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="comp-actions">
              <button
                className="comp-btn comp-btn-primary"
                onClick={fetchComplaints}
                disabled={loading}
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Status Dropdown Component
const StatusDropdown = ({ complaint, allowedStatuses, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (newStatus) => {
    onStatusChange(complaint._id, newStatus);
    setIsOpen(false);
  };

  return (
    <div className="comp-dropdown">
      <button
        className="comp-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        Change Status ▼
      </button>
      {isOpen && (
        <div className="comp-dropdown-menu show">
          {allowedStatuses.map((status) => (
            <button
              key={status}
              className={`comp-dropdown-item ${complaint.status === status ? 'active' : ''}`}
              onClick={() => handleStatusChange(status)}
              disabled={complaint.status === status}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              {complaint.status === status && ' ✓'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Complaint;