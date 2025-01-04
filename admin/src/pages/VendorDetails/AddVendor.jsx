import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddVendor() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const [previewPanImage, setPanImage] = useState(null);
    const [previewAdharImage, setAdharImage] = useState(null);
    const [previewGstImage, setGstImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        yearOfRegistration: '',
        address: '',
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
        HouseNo: '',
        PinCode: '',
        Role: 'vendor',
        RangeWhereYouWantService: [{
            location: { type: 'Point', coordinates: [] }
        }]
    });
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [passwordError, setPasswordError] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState([]); // Suggestions state

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(`Selected ${name}: ${value}`);
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        // Password length validation
        if (name === 'Password') {
            if (value.length < 7) {
                setPasswordError('Password must be at least 7 characters long');
            } else {
                setPasswordError('');
            }
        }
        if (name === 'address' && value.length > 2) {
            fetchAddressSuggestions(value);
        }
    };

    // Fetch address suggestions
    const fetchAddressSuggestions = async (query) => {
        try {
            // console.log("query",query)
            const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/autocomplete?input=${encodeURIComponent(query)}`);
            // console.log(res.data)
            setAddressSuggestions(res.data || []);
        } catch (err) {
            console.error('Error fetching address suggestions:', err);
        }
    };

    // Fetch latitude and longitude based on selected address
    const fetchGeocode = async (selectedAddress) => {
        try {
            const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/geocode?address=${encodeURIComponent(selectedAddress)}`);
            // console.log("geo", res.data)
            const { latitude, longitude } = res.data;
            setLocation({ latitude, longitude });
            setFormData((prevData) => ({
                ...prevData,
                address: selectedAddress,
                RangeWhereYouWantService: [{
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                }]
            }));
            setAddressSuggestions([]);
        } catch (err) {
            console.error('Error fetching geocode:', err);
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
        const {
            companyName, yearOfRegistration, address, Email, ownerName,
            ContactNumber, panNo, gstNo, adharNo, Password, panImage, adharImage, gstImage
        } = formData;

        // Basic field validation
        // if (!companyName || !yearOfRegistration || !address || !Email || !ownerName ||
        //     !ContactNumber || !panNo || !gstNo || !adharNo || !Password || !panImage || !adharImage || !gstImage) {
        //     toast.error("All fields are required");
        //     return false;
        // }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email)) {
            toast.error("Invalid email format");
            return false;
        }

        // PAN, GST, Aadhar, and other number validation
        // const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        // const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
        // const aadharRegex = /^\d{12}$/;
        const phoneRegex = /^[6-9]{1}[0-9]{9}$/;

        // if (!panRegex.test(panNo)) {
        //     toast.error("Invalid PAN format");
        //     return false;
        // }
        // if (!gstRegex.test(gstNo)) {
        //     toast.error("Invalid GST format");
        //     return false;
        // }
        // if (!aadharRegex.test(adharNo)) {
        //     toast.error("Invalid Aadhar number. It must be a 12-digit number.");
        //     return false;
        // }
        if (!phoneRegex.test(ContactNumber)) {
            toast.error("Invalid phone number");
            return false;
        }

        // Password validation (length check)
        if (Password.length < 8) {
            toast.error("Password must be at least 8 characters long");
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
        payload.append('address', formData.address);
        payload.append('Email', formData.Email);
        payload.append('ownerName', formData.ownerName);
        payload.append('ContactNumber', formData.ContactNumber);
        payload.append('panNo', formData.panNo);
        payload.append('adharNo', formData.adharNo);
        payload.append('gstNo', formData.gstNo);
        payload.append('Password', formData.Password);
        payload.append('Role', formData.Role);
        payload.append('HouseNo', formData.HouseNo);
        payload.append('PinCode', formData.PinCode);
        payload.append('createdFrom', 'Admin');

        if (formData.panImage) payload.append('panImage', formData.panImage);
        if (formData.adharImage) payload.append('adharImage', formData.adharImage);
        if (formData.gstImage) payload.append('gstImage', formData.gstImage);


        payload.append('RangeWhereYouWantService[0][location][type]', 'Point');
        payload.append('RangeWhereYouWantService[0][location][coordinates][0]', location.longitude);
        payload.append('RangeWhereYouWantService[0][location][coordinates][1]', location.latitude);

        try {
            const res = await axios.post('https://www.api.blueaceindia.com/api/v1/register-vendor', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Employee Registration Successful!');
            const vendorType = res.data.user.Role
            // console.log("vendorType",vendorType)
            if (vendorType === "vendor") {
                const userId = res.data.user._id;
                window.location.href = `/add-vendor-member/${userId}`;
            } else {
                window.location.href = '/vendors/all-vendor'
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                toast.error(error.response.data.message || 'An error occurred');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb heading={'Add Vendor'} subHeading={'All Vendors'} LastHeading={'Create Vendor'} backLink={'/vendors/all-vendor'} />

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.companyName} name='companyName' onChange={handleChange} className="form-control rounded" placeholder="Name of Company*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="date" value={formData.yearOfRegistration} name='yearOfRegistration' onChange={handleChange} className="form-control rounded" placeholder="Year of Registration*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="email" value={formData.Email} name='Email' onChange={handleChange} className="form-control rounded" placeholder="Email*" />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.ownerName} name='ownerName' onChange={handleChange} className="form-control rounded" placeholder="Name*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.ContactNumber} name='ContactNumber' onChange={handleChange} className="form-control rounded" placeholder="Contact Number*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.panNo} name='panNo' onChange={handleChange} className="form-control text-uppercase rounded" placeholder="PAN Number*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.gstNo} name='gstNo' onChange={handleChange} className="form-control rounded" placeholder="GST Number*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.adharNo} name='adharNo' onChange={handleChange} className="form-control rounded" placeholder="Aadhar Number*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        {passwordError && (
                            <p style={{ color: 'red', fontSize: '14px', marginBottom: '5px' }}>
                                {passwordError}
                            </p>
                        )}
                        <input type="password" value={formData.Password} name='Password' onChange={handleChange} className="form-control rounded" placeholder="Password*" required />
                    </div>
                    <div className="position-relative col-lg-6 mt-3">
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            placeholder="Start typing address..."
                            onChange={handleChange}
                            className="form-control rounded"
                        />

                        {addressSuggestions.length > 0 && (
                            <div
                                className="position-absolute top-100 start-0 mt-2 w-100 bg-white border border-secondary rounded shadow-lg overflow-auto"
                                style={{ maxHeight: "200px" }}
                            >
                                <ul className="list-unstyled mb-0">
                                    {addressSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            style={{ fontSize: 16 }}
                                            className="p-1 hover:bg-light cursor-pointer"
                                            onClick={() => fetchGeocode(suggestion.description)}
                                        >
                                            {suggestion.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.HouseNo} name='HouseNo' onChange={handleChange} className="form-control rounded" placeholder="House No*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.PinCode} name='PinCode' onChange={handleChange} className="form-control rounded" placeholder="PinCode*" required />
                    </div>
                    {formData.Role === '' && (
                        <>
                            <div className="col-lg-4 mt-3">
                                <label className='form-label' htmlFor="">Pan Card Image</label>
                                <input type="file" accept="image/*" onChange={handlePanImageUpload} className="form-control" />
                                {previewPanImage && <img src={previewPanImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                            </div>
                            <div className="col-lg-4 mt-3">
                                <label className='form-label' htmlFor="">Aadhar Card Image</label>
                                <input type="file" accept="image/*" onChange={handleAdharImageUpload} className="form-control" />
                                {previewAdharImage && <img src={previewAdharImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                            </div>
                            <div className="col-lg-4 mt-3">
                                <label className='form-label' htmlFor="">Gst Image</label>
                                <input type="file" accept="image/*" onChange={handleGstImageUpload} className="form-control" />
                                {previewGstImage && <img src={previewGstImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                            </div>
                        </>
                    )}
                    {formData.Role === 'vendor' && (
                        <>
                            <div className="col-lg-4 mt-3">
                                <label className='form-label' htmlFor="">Pan Card Image</label>
                                <input type="file" accept="image/*" onChange={handlePanImageUpload} className="form-control" />
                                {previewPanImage && <img src={previewPanImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                            </div>
                            <div className="col-lg-4 mt-3">
                                <label className='form-label' htmlFor="">Aadhar Card Image</label>
                                <input type="file" accept="image/*" onChange={handleAdharImageUpload} className="form-control" />
                                {previewAdharImage && <img src={previewAdharImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                            </div>
                            <div className="col-lg-4 mt-3">
                                <label className='form-label' htmlFor="">Gst Image</label>
                                <input type="file" accept="image/*" onChange={handleGstImageUpload} className="form-control" />
                                {previewGstImage && <img src={previewGstImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                            </div>
                        </>
                    )}
                    {formData.Role === 'employ' && (
                        <>
                            <div className="col-lg-6 mt-3">
                                <label className='form-label' htmlFor="">Pan Card Image</label>
                                <input type="file" accept="image/*" onChange={handlePanImageUpload} className="form-control" />
                                {previewPanImage && <img src={previewPanImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                            </div>
                            <div className="col-lg-6 mt-3">
                                <label className='form-label' htmlFor="">Aadhar Card Image</label>
                                <input type="file" accept="image/*" onChange={handleAdharImageUpload} className="form-control" />
                                {previewAdharImage && <img src={previewAdharImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                            </div>
                        </>
                    )}


                    <div className='col-md-10 mx-auto mt-4'>
                        <button className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`} disabled={loading} type='submit'>
                            {loading ? 'Please Wait...' : 'Submit'}
                        </button>
                    </div>
                </div>
            } />
        </div>
    );
}

export default AddVendor;
