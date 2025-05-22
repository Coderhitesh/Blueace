import React, { useState, useEffect } from 'react';
import './BookingsChatBot.css';
import axios from 'axios';

const BookingsChatBot = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [totalBookings, setTotalBookings] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10); // Set items per page

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modal states
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const allowedStatuses = ['confirmed', 'completed', 'cancelled'];

    // Fixed fetchBookings function with proper pagination support
    const fetchBookings = async (page = 1) => {
        try {
            setLoading(true);
            
            // Build query parameters
            const params = new URLSearchParams({
                metacode: 'chatbot-QUP9P-CCQS2',
                limit: itemsPerPage.toString(),
                page: page.toString()
            });

            const response = await fetch(`https://api.chatbot.adsdigitalmedia.com/api/auth/get-my-booking?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.bookings) {
                setBookings(data.bookings);
                setTotalBookings(data.total || data.bookings.length);
                setCurrentPage(data.page || page);
                
                // Calculate total pages
                const calculatedTotalPages = Math.ceil((data.total || data.bookings.length) / itemsPerPage);
                setTotalPages(calculatedTotalPages || 1);
            } else {
                setBookings([]);
                setTotalBookings(0);
                setTotalPages(1);
            }
            setError('');
        } catch (err) {
            setError('Failed to fetch bookings: ' + err.message);
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fixed pagination handlers
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
            fetchBookings(page);
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

    const confirmBooking = async (bookingId) => {
        try {
            setActionLoading(true);

            const response = await axios.post(
                `https://api.chatbot.adsdigitalmedia.com/api/auth/booking-status/confirm/${bookingId}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result = response.data;

            if (result.success) {
                setSuccess('Booking confirmed successfully!');
                setBookings(prev =>
                    prev.map(booking =>
                        booking._id === bookingId
                            ? { ...booking, status: 'confirmed' }
                            : booking
                    )
                );
                setTimeout(() => setSuccess(''), 3000);
            } else {
                throw new Error(result.message || 'Failed to confirm booking');
            }
        } catch (err) {
            console.error('Error confirming booking:', err);
            setError('Failed to confirm booking: ' + (err.response?.data?.message || err.message));
            setTimeout(() => setError(''), 5000);
        } finally {
            setActionLoading(false);
        }
    };

    const cancelBooking = async (bookingId, reason) => {
        try {
            setActionLoading(true);
            const response = await axios.post(
                `https://api.chatbot.adsdigitalmedia.com/api/auth/booking-status/cancel/${bookingId}`,
                { cancelReason: reason },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result = response.data;

            if (result.success) {
                setSuccess('Booking cancelled successfully!');
                setBookings(prev =>
                    prev.map(booking =>
                        booking._id === bookingId
                            ? { ...booking, status: 'cancelled', cancelReason: reason }
                            : booking
                    )
                );
                setShowCancelModal(false);
                setCancelReason('');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                throw new Error(result.message || 'Failed to cancel booking');
            }
        } catch (err) {
            console.log('Error cancelling booking:', err);
            setError('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
            setTimeout(() => setError(''), 5000);
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    const handleCancelClick = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
        setCancelReason('');
    };

    // Filter bookings (client-side filtering on current page)
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = searchTerm === '' ||
            booking.Booking_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.Booking_id?.toLowerCase().includes(`book-${searchTerm}`.toLowerCase());

        const matchesName = nameFilter === '' ||
            booking.name?.toLowerCase().includes(nameFilter.toLowerCase());

        const matchesPhone = phoneFilter === '' ||
            booking.phone?.includes(phoneFilter);

        const matchesStatus = statusFilter === '' ||
            booking.status === statusFilter;

        const bookingDate = new Date(booking.createdAt);
        const matchesDateFrom = dateFromFilter === '' ||
            bookingDate >= new Date(dateFromFilter);

        const matchesDateTo = dateToFilter === '' ||
            bookingDate <= new Date(dateToFilter + 'T23:59:59');

        return matchesSearch && matchesName && matchesPhone && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    useEffect(() => {
        fetchBookings(1); // Start with page 1
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
            fetchBookings(1);
        }
    }, [searchTerm, nameFilter, phoneFilter, statusFilter, dateFromFilter, dateToFilter]);

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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
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
            case 'confirmed': return 'comp-status-confirmed';
            case 'completed': return 'comp-status-completed';
            case 'cancelled': return 'comp-status-cancelled';
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
        // Reset to page 1 when clearing filters
        setCurrentPage(1);
        fetchBookings(1);
    };

    // Fixed refresh function
    const handleRefresh = () => {
        fetchBookings(currentPage);
    };

    if (loading) {
        return (
            <div className="comp-container">
                <div className="comp-loading">
                    <div className="comp-spinner"></div>
                    <span>Loading bookings...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="comp-container">
            <div className="comp-card">
                <div className="comp-header">
                    <h1 className="comp-title">Bookings Via Chatbot Management System</h1>
                    <div className="comp-badge">{totalBookings} Total</div>
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

                    {success && (
                        <div className="comp-alert comp-alert-success">
                            {success}
                            <button className="comp-alert-close" onClick={() => setSuccess('')}>
                                ×
                            </button>
                        </div>
                    )}

                    {/* Filters Section */}
                    <div className="comp-filters">
                        <h3 className="comp-filters-title">Filters</h3>
                        <div className="comp-filters-grid">
                            <div className="comp-form-group">
                                <label className="comp-label">Search by Booking ID</label>
                                <input
                                    type="text"
                                    className="comp-input"
                                    placeholder="Enter booking number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="comp-help-text">You can search with or without 'BOOK-' prefix</div>
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
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
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
                        Showing {filteredBookings.length} of {totalBookings} Bookings
                        {(searchTerm || nameFilter || phoneFilter || statusFilter || dateFromFilter || dateToFilter) &&
                            <span className="comp-filter-active"> (filtered)</span>
                        }
                        <span className="comp-page-info"> | Page {currentPage} of {totalPages}</span>
                    </div>

                    {/* Table */}
                    <div className="comp-table-container">
                        <table className="comp-table">
                            <thead className="comp-table-header">
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Category</th>
                                    <th>Service</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th>Service Date</th>
                                    <th>Created Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="comp-table-empty">
                                            <div className="comp-table-empty-icon">📥</div>
                                            <p>No bookings found matching your criteria.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking._id}>
                                            <td>
                                                <span className="comp-booking-id">{booking.Booking_id}</span>
                                            </td>
                                            <td className="comp-name">{booking.name || 'N/A'}</td>
                                            <td>
                                                <a href={`tel:${booking.phone}`} className="comp-phone">
                                                    {booking.phone || 'N/A'}
                                                </a>
                                            </td>
                                            <td className="comp-category">{booking.selectedCategory || 'N/A'}</td>
                                            <td className="comp-service">{booking.selectedService || 'N/A'}</td>
                                            <td>
                                                <div className="comp-description" title={booking.address}>
                                                    {booking.address || 'N/A'}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`comp-status ${getStatusClass(booking.status)}`}>
                                                    {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="comp-date">{formatDate(booking.serviceDate)}</td>
                                            <td className="comp-date">{formatDate(booking.createdAt)}</td>
                                            <td>
                                                <div className="comp-actions-cell">
                                                    <button
                                                        className="comp-btn comp-btn-primary comp-btn-sm"
                                                        onClick={() => handleViewDetails(booking)}
                                                    >
                                                        👁️ View
                                                    </button>

                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <button
                                                                className="comp-btn comp-btn-success comp-btn-sm"
                                                                onClick={() => confirmBooking(booking._id)}
                                                                disabled={actionLoading}
                                                            >
                                                                ✅ Confirm
                                                            </button>
                                                            <button
                                                                className="comp-btn comp-btn-danger comp-btn-sm"
                                                                onClick={() => handleCancelClick(booking)}
                                                                disabled={actionLoading}
                                                            >
                                                                ❌ Cancel
                                                            </button>
                                                        </>
                                                    )}

                                                    {booking.status === 'confirmed' && (
                                                        <button
                                                            className="comp-btn comp-btn-success comp-btn-sm"
                                                            onClick={() => {
                                                                // You can implement mark as completed functionality here
                                                                console.log('Mark as completed:', booking._id);
                                                            }}
                                                            disabled={actionLoading}
                                                        >
                                                            ✅ Complete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Fixed Pagination */}
                    {totalPages > 1 && (
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
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            🔄 Refresh Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="comp-modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="comp-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="comp-modal-header">
                            <h2 className="comp-modal-title">Booking Details</h2>
                            <button
                                className="comp-modal-close"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="comp-modal-body">
                            <div className="comp-detail-grid">
                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Booking ID</div>
                                    <div className="comp-detail-value">{selectedBooking.Booking_id}</div>
                                </div>

                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Status</div>
                                    <div className="comp-detail-value">
                                        <span className={`comp-status ${getStatusClass(selectedBooking.status)}`}>
                                            {selectedBooking.status ? selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1) : 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Customer Name</div>
                                    <div className="comp-detail-value">{selectedBooking.name || 'N/A'}</div>
                                </div>

                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Phone Number</div>
                                    <div className="comp-detail-value">
                                        <a href={`tel:${selectedBooking.phone}`} className="comp-phone">
                                            {selectedBooking.phone || 'N/A'}
                                        </a>
                                    </div>
                                </div>

                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Email</div>
                                    <div className="comp-detail-value">
                                        {selectedBooking.email ? (
                                            <a href={`mailto:${selectedBooking.email}`} className="comp-phone">
                                                {selectedBooking.email}
                                            </a>
                                        ) : 'N/A'}
                                    </div>
                                </div>

                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Category</div>
                                    <div className="comp-detail-value">{selectedBooking.selectedCategory || 'N/A'}</div>
                                </div>

                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Service</div>
                                    <div className="comp-detail-value">{selectedBooking.selectedService || 'N/A'}</div>
                                </div>

                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Service Date</div>
                                    <div className="comp-detail-value">{formatDate(selectedBooking.serviceDate)}</div>
                                </div>

                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Service Time</div>
                                    <div className="comp-detail-value">{selectedBooking.serviceTime || 'N/A'}</div>
                                </div>

                                <div className="comp-detail-item">
                                    <div className="comp-detail-label">Created Date</div>
                                    <div className="comp-detail-value">{formatDate(selectedBooking.createdAt)}</div>
                                </div>

                                <div className="comp-detail-item comp-detail-full">
                                    <div className="comp-detail-label">Address</div>
                                    <div className="comp-detail-value">{selectedBooking.address || 'N/A'}</div>
                                </div>

                                {selectedBooking.description && (
                                    <div className="comp-detail-item comp-detail-full">
                                        <div className="comp-detail-label">Description</div>
                                        <div className="comp-detail-value">{selectedBooking.description}</div>
                                    </div>
                                )}

                                {selectedBooking.specialRequirements && (
                                    <div className="comp-detail-item comp-detail-full">
                                        <div className="comp-detail-label">Special Requirements</div>
                                        <div className="comp-detail-value">{selectedBooking.specialRequirements}</div>
                                    </div>
                                )}

                                {selectedBooking.cancelReason && (
                                    <div className="comp-detail-item comp-detail-full">
                                        <div className="comp-detail-label">Cancellation Reason</div>
                                        <div className="comp-detail-value">{selectedBooking.cancelReason}</div>
                                    </div>
                                )}

                                {selectedBooking.price && (
                                    <div className="comp-detail-item">
                                        <div className="comp-detail-label">Price</div>
                                        <div className="comp-detail-value">₹{selectedBooking.price}</div>
                                    </div>
                                )}

                                {selectedBooking.paymentStatus && (
                                    <div className="comp-detail-item">
                                        <div className="comp-detail-label">Payment Status</div>
                                        <div className="comp-detail-value">{selectedBooking.paymentStatus}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="comp-modal-footer">
                            {selectedBooking.status === 'pending' && (
                                <>
                                    <button
                                        className="comp-btn comp-btn-success"
                                        onClick={() => {
                                            confirmBooking(selectedBooking._id);
                                            setShowDetailsModal(false);
                                        }}
                                        disabled={actionLoading}
                                    >
                                        ✅ Confirm Booking
                                    </button>
                                    <button
                                        className="comp-btn comp-btn-danger"
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleCancelClick(selectedBooking);
                                        }}
                                        disabled={actionLoading}
                                    >
                                        ❌ Cancel Booking
                                    </button>
                                </>
                            )}
                            <button
                                className="comp-btn comp-btn-outline"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && selectedBooking && (
                <div className="comp-modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="comp-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="comp-modal-header">
                            <h2 className="comp-modal-title">Cancel Booking</h2>
                            <button
                                className="comp-modal-close"
                                onClick={() => setShowCancelModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="comp-modal-body">
                            <p>Are you sure you want to cancel this booking?</p>
                            <div className="comp-detail-item" style={{ marginBottom: '20px' }}>
                                <div className="comp-detail-label">Booking ID</div>
                                <div className="comp-detail-value">{selectedBooking.Booking_id}</div>
                            </div>
                            <div className="comp-detail-item" style={{ marginBottom: '20px' }}>
                                <div className="comp-detail-label">Customer</div>
                                <div className="comp-detail-value">{selectedBooking.name} - {selectedBooking.phone}</div>
                            </div>

                            <div className="comp-cancel-form">
                                <div className="comp-form-group">
                                    <label className="comp-label">Cancellation Reason *</label>
                                    <textarea
                                        className="comp-textarea"
                                        placeholder="Please provide a reason for cancelling this booking..."
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        required
                                    />
                                    <div className="comp-help-text">This reason will be shared with the customer</div>
                                </div>
                            </div>
                        </div>

                        <div className="comp-modal-footer">
                            <button
                                className="comp-btn comp-btn-danger"
                                onClick={() => cancelBooking(selectedBooking._id, cancelReason)}
                                disabled={actionLoading || !cancelReason.trim()}
                            >
                                {actionLoading ? 'Cancelling...' : '❌ Cancel Booking'}
                            </button>
                            <button
                                className="comp-btn comp-btn-outline"
                                onClick={() => setShowCancelModal(false)}
                                disabled={actionLoading}
                            >
                                Keep Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsChatBot;