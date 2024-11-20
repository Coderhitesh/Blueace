import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function VendorRegistration() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const [previewPanImage, setPanImage] = useState(null);
    const [previewAdharImage, setAdharImage] = useState(null);
    const [previewGstImage, setGstImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        yearOfRegistration: '',
        registerAddress: '',
        panImage: null,
        adharImage: null,
        gstImage: null,
        Email: '',
        ownerName: '',
        ContactNumber: '',
        panNo: '',
        gstNo: '',
        adharNo: '',
        Password: '',
        RangeWhereYouWantService: [{
            location: { type: 'Point', coordinates: [] }
        }]
    });
    const [location, setLocation] = useState({ latitude: '', longitude: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        // Password length validation
        if (name === 'Password') {
            if (value.length < 7) {
                setPasswordError('Password must be at least 7 characters long');
            } else {
                setPasswordError('');
            }
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                () => toast.error('Unable to retrieve your location')
            );
        } else {
            toast.error('Geolocation is not supported by this system');
        }
    };

    const handlePanImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({ ...prevData, panImage: file }));
            setPanImage(URL.createObjectURL(file));
        }
    };

    const handleAdharImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({ ...prevData, adharImage: file }));
            setAdharImage(URL.createObjectURL(file));
        }
    };

    const handleGstImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({ ...prevData, gstImage: file }));
            setGstImage(URL.createObjectURL(file));
        }
    };

    const validateFields = () => {
        const { Password } = formData;

        // Password validation (length check)
        if (Password.length < 7) {
            toast.error("Password must be at least 7 characters long");
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateFields()) return;

        setLoading(true);

        const payload = new FormData();
        payload.append('companyName', formData.companyName);
        payload.append('yearOfRegistration', formData.yearOfRegistration);
        payload.append('registerAddress', formData.registerAddress);
        payload.append('Email', formData.Email);
        payload.append('ownerName', formData.ownerName);
        payload.append('ContactNumber', formData.ContactNumber);
        payload.append('panNo', formData.panNo);
        payload.append('adharNo', formData.adharNo);
        payload.append('gstNo', formData.gstNo);
        payload.append('Password', formData.Password);

        if (formData.panImage) payload.append('panImage', formData.panImage);
        if (formData.adharImage) payload.append('adharImage', formData.adharImage);
        if (formData.gstImage) payload.append('gstImage', formData.gstImage);

        payload.append('RangeWhereYouWantService[0][location][type]', 'Point');
        payload.append('RangeWhereYouWantService[0][location][coordinates][0]', location.longitude);
        payload.append('RangeWhereYouWantService[0][location][coordinates][1]', location.latitude);

        try {
            const res = await axios.post('https://api.blueaceindia.com/api/v1/register-vendor', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Vendor Registration Successful!');
            const userId = res.data.user._id;
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));
            window.location.href = `/add-vendor-member/${userId}`;
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'An error occurred');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <>
            <section className="gray">
                <div className="container">
                    <div className="row align-items-start justify-content-center">
                        <div className="col-xl-12 col-lg-8 col-md-12">
                            <div className="signup-screen-wrap">
                                <div className="text-center mb-4">
                                    <h2 className="m-0 fw-bold">Register As A Vendor</h2>
                                </div>
                                <div className="signup-screen-single light">
                                    <h4 className='bg-primary text-white p-2 mb-5'>General Details</h4>
                                    <form onSubmit={handleSubmit} className="submit-form">
                                        <div className="row">
                                            <div className="form-group col-lg-6">
                                                <label>Name of Company*</label>
                                                <input type="text" value={formData.companyName} name='companyName' onChange={handleChange} className="form-control rounded" required />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <label>Year of Registration*</label>
                                                <input type="date" value={formData.yearOfRegistration} name='yearOfRegistration' onChange={handleChange} className="form-control rounded" required />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="form-group col-lg-6">
                                                <label>Registered Email*</label>
                                                <input type="email" value={formData.Email} name='Email' onChange={handleChange} className="form-control rounded" required />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <label>Name of Owner*</label>
                                                <input type="text" value={formData.ownerName} name='ownerName' onChange={handleChange} className="form-control rounded" required />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <label>Contact Number of Owner*</label>
                                                <input type="text" value={formData.ContactNumber} name='ContactNumber' onChange={handleChange} className="form-control rounded" required />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <label>PAN Number*</label>
                                                <input type="text" value={formData.panNo} name='panNo' onChange={handleChange} className="form-control text-uppercase rounded" required />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <label>GST Number*</label>
                                                <input type="text" value={formData.gstNo} name='gstNo' onChange={handleChange} className="form-control rounded" required />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <label>Aadhar Number*</label>
                                                <input type="text" value={formData.adharNo} name='adharNo' onChange={handleChange} className="form-control rounded" required />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-lg-12">
                                                <label>Address of Registration*</label>
                                                <input type="text" value={formData.registerAddress} name='registerAddress' onChange={handleChange} className="form-control rounded" required />
                                            </div>
                                            <div className="form-group col-lg-12">

                                                <label>Password*</label>
                                                {passwordError && (
                                                    <p style={{ color: 'red', fontSize: '14px', marginBottom: '5px' }}>
                                                        {passwordError}
                                                    </p>
                                                )}
                                                <input type="password" value={formData.Password} name='Password' onChange={handleChange} className="form-control rounded" required />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <h4 className='bg-primary text-white p-2 mb-5'>Documents Upload</h4>
                                            <div className="form-group col-lg-4">
                                                <label>PAN Card Upload</label>
                                                <input type="file" accept="image/*" onChange={handlePanImageUpload} className="form-control mt-2" required />
                                                {previewPanImage && <img src={previewPanImage} alt="Preview" style={{ width: '100px', height: '100px' }} />}
                                            </div>
                                            <div className="form-group col-lg-4">
                                                <label>Aadhar Card Upload</label>
                                                <input type="file" accept="image/*" onChange={handleAdharImageUpload} className="form-control mt-2" required />
                                                {previewAdharImage && <img src={previewAdharImage} alt="Preview" style={{ width: '100px', height: '100px' }} />}
                                            </div>
                                            <div className="form-group col-lg-4">
                                                <label>GST Registration Upload</label>
                                                <input type="file" accept="image/*" onChange={handleGstImageUpload} className="form-control mt-2" required />
                                                {previewGstImage && <img src={previewGstImage} alt="Preview" style={{ width: '100px', height: '100px' }} />}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-md full-width theme-bg text-light rounded ft-medium" disabled={loading}>{`${loading ? "Registering..." : "Register"}`}</button>
                                        </div>
                                        {/* <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                                            {loading ? 'Registering...' : 'Register'}
                                        </button> */}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Toaster /> */}
            </section>
        </>
    );
}

export default VendorRegistration;
