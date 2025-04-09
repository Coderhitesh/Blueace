import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
const EditUser = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState(null)
    const [formData, setFormData] = useState({
        UserType: '',
        companyName: '',
        FullName: '',
        ContactNumber: '',
        Email: '',
        // City: '',
        PinCode: '',
        HouseNo: '',
        // Street: '',
        address: '',
        NearByLandMark: '',
        userImage: null,
        RangeWhereYouWantService: [{
            location: {
                type: 'Point',
                coordinates: []
            }
        }]
    });

    const fetchExistingUser = async () => {
        try {
            const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/get-single-user/${id}`);
            const existinguser = data.data;
            setFormData({
                FullName: existinguser.FullName,
                companyName: existinguser?.companyName,
                ContactNumber: existinguser.ContactNumber,
                Email: existinguser.Email,
                address: existinguser.address,
                PinCode: existinguser.PinCode,
                HouseNo: existinguser.HouseNo,
                // Street: existinguser.Street,
                NearByLandMark: existinguser.NearByLandMark,
                userImage: existinguser.userImage || null, // Set existing image if available
                UserType: existinguser.UserType,
            });

            if (existinguser.userImage) {
                setImagePreviews(existinguser.userImage.url); // Set preview for existing image
            }

        } catch (error) {
            console.log('Internal server error', error);
            toast.error(error?.response?.data?.message);
        }
    };

    const [addressSuggestions, setAddressSuggestions] = useState([]); // Suggestions state
    const [location, setLocation] = useState({
        latitude: '',
        longitude: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        if (name === 'address' && value.length > 2) {
            fetchAddressSuggestions(value);
        }
    };

    // Fetch address suggestions
    const fetchAddressSuggestions = async (query) => {
        try {
            // console.log("query",query)
            const res = await axios.get(`https://api.blueaceindia.com/api/v1/autocomplete?input=${encodeURIComponent(query)}`);
            console.log(res.data)
            setAddressSuggestions(res.data || []);
        } catch (err) {
            console.error('Error fetching address suggestions:', err);
        }
    };

    // Fetch latitude and longitude based on selected address
    const fetchGeocode = async (selectedAddress) => {
        try {
            const res = await axios.get(`https://api.blueaceindia.com/api/v1/geocode?address=${encodeURIComponent(selectedAddress)}`);
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

    // Handle file change for userImage
    const handleServiceImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                userImage: file
            }));
            setImagePreviews(URL.createObjectURL(file)); // Show preview of the new selected image
            toast.success('Image selected successfully!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate required fields
        if (!formData.FullName || !formData.ContactNumber || !formData.Email ||
            !formData.HouseNo) {
            toast.error('Please fill in all required fields');
            setLoading(false);
            return;
        }

        // console.log("fullname",formData.FullName)

        const Payload = new FormData();
        Payload.append('FullName', formData.FullName);
        Payload.append('companyName', formData.companyName);
        Payload.append('ContactNumber', formData.ContactNumber);
        Payload.append('Email', formData.Email);
        // Payload.append('City', formData.City);
        Payload.append('PinCode', formData.PinCode);
        Payload.append('HouseNo', formData.HouseNo);
        Payload.append('address', formData.address);
        // Payload.append('Street', formData.Street);
        // Payload.append('NearByLandMark', formData.NearByLandMark);

        Payload.append('RangeWhereYouWantService[0][location][type]', 'Point');
        Payload.append('RangeWhereYouWantService[0][location][coordinates][0]', location.longitude);
        Payload.append('RangeWhereYouWantService[0][location][coordinates][1]', location.latitude);

        if (formData.userImage && typeof formData.userImage !== 'string') {
            Payload.append('userImage', formData.userImage);
        }

        try {
            const res = await axios.put(`https://api.blueaceindia.com/api/v1/update-user/${id}`, Payload, {
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
        <div>
            <Breadcrumb heading='Edit' subHeading='Users' LastHeading='Edit' backLink='' />
            <form onSubmit={handleSubmit} className='dashboard-list-wraps-body py-3 px-3'>
                <div className='row'>
                    {formData.UserType === 'Corporate' && (
                        <div className='col-md-6 mb-3'><label>Company Name</label><input type='text' name='companyName' value={formData.companyName} onChange={handleChange} className='form-control rounded' /></div>
                    )}
                    <div className='col-md-6 mb-3'><label>Name</label><input type='text' name='FullName' value={formData.FullName} onChange={handleChange} className='form-control rounded' /></div>
                    <div className='col-md-6 mb-3'><label>Email ID</label><input type='email' name='Email' value={formData.Email} onChange={handleChange} className='form-control rounded' /></div>
                    <div className='col-md-6 mb-3'><label>Number</label><input type='text' name='ContactNumber' value={formData.ContactNumber} onChange={handleChange} className='form-control rounded' /></div>
                    {/* <div className='col-md-6 mb-3'><label>PAN No.</label><input type='text' name='panNo' value={formData.panNo} onChange={handleChange} className='form-control rounded' /></div> */}
                    {/* {role === 'vendor' && <div className='col-md-6 mb-3'><label>GST No.</label><input type='text' name='gstNo' value={formData.gstNo} onChange={handleChange} className='form-control rounded' /></div>} */}
                    {/* <div className='col-md-6 mb-3'><label>Aadhar No.</label><input type='text' name='adharNo' value={formData.adharNo} onChange={handleChange} className='form-control rounded' /></div> */}
                    {/* {role === 'vendor' && <div className='col-md-6 mb-3'><label>Year of Registration</label><input type='date' name='yearOfRegistration' value={formData.yearOfRegistration} onChange={handleChange} className='form-control rounded' /></div>} */}
                    <div className='col-md-6 mb-3'><label>Complete Address</label><input type='text' name='HouseNo' value={formData.HouseNo} onChange={handleChange} className='form-control rounded' /></div>
                    <div className="col-xl-6 mb-3 col-lg-6 col-md-12 position-relative col-sm-12">
                        <div className="form-group">
                            <label htmlFor="address" className='mb-1 fw-medium'>Landmark (e.g., Netaji Subhash Place)</label>
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
                    </div>
                    <div className='col-md-6 mb-3'><label>PinCode</label><input type='text' name='PinCode' value={formData.PinCode} onChange={handleChange} className='form-control rounded' /></div>
                    <div className='col-md-6 mb-3'>
                        <label>Upload Profile Image</label>
                        <input type='file' onChange={handleServiceImageUpload} className='form-control' />
                        {imagePreviews ? (
                            <img src={imagePreviews} alt='Profile Preview' width='100' height='100' className="mt-2 rounded border" />
                        ) : (
                            formData.userImage && (
                                <img src={formData.userImage} alt='Existing Profile' width='100' height='100' className="mt-2 rounded border" />
                            )
                        )}
                    </div>
                    <div className='col-md-12 mt-3'><button className='btn btn-primary w-100' disabled={loading}>{loading ? 'Updating...' : 'Update'}</button></div>
                </div>
            </form>
        </div>
    )
}

export default EditUser
