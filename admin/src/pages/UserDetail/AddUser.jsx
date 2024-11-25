import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddUser() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        FullName: '',
        ContactNumber: '',
        Email: '',
        Password: '',
        address: '',
        PinCode: '',
        HouseNo: '',
        NearByLandMark: '',
        UserType: 'Normal',
        RangeWhereYouWantService: [{
            location: { type: 'Point', coordinates: [] }
        }]
    });
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [passwordError, setPasswordError] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState([]); // Suggestions state

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value)
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

    const validateFields = () => {
        const {NearByLandMark, Email, FullName, ContactNumber, address, PinCode, HouseNo, Password } = formData;

        if (!NearByLandMark || !Email || !FullName || !ContactNumber || !address || !PinCode || !HouseNo || !Password) {
            toast.error("Please fill out all required fields");
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email)) {
            toast.error("Invalid email format");
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

        try {
            const res = await axios.post('https://www.api.blueaceindia.com/api/v1/Create-User', formData);
            toast.success('User Registration Successful!');
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.msg || 'An error occurred');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Breadcrumb heading={'Add User'} subHeading={'All user'} LastHeading={'Create user'} backLink={'/users/all-users'} />
            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-lg-6 mt-3">
                        <input type="email" value={formData.Email} name='Email' onChange={handleChange} className="form-control rounded" placeholder="Email*" />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.FullName} name='FullName' onChange={handleChange} className="form-control rounded" placeholder="Name*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.ContactNumber} name='ContactNumber' onChange={handleChange} className="form-control rounded" placeholder="Contact Number*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.HouseNo} name='HouseNo' onChange={handleChange} className="form-control rounded" placeholder="House No*" required />
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
                        <input type="text" value={formData.NearByLandMark} name='NearByLandMark' onChange={handleChange} className="form-control rounded" placeholder="Near By LandMark*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.PinCode} name='PinCode' onChange={handleChange} className="form-control rounded" placeholder="Pin Code*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        {passwordError && (
                            <p style={{ color: 'red', fontSize: '14px', marginBottom: '5px' }}>
                                {passwordError}
                            </p>
                        )}
                        <input type="password" value={formData.Password} name='Password' onChange={handleChange} className="form-control rounded" placeholder="Password*" required />
                    </div>
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

export default AddUser
