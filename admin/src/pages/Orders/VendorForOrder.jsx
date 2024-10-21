import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VendorForOrder.css'; // Create this CSS file for additional custom styles if needed
import toast from 'react-hot-toast'
const VendorForOrder = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [preSelect, setPreSelect] = useState(null)
    const [totalPages, setTotalPages] = useState(1);
    const { id } = useParams(); // Assuming id is the order ID
    const limit = 10;
    const url = new URLSearchParams(window.location.search)
    const type = url.get('type')
    const fetchData = async (page) => {
        try {
            const res = await axios.get(`https://api.blueace.co.in/api/v1/fetch-Vendor-By-Location`, {
                params: {
                    orderId: id,
                    Page: page,
                    limit,
                },
            });
            console.log(res.data)
            setPreSelect(res.data.AlreadyAlootedVebdor)
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
            let res;
            const url = `https://api.blueace.co.in/api/v1/assign-Vendor/${id}/${vendorId}/${type ? type : 'new-vendor'}`;
    
            // Make a request depending on the type
            if (type === "change-vendor") {
                res = await axios.post(url);
            } else {
                res = await axios.post(url);
            }
    
            // Handle response
            if (res.data.success) {
                toast.success(res.data.message);
                fetchData(currentPage); // Refresh data
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
                            <img src={vendor.panImage.url} className="card-img-top vendor-image" alt="Vendor Pan Image" />
                            <div className="card-body">
                                <h5 className="card-title">{vendor.companyName}</h5>
                                <p className="card-text">
                                    <strong>Owner:</strong> {vendor.ownerName} <br />
                                    <strong>Contact:</strong> {vendor.ContactNumber} <br />
                                    <strong>Email:</strong> {vendor.Email} <br />
                                    <strong>Address:</strong> {vendor.registerAddress} <br />
                                    <strong>GST No:</strong> {vendor.gstNo} <br />
                                    <strong>PAN No:</strong> {vendor.panNo} <br />
                                </p>
                                <button disabled={preSelect === vendor._id} className={`btn ${preSelect === vendor._id ? "bg-danger" : "bg-success"} btn-block`} onClick={() => handleAssignOrder(vendor._id)}>
                                    {
                                        preSelect === vendor._id ? "I am Already selected" : "Assign Order"}
                                </button>
                                <span style={{ right: "0%" }} className='position-absolute top-0 right'>
                                    {preSelect === vendor._id ? (
                                        <p className='badge text-bg-info'>Already selected</p>
                                    ) : null}
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
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li className={`page-item ${i + 1 === currentPage ? 'active' : ''}`} key={i + 1}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default VendorForOrder;
