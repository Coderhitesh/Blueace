import React, { useState, useEffect } from 'react';
import './BookingsChatBot.css'
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
  const fetchComplaints = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.chatbot.adsdigitalmedia.com/api/auth/complaints?metacode=chatbot-QUP9P-CCQS2&page=${page}&limit=10`,);
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

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchComplaints(page);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
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
              {totalPages > 1 && (
                <span className="comp-page-info"> - Page {currentPage} of {totalPages}</span>
              )}
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

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="comp-pagination">
                <button
                  className={`comp-pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="comp-pagination-numbers">
                  {getPageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      className={`comp-pagination-number ${pageNum === currentPage ? 'active' : ''
                        } ${pageNum === '...' ? 'dots' : ''}`}
                      onClick={() => pageNum !== '...' && handlePageChange(pageNum)}
                      disabled={pageNum === '...' || pageNum === currentPage}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  className={`comp-pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="comp-actions">
              <button
                className="comp-btn comp-btn-primary"
                onClick={() => fetchComplaints(currentPage)}
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