import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    // State to store form inputs and location
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        ContactNumber: '',
        Password: '',
        City:'',
        PinCode:'',
        HouseNo:'',
        Street:'',
        NearByLandMark:'',
    });

    const [location, setLocation] = useState({
        latitude: '',
        longitude: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle input changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Get user location (latitude and longitude)
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    setError('Unable to retrieve your location');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.FullName || !formData.Email || !formData.ContactNumber || !formData.Password) {
            setError('Please fill all required fields');
            return;
        }

        // Add latitude and longitude to the formData
        const registrationData = {
            ...formData,
            latitude: location.latitude,
            longitude: location.longitude
        };

        try {
            // Send data to the backend
            const res = await axios.post('https://api.blueace.co.in/api/v1/Create-User', registrationData);

            if (res.data.success) {
                setSuccess('User registered successfully');
                setFormData({
                    FullName: '',
                    Email: '',
                    ContactNumber: '',
                    Password: '',
                    City: '',
                    PinCode: '',
                    HouseNo: '',
                    Street: '',
                    NearByLandMark: '',
                });
                setLocation({
                    latitude: '',
                    longitude: ''
                });
            }
        } catch (err) {
            setError('Error registering user');
        }
    };

    // Fetch the location when the component mounts
    React.useEffect(() => {
        getLocation();
    }, []);

    return (
        <div>
            <h1>Register</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="FullName"
                        value={formData.FullName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Contact Number:</label>
                    <input
                        type="text"
                        name="ContactNumber"
                        value={formData.ContactNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>City:</label>
                    <input
                        type="text"
                        name="City"
                        value={formData.City}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>PinCode:</label>
                    <input
                        type="text"
                        name="PinCode"
                        value={formData.PinCode}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>HouseNo:</label>
                    <input
                        type="text"
                        name="HouseNo"
                        value={formData.HouseNo}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Street:</label>
                    <input
                        type="text"
                        name="Street"
                        value={formData.Street}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>NearByLandMark:</label>
                    <input
                        type="text"
                        name="NearByLandMark"
                        value={formData.NearByLandMark}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit">Register</button>
            </form>

            {location.latitude && (
                <p>
                    Location detected: Latitude - {location.latitude}, Longitude - {location.longitude}
                </p>
            )}
        </div>
    );
};

export default Register;
