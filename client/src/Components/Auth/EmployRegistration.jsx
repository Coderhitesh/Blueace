import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function EmployRegistration() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const [previewPanImage, setPanImage] = useState(null);
    const [previewAdharImage, setAdharImage] = useState(null);
    const [previewGstImage, setGstImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: 'Blueace India',
        yearOfRegistration: '01/01/1999',
        address: '',
        panImage: null,
        adharImage: null,
        Email: '',
        ownerName: '',
        ContactNumber: '',
        panNo: '',
        HouseNo: '',
        PinCode: '',
        // gstNo: '',
        adharNo: '',
        Password: '',
        Role: 'employ',
        RangeWhereYouWantService: [{
            location: { type: 'Point', coordinates: [] }
        }]
    });
    const [latitude, setLatitude] = useState(''); // For manual entry of latitude
    const [longitude, setLongitude] = useState(''); // For manual entry of longitude
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
        // const phoneRegex = /^[6-9]{1}[0-9]{9}$/;

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
        // if (!phoneRegex.test(ContactNumber)) {
        //     toast.error("Invalid phone number");
        //     return false;
        // }

        // Password validation (length check)
        if (Password.length < 7) {
            setPasswordError('Password must be at least 7 characters long');
            setLoading(false);
            return false;
        } else {
            setPasswordError('');
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

        if (formData.panImage) payload.append('panImage', formData.panImage);
        if (formData.adharImage) payload.append('adharImage', formData.adharImage);
        if (formData.gstImage) payload.append('gstImage', formData.gstImage);

        // Validate password length
        if (formData.Password.length < 7) {
            setPasswordError('Password must be at least 7 characters long');
            setLoading(false);
            return;
        } else {
            setPasswordError('');
        }

        payload.append('RangeWhereYouWantService[0][location][type]', 'Point');
        payload.append('RangeWhereYouWantService[0][location][coordinates][0]', location.longitude);
        payload.append('RangeWhereYouWantService[0][location][coordinates][1]', location.latitude);

        try {
            const res = await axios.post('https://www.api.blueaceindia.com/api/v1/register-vendor', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Employee Registration Successful!');
            const vendorType = res.data.user.Role
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));
            // console.log("vendorType",vendorType)
            // if (vendorType === "vendor") {
            //     const userId = res.data.user._id;
            //     window.location.href = `/add-vendor-member/${userId}`;
            // } else {
            // }
            window.location.href = '/'
        } catch (error) {
            console.log(error.response.data);
            if (error.response) {
                toast.error(error.response.data.error || error.response.data || 'An error occurred');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {/* ======================= Registration Detail ======================== */}
            <section className="gray">
                <div className="container">
                    <div className="row align-items-start justify-content-center">
                        <div className="col-xl-6 col-lg-8 col-md-12">
                            <div className="signup-screen-wrap">
                                <div className="signup-screen-single light">
                                    <div className="text-center mb-4">
                                        <h4 className="m-0 ft-medium">Create An Account</h4>
                                    </div>

                                    <form className="submit-form" onSubmit={handleSubmit}>

                                        <div className="row">
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="ownerName" className='mb-1 fw-medium'>Full Name*</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="Enter Your Name"
                                                        name="ownerName"
                                                        value={formData.ownerName}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="Email" className='mb-1 fw-medium'>Email*</label>
                                                    <input
                                                        type="email"
                                                        className="form-control rounded"
                                                        placeholder="Enter Your Email"
                                                        name="Email"
                                                        value={formData.Email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>


                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="ContactNumber" className='mb-1 fw-medium'>Phone No.*</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="Enter Your Phone Number"
                                                        name="ContactNumber"
                                                        value={formData.ContactNumber}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="panNo" className='mb-1 fw-medium'>PAN No.*</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="PAN No."
                                                        name="panNo"
                                                        value={formData.panNo}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="adharNo" className='mb-1 fw-medium'>Aadhaar Card No*</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="Aadhaar No."
                                                        name="adharNo"
                                                        value={formData.adharNo}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="ownerName" className='mb-1 fw-medium'>Complete Address*</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="Complete Address"
                                                        name="HouseNo"
                                                        value={formData.HouseNo}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="position-relative col-6">
                                                <div className="form-group">
                                                    <label htmlFor="address" className='mb-1 fw-medium'>Landmark (e.g., Netaji Subhash Place)*</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={formData.address}
                                                        placeholder="Start typing address..."
                                                        onChange={handleChange}
                                                        className="form-control rounded"
                                                        required
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
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="ownerName" className='mb-1 fw-medium'>Pin code*</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="Pin code"
                                                        name="PinCode"
                                                        value={formData.PinCode}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="Password" className="mb-1 fw-medium">Password*</label>
                                                    {passwordError && (
                                                        <p style={{ color: 'red', fontSize: '14px', marginBottom: '5px' }}>
                                                            {passwordError}
                                                        </p>
                                                    )}
                                                    <input
                                                        type="password"
                                                        className="form-control rounded"
                                                        placeholder="Password"
                                                        name="Password"
                                                        value={formData.Password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label className='mb-1 fw-medium' htmlFor="">Pan Card Image</label>
                                                    <input type="file" accept="image/*" onChange={handlePanImageUpload} className="form-control" />
                                                    {previewPanImage && <img src={previewPanImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label className='mb-1 fw-medium' htmlFor="">Aadhar Card Image</label>
                                                    <input type="file" accept="image/*" onChange={handleAdharImageUpload} className="form-control" />
                                                    {previewAdharImage && <img src={previewAdharImage} alt="Preview" className=' mt-2' style={{ width: '100px', height: '100px' }} />}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <button type="submit" className="btn btn-md full-width theme-bg text-light rounded ft-medium">{`${loading ? "Loading..." : "Sign Up"}`}</button>
                                        </div>

                                        <div className="form-group text-center mt-4 mb-0">
                                            <p className="mb-0">Already have an account? <Link to={'/employ-sign-in'} style={{ color: '#00225F' }} className="ft-medium">Sign In</Link></p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* ======================= Registration End ======================== */}
        </>
    )
}

export default EmployRegistration
