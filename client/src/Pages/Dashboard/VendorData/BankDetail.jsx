import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function BankDetail() {
    const [formData, setFormData] = useState({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        branchName: '',
        // panCardNumber: ''
    });

    const [loading, setLoading] = useState(false);

    // Get vendor ID from session storage
    const vendorId = JSON.parse(sessionStorage.getItem('user'))?._id;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFetchExistData = async () => {
        try {
            const response = await axios.get(`http://localhost:7987/api/v1/single-vendor/${vendorId}`)
            if (response.data.success) {
                setFormData((prev) => ({
                    ...prev,
                    ...response.data.data.bankDetail, // Merge existing fields
                }));
            }
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    useEffect(() => {
        handleFetchExistData();
    },[vendorId])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!vendorId) {
            toast.error('Vendor ID not found. Please login again.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                `http://localhost:7987/api/v1/update-bank-detail/${vendorId}`,
                formData
            );

            if (response.data.success) {
                toast.success('Bank details updated successfully');
                // Update local storage if needed
            }
        } catch (error) {
            console.error('Error updating bank details:', error);
            toast.error(error.response?.data?.message || 'Failed to update bank details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className="goodup-dashboard-content">
                <div className="dashboard-tlbar d-block mb-5">
                    <h1 className="ft-medium">Bank Detail</h1>
                    {/* Add breadcrumb if necessary */}
                </div>

                <div className="dashboard-widg-bar d-block">
                    <form className="submit-form" onSubmit={handleSubmit}>
                        <div className="dashboard-list-wraps bg-white rounded mb-4">
                            <div className="dashboard-list-wraps-head br-bottom py-3 px-3">
                                <h4 className="mb-0 ft-medium fs-md"><i className="fa fa-user-check me-2 theme-cl fs-sm"></i>Bank Detail</h4>
                            </div>


                            <div className="dashboard-list-wraps-body py-3 px-3">
                                <div className="row">

                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Account Holder Name</label>
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                id="accountHolderName"
                                                name="accountHolderName"
                                                placeholder="Enter account holder name"
                                                value={formData.accountHolderName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Bank Name</label>
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                id="bankName"
                                                name="bankName"
                                                placeholder="Enter bank name"
                                                value={formData.bankName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Account Number</label>
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                id="accountNumber"
                                                name="accountNumber"
                                                placeholder="Enter account number"
                                                value={formData.accountNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">IFSC Code</label>
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                id="ifscCode"
                                                name="ifscCode"
                                                placeholder="Enter IFSC code"
                                                value={formData.ifscCode}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Branch Name</label>
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                id="branchName"
                                                name="branchName"
                                                placeholder="Enter branch name"
                                                value={formData.branchName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">PAN Card Number</label>
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                id="panCardNumber"
                                                name="panCardNumber"
                                                placeholder="Enter PAN card number"
                                                value={formData.panCardNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div> */}

                                    <div className="col-xl-12 mt-2 col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <button className="btn theme-bg rounded text-light" type="submit" disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    'Update Bank Details'
                                                )}
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                    </form>
                </div>

            </div>



            {/* <div className="goodup-dashboard-content">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-primary text-white py-3">
                            <h4 className="mb-0">Update Bank Details</h4>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                id="accountHolderName"
                                                name="accountHolderName"
                                                placeholder="Enter account holder name"
                                                value={formData.accountHolderName}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="accountHolderName">Account Holder Name</label>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="bankName"
                                                name="bankName"
                                                placeholder="Enter bank name"
                                                value={formData.bankName}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="bankName">Bank Name</label>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="accountNumber"
                                                name="accountNumber"
                                                placeholder="Enter account number"
                                                value={formData.accountNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="accountNumber">Account Number</label>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="ifscCode"
                                                name="ifscCode"
                                                placeholder="Enter IFSC code"
                                                value={formData.ifscCode}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="ifscCode">IFSC Code</label>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="branchName"
                                                name="branchName"
                                                placeholder="Enter branch name"
                                                value={formData.branchName}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="branchName">Branch Name</label>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="panCardNumber"
                                                name="panCardNumber"
                                                placeholder="Enter PAN card number"
                                                value={formData.panCardNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="panCardNumber">PAN Card Number</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Bank Details'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card mt-4 border-0 bg-light">
                        <div className="card-body">
                            <h5 className="card-title text-primary">Important Notes:</h5>
                            <ul className="mb-0">
                                <li>Please ensure all bank details are entered correctly</li>
                                <li>Double-check the IFSC code and account number</li>
                                <li>Make sure the PAN card number matches your bank records</li>
                                <li>All fields are mandatory for successful registration</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}


        </>
    );
}

export default BankDetail;