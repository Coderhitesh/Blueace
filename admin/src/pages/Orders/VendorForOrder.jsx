import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VendorForOrder.css';
import toast from 'react-hot-toast';
import StarRating from '../../components/StarRating/StarRating';
// import StarRating from './StarRating'; // Import the StarRating component

const VendorForOrder = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [preSelect, setPreSelect] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
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
        } catch (error) {
            console.error('Error fetching vendors', error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleAssignOrder = async (vendorId) => {
        try {
            const url = `https://www.api.blueaceindia.com/api/v1/assign-Vendor/${id}/${vendorId}/${type ? type : 'new-vendor'}`;
            const res = await axios.post(url);

            if (res.data.success) {
                toast.success(res.data.message);
                fetchData(currentPage);
            } else {
                toast.error(`Failed to assign order: ${res.data.message}`);
            }
        } catch (error) {
            console.error('Error assigning order:', error);
            toast.error('An error occurred while assigning the order. Please try again.');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center pt-5 mb-4">Vendors for Order #{id} Within 5km</h2>
            <div className="row">
                {data.map((vendor) => (
                    <div className="col-md-3 mb-4" key={vendor._id}>
                        <div className="card shadow-sm border-0 rounded-lg overflow-hidden">
                            <img
                                src={
                                    vendor?.vendorImage?.url ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.companyName || 'User')}&background=random`
                                }
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
                                <p className="card-text">
                                    <strong>Owner:</strong> {vendor.ownerName} <br />
                                    <strong>Contact:</strong> {vendor.ContactNumber} <br />
                                    <strong>Email:</strong> {vendor.Email} <br />
                                    <strong>Address:</strong> {vendor.registerAddress} <br />
                                    <strong>GST No:</strong> {vendor.gstNo} <br />
                                    <strong>PAN No:</strong> {vendor.panNo} <br />
                                </p>
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
