import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VendorForOrder.css';
import toast from 'react-hot-toast';
import StarRating from '../../components/StarRating/StarRating';
import verify from './verified.png';

const VendorForOrder = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [preSelect, setPreSelect] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [vendorSelections, setVendorSelections] = useState({}); // Track selections per vendor
    const { id } = useParams();
    const limit = 10;
    const url = new URLSearchParams(window.location.search);
    const type = url.get('type');

    const fetchData = async (page) => {
        try {
            const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/fetch-Vendor-By-Location`, {
                params: {
                    orderId: id,
                    Page: page,
                    limit,
                },
            });

            setPreSelect(res.data.AlreadyAllottedVendor);
            setData(res.data.data);
            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);

            // Initialize selections for pre-selected vendor
            if (res.data.AlreadyAllottedVendor && res.data.preSelectedDay && res.data.preSelectedTime) {
                setVendorSelections({
                    [res.data.AlreadyAllottedVendor]: {
                        day: res.data.preSelectedDay,
                        time: res.data.preSelectedTime
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching vendors', error);
            toast.error('Failed to fetch vendors');
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleAssignOrder = async (vendorId) => {
        const selection = vendorSelections[vendorId] || {};
        if (!selection.day || !selection.time) {
            toast.error('Please select both day and time');
            return;
        }

        try {
            const url = `https://www.api.blueaceindia.com/api/v1/assign-Vendor/${id}/${vendorId}/${type ? type : 'new-vendor'}/${selection.day}/${selection.time}`;
            const res = await axios.post(url);

            if (res.data.success) {
                toast.success(res.data.message);
                fetchData(currentPage);
            } else {
                toast.error(`Failed to assign order: ${res.data.message}`);
            }
        } catch (error) {
            console.error('Error assigning order:', error);
            toast.error(error?.response?.data?.message || 'Failed to assign order');
        }
    };

    const handleDayChange = (vendorId, day) => {
        setVendorSelections(prev => ({
            ...prev,
            [vendorId]: {
                ...prev[vendorId],
                day,
                time: '' // Reset time when day changes
            }
        }));
    };

    const handleTimeChange = (vendorId, time) => {
        setVendorSelections(prev => ({
            ...prev,
            [vendorId]: {
                ...prev[vendorId],
                time
            }
        }));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderTimeSlots = (vendor, selectedDay) => {
        const schedule = vendor.workingHour.schedule.find(s => s.day === selectedDay);
        if (!schedule) return null;

        const slots = [];
        if (schedule.morningSlot) {
            slots.push(<option key="morning" value={schedule.morningSlot}>Morning: {schedule.morningSlot}</option>);
        }
        if (schedule.afternoonSlot) {
            slots.push(<option key="afternoon" value={schedule.afternoonSlot}>Afternoon: {schedule.afternoonSlot}</option>);
        }
        if (schedule.eveningSlot) {
            slots.push(<option key="evening" value={schedule.eveningSlot}>Evening: {schedule.eveningSlot}</option>);
        }
        return slots;
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center pt-5 mb-4">Vendors for Order #{id} Within 5km</h2>
            <div className="row">
                {data.map((vendor) => {
                    const vendorSelection = vendorSelections[vendor._id] || {};
                    const isPreSelected = preSelect === vendor._id;

                    return (
                        <div className="col-md-3 mb-4" key={vendor._id}>
                            <div className="card shadow-sm border-0 rounded-lg overflow-hidden">
                                <img
                                    src={vendor?.vendorImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.companyName || 'User')}&background=random`}
                                    className="card-img-top vendor-image"
                                    onError={(e) => e.target.src = 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'}
                                    alt="Vendor"
                                />
                                <div className="card-body">
                                    <div className="star-hitesh mb-2">
                                        <StarRating rating={vendor.averageRating || 0} />
                                    </div>
                                    <h5 className="card-title">{vendor.companyName}</h5>
                                    <p className="card-text">
                                        <strong>Owner:</strong> {vendor.ownerName} <br />
                                        <strong>Contact:</strong> {vendor.ContactNumber} <br />
                                        <strong>Email:</strong> {vendor.Email} <br />
                                        <strong>Address:</strong> {`${vendor.HouseNo}, ${vendor.address}, ${vendor.PinCode}`} <br />
                                        <strong>GST No:</strong> {vendor.gstNo || 'Not Available'} <br />
                                        <strong>PAN No:</strong> {vendor.panNo}
                                    </p>

                                    {vendor.verifyed && (
                                        <img className="position-absolute top-0 left" src={verify} width={60} alt="Verified" />
                                    )}

                                    {/* Day Selection */}
                                    <div className="mb-3">
                                        <label>Select Day:</label>
                                        <select 
                                            className="form-control"
                                            value={vendorSelection.day || ''}
                                            onChange={(e) => handleDayChange(vendor._id, e.target.value)}
                                            disabled={isPreSelected}
                                        >
                                            <option value="">Select a day</option>
                                            {vendor?.workingHour?.schedule?.map((schedule, index) => (
                                                <option key={index} value={schedule.day}>
                                                    {schedule.day}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Time Selection */}
                                    {vendorSelection.day && (
                                        <div className="mb-3">
                                            <label>Select Time:</label>
                                            <select 
                                                className="form-control"
                                                value={vendorSelection.time || ''}
                                                onChange={(e) => handleTimeChange(vendor._id, e.target.value)}
                                                disabled={isPreSelected}
                                            >
                                                <option value="">Select a time</option>
                                                {renderTimeSlots(vendor, vendorSelection.day)}
                                            </select>
                                        </div>
                                    )}

                                    <button
                                        disabled={isPreSelected}
                                        className={`btn ${isPreSelected ? 'bg-danger' : 'bg-success'} btn-block text-white`}
                                        onClick={() => handleAssignOrder(vendor._id)}
                                    >
                                        {isPreSelected ? 'Already Selected' : 'Assign Order'}
                                    </button>

                                    {isPreSelected && (
                                        <span className="position-absolute top-0 end-0 m-2">
                                            <span className="badge bg-info">Already selected</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mt-4">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li className={`page-item ${i + 1 === currentPage ? 'active' : ''}`} key={i + 1}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default VendorForOrder;