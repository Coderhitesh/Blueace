import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function VendorProfile({ userData }) {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);
    // console.log('user',userData)

    const userId = userData?._id; // Ensure userData is provided or fetched correctly.
    // console.log('userId',userId)

    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState({
        vendorImage: null,
        panImage: null,
        adharImage: null,
        gstImage: null
    });

    const [formData, setFormData] = useState({
        companyName: '',
        ownerName: '',
        Email: '',
        ContactNumber: '',
        yearOfRegistration: '',
        registerAddress: '',
        panNo: '',
        gstNo: '',
        vendorImage: null,
        panImage: null,
        adharImage: null,
        gstImage: null,
        adharNo: '',
    });

    const fetchExistingUser = async () => {
        try {
            const { data } = await axios.get(`https://api.blueace.co.in/api/v1/single-vendor/${userId}`);
            const existinguser = data.data;
    
            setFormData({
                companyName: existinguser.companyName,
                ownerName: existinguser.ownerName,
                Email: existinguser.Email,
                ContactNumber: existinguser.ContactNumber,
                yearOfRegistration: existinguser.yearOfRegistration,
                registerAddress: existinguser.registerAddress,
                panNo: existinguser.panNo,
                gstNo: existinguser.gstNo,
                vendorImage: existinguser.vendorImage || null,
                panImage: existinguser.panImage || null,
                adharImage: existinguser.adharImage || null,
                gstImage: existinguser.gstImage || null,
                adharNo: existinguser.adharNo,
            });
    
            // Set image previews with actual URLs
            setImagePreviews({
                vendorImage: existinguser.vendorImage ? existinguser.vendorImage.url : null, // Access the 'url' property here
                panImage: existinguser.panImage ? existinguser.panImage.url : null,
                adharImage: existinguser.adharImage ? existinguser.adharImage.url : null,
                gstImage: existinguser.gstImage ? existinguser.gstImage.url : null,
            });
        } catch (error) {
            console.log('Internal server error', error);
            toast.error(error?.response?.data?.message);
        }
    };
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e, imageField) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                [imageField]: file
            }));
            setImagePreviews(prevPreviews => ({
                ...prevPreviews,
                [imageField]: URL.createObjectURL(file)
            }));
            toast.success('Image selected successfully!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const Payload = new FormData();
        Payload.append('companyName', formData.companyName);
        Payload.append('ownerName', formData.ownerName);
        Payload.append('Email', formData.Email);
        Payload.append('ContactNumber', formData.ContactNumber);
        Payload.append('yearOfRegistration', formData.yearOfRegistration);
        Payload.append('registerAddress', formData.registerAddress);
        Payload.append('panNo', formData.panNo);
        Payload.append('gstNo', formData.gstNo);
        Payload.append('adharNo', formData.adharNo);

        // Append files only if they are selected
        if (formData.vendorImage) Payload.append('vendorImage', formData.vendorImage);
        if (formData.panImage) Payload.append('panImage', formData.panImage);
        if (formData.adharImage) Payload.append('adharImage', formData.adharImage);
        if (formData.gstImage) Payload.append('gstImage', formData.gstImage);

        try {
            const res = await axios.put(`https://api.blueace.co.in/api/v1/update-vendor/${userId}`, Payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message);
        } catch (error) {
            console.log('Internal server error', error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExistingUser();
    }, []);

    return (
        <>
            <div className="goodup-dashboard-content">
                <div className="dashboard-tlbar d-block mb-5">
                    <h1 className="ft-medium">Profile Info</h1>
                    {/* Add breadcrumb if necessary */}
                </div>

                <div className="dashboard-widg-bar d-block">
                    <form className="submit-form" onSubmit={handleSubmit}>
                        <div className="dashboard-list-wraps bg-white rounded mb-4">
                            <div className="dashboard-list-wraps-head br-bottom py-3 px-3">
                                <h4 className="mb-0 ft-medium fs-md"><i className="fa fa-user-check me-2 theme-cl fs-sm"></i>My Profile</h4>
                            </div>

                            <div className="dashboard-list-wraps-body py-3 px-3">
                                <div className="row">
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Company Name</label>
                                            <input type="text" value={formData.companyName} name='companyName' onChange={handleChange} className="form-control rounded" placeholder="Company Name" />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Email ID</label>
                                            <input type="email" value={formData.Email} name='Email' onChange={handleChange} className="form-control rounded" placeholder="Email" />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Owner Name</label>
                                            <input type="text" value={formData.ownerName} name='ownerName' onChange={handleChange} className="form-control rounded" placeholder="Owner Name" />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Number</label>
                                            <input type="text" value={formData.ContactNumber} name='ContactNumber' onChange={handleChange} className="form-control rounded" placeholder="Owner Name" />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">PAN No.</label>
                                            <input type="text" value={formData.panNo} name='panNo' onChange={handleChange} className="form-control rounded" placeholder="Owner Name" />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">GST No.</label>
                                            <input type="text" value={formData.gstNo} name='gstNo' onChange={handleChange} className="form-control rounded" placeholder="Owner Name" />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Aadhar No.</label>
                                            <input type="text" value={formData.adharNo} name='adharNo' onChange={handleChange} className="form-control rounded" placeholder="Owner Name" />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Year of Register</label>
                                            <input type="date" value={formData.yearOfRegistration} name='yearOfRegistration' onChange={handleChange} className="form-control rounded" placeholder="Year of Registration*" required />
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="mb-1">Address</label>
                                            <input type="text" value={formData.registerAddress} name='registerAddress' onChange={handleChange} className="form-control rounded" placeholder="Year of Registration*" required />
                                        </div>
                                    </div>

                                    {/* Additional Fields */}
                                    <div className="col-lg-6 col-md-6">
                                        {imagePreviews.vendorImage && (
                                            <div className="mb-3">
                                                <h5>Profile Image Preview:</h5>
                                                <img src={imagePreviews.vendorImage} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <label className="mb-1">Upload Profile Image</label>
                                        <input type="file" name="vendorImage" onChange={(e) => handleImageUpload(e, 'vendorImage')} className="form-control" />
                                    </div>

                                    <div className="col-lg-6 col-md-6">
                                        {imagePreviews.panImage && (
                                            <div className="mb-3">
                                                <h5>Pan Image Preview:</h5>
                                                <img src={imagePreviews.panImage} alt="PAN Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <label className="mb-1">Upload PAN Image</label>
                                        <input type="file" name="panImage" onChange={(e) => handleImageUpload(e, 'panImage')} className="form-control" />
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        {imagePreviews.adharImage && (
                                            <div className="mb-3">
                                                <h5>Aadhar Image Preview:</h5>
                                                <img src={imagePreviews.adharImage} alt="Aadhar Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <label className="mb-1">Upload Aadhar Image</label>
                                        <input type="file" name="adharImage" onChange={(e) => handleImageUpload(e, 'adharImage')} className="form-control" />
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        {imagePreviews.gstImage && (
                                            <div className="mb-3">
                                                <h5>GST Image Preview:</h5>
                                                <img src={imagePreviews.gstImage} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <label className="mb-1">Upload GST Image</label>
                                        <input type="file" name="gstImage" onChange={(e) => handleImageUpload(e, 'gstImage')} className="form-control" />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="col-xl-12 mt-2 col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <button className="btn theme-bg rounded text-light" type="submit" disabled={loading}>
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default VendorProfile;
