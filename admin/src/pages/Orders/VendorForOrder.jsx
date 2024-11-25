import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VendorForOrder.css';
import toast from 'react-hot-toast';
import StarRating from '../../components/StarRating/StarRating';
import verify from './verified.png'

const VendorForOrder = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [preSelect, setPreSelect] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const { id } = useParams();
    const limit = 10;
    const url = new URLSearchParams(window.location.search);
    const type = url.get('type');
    // console.log("day ",selectedDay)
    // console.log("time ",selectedTime)
    const [preSelectedDay, setPreSelectedDay] = useState('');
    const [preSelectedTime, setPreSelectedTime] = useState('');

    const fetchData = async (page) => {
        try {
            const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/fetch-Vendor-By-Location`, {
                params: {
                    orderId: id,
                    Page: page,
                    limit,
                },
            });

            setPreSelect(res.data.AlreadyAllottedVendor); // Vendor ID already allotted
            setData(res.data.data);
            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
            console.log("res.data.preSelectedDay", res.data.preSelectedDay)
            // Set pre-selected working day and time
            if (res.data.AlreadyAllottedVendor && res.data.preSelectedDay && res.data.preSelectedTime) {
                setPreSelectedDay(res.data.preSelectedDay); // Pre-selected working day from backend
                setPreSelectedTime(res.data.preSelectedTime); // Pre-selected working time from backend
                setSelectedDay(res.data.preSelectedDay);
                setSelectedTime(res.data.preSelectedTime);
                
            }
        } catch (error) {
            console.error('Error fetching vendors', error);
        }
    };


    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleAssignOrder = async (vendorId) => {
        try {
            const url = `https://www.api.blueaceindia.com/api/v1/assign-Vendor/${id}/${vendorId}/${type ? type : 'new-vendor'}/${selectedDay}/${selectedTime}`;
            // const res = await axios.post(url, {
            //     workingDay: selectedDay,
            //     workingTime: selectedTime,
            // });
            const res = await axios.post(url);

            if (res.data.success) {
                toast.success(res.data.message);
                fetchData(currentPage);
            } else {
                toast.error(`Failed to assign order: ${res.data.message}`);
            }
        } catch (error) {
            console.log('Error assigning order:', error);
            toast.error(error?.response?.data?.message);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
        // Reset selected time when the day changes
        setSelectedTime('');
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center pt-5 mb-4">Vendors for Order #{id} Within 5km</h2>
            <div className="row">
                {data.map((vendor) => (
                    <div className="col-md-3 mb-4" key={vendor._id}>
                        <div className="card shadow-sm border-0 rounded-lg overflow-hidden">
                            <img
                                src={vendor?.vendorImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.companyName || 'User')}&background=random`}
                                className="card-img-top vendor-image"
                                onError={(e) =>
                                    (e.target.src = 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg')
                                }
                                alt="Vendor Image"
                            />
                            <div className="card-body">
                                {/* Star Rating Component */}
                                <div className="star-hitesh mb-2">
                                    <StarRating rating={vendor.averageRating || 0} />
                                </div>
                                <h5 className="card-title">{vendor.companyName}</h5>
                                {/* {console.log("object", vendor)} */}
                                <p className="card-text">
                                    <strong>Owner:</strong> {vendor.ownerName} <br />
                                    <strong>Contact:</strong> {vendor.ContactNumber} <br />
                                    <strong>Email:</strong> {vendor.Email} <br />
                                    <strong>Address:</strong> {`${vendor.HouseNo}, ${vendor.address}, ${vendor.PinCode}`} <br />
                                    <strong>GST No:</strong> {vendor.gstNo || 'Not Available'} <br />
                                    <strong>PAN No:</strong> {vendor.panNo} <br />

                                </p>
                                {
                                    vendor.verifyed === true && (
                                        <img className=' position-absolute top-0 left' src={verify} width={60} alt="Verified Vendor" />
                                    )
                                }
                                {/* {console.log("vendor",vendor)} */}

                                {/* Day Selection with Pre-selected Day */}
                                <div className="mb-3">
                                    <label>Select Day:</label>
                                    <select className="form-control" value={selectedDay} onChange={handleDayChange}>
                                        <option value="">Select a day</option>
                                        {vendor?.workingHour?.schedule &&
                                            vendor?.workingHour?.schedule.map((schedule, index) => (
                                                <option key={index} value={schedule.day}>
                                                    {schedule.day}
                                                </option>
                                            ))}
                                    </select>
                                    {/* Show pre-selected day if available */}
                                    {preSelect === vendor._id && preSelectedDay && (
                                        <small className="text-info">Pre-selected Day: {preSelectedDay}</small>
                                    )}
                                </div>

                                {/* Time Selection with Pre-selected Time */}
                                {selectedDay && (
                                    <div className="mb-3">
                                        <label>Select Time:</label>
                                        <select className="form-control" value={selectedTime} onChange={handleTimeChange}>
                                            <option value="">Select a time</option>
                                            {vendor?.workingHour?.schedule
                                                .filter((schedule) => schedule.day === selectedDay)
                                                .map((schedule, index) => (
                                                    <>
                                                        {schedule.morningSlot && (
                                                            <option key={`morning-${index}`} value={schedule.morningSlot}>
                                                                Morning: {schedule.morningSlot}
                                                            </option>
                                                        )}
                                                        {schedule.afternoonSlot && (
                                                            <option key={`afternoon-${index}`} value={schedule.afternoonSlot}>
                                                                Afternoon: {schedule.afternoonSlot}
                                                            </option>
                                                        )}
                                                        {schedule.eveningSlot && (
                                                            <option key={`evening-${index}`} value={schedule.eveningSlot}>
                                                                Evening: {schedule.eveningSlot}
                                                            </option>
                                                        )}
                                                    </>
                                                ))}
                                        </select>
                                        {/* Show pre-selected time if available */}
                                        {preSelect === vendor._id && preSelectedTime && (
                                            <small className="text-info">Pre-selected Time: {preSelectedTime}</small>
                                        )}
                                    </div>
                                )}



                                <button
                                    disabled={preSelect === vendor._id}
                                    className={`btn ${preSelect === vendor._id ? 'bg-danger' : 'bg-success'} btn-block`}
                                    onClick={() => handleAssignOrder(vendor._id)}
                                >
                                    {preSelect === vendor._id ? 'I am Already selected' : 'Assign Order'}
                                </button>
                                <span className="position-absolute top-0 right">
                                    {preSelect === vendor._id && (
                                        <p className="badge text-bg-info">Already selected</p>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
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
