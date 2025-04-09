import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditVendor = () => {
    const { id } = useParams();
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState([]); // Suggestions state
    const [location, setLocation] = useState({
        latitude: '',
        longitude: ''
    });
    const [imagePreviews, setImagePreviews] = useState({});
    const [formData, setFormData] = useState({
        companyName: '',
        ownerName: '',
        Email: '',
        ContactNumber: '',
        yearOfRegistration: '',
        address: '',
        PinCode: '',
        HouseNo: '',
        panNo: '',
        gstNo: '',
        adharNo: '',
        RangeWhereYouWantService: {
            location: {
                type: 'Point',
                coordinates: []
            }
        },
        vendorImage: null,
        panImage: null,
        adharImage: null,
        gstImage: null
    });

    useEffect(() => {
        fetchExistingVendor();
    }, []);

    const fetchExistingVendor = async () => {
        try {
            const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/single-vendor/${id}`);
            const vendor = data.data;
            setRole(vendor.Role);
            setFormData({ ...vendor, RangeWhereYouWantService: vendor.RangeWhereYouWantService || formData.RangeWhereYouWantService });
            setImagePreviews({
                vendorImage: vendor.vendorImage?.url || null,
                panImage: vendor.panImage?.url || null,
                adharImage: vendor.adharImage?.url || null,
                gstImage: vendor.gstImage?.url || null
            });
        } catch (error) {
            console.error('Error fetching vendor:', error);
            toast.error(error?.response?.data?.message || 'Error fetching vendor data');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            console.log("geo", res.data)
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


    const handleImageUpload = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, [fieldName]: file }));
            setImagePreviews((prev) => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
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
        Payload.append('address', formData.address);
        Payload.append('panNo', formData.panNo);
        Payload.append('gstNo', formData.gstNo);
        Payload.append('adharNo', formData.adharNo);
        Payload.append('PinCode', formData.PinCode);
        Payload.append('HouseNo', formData.HouseNo);

        if (formData.RangeWhereYouWantService && formData.RangeWhereYouWantService.length > 0) {
            formData.RangeWhereYouWantService.forEach((service, index) => {
                Payload.append(`RangeWhereYouWantService[${index}][location][type]`, 'Point');
                Payload.append(`RangeWhereYouWantService[${index}][location][coordinates][0]`, service.location.coordinates[0]);
                Payload.append(`RangeWhereYouWantService[${index}][location][coordinates][1]`, service.location.coordinates[1]);
            });
        }

        // Append files only if they are selected
        if (formData.vendorImage) Payload.append('vendorImage', formData.vendorImage);
        if (formData.panImage) Payload.append('panImage', formData.panImage);
        if (formData.adharImage) Payload.append('adharImage', formData.adharImage);
        if (formData.gstImage) Payload.append('gstImage', formData.gstImage);

        try {
            const res = await axios.put(`https://api.blueaceindia.com/api/v1/update-vendor/${id}`, Payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message);
        } catch (error) {
            console.log('Internal server error', error);
            toast.error(error?.response?.data?.message || 'Error updating vendor');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Breadcrumb heading='Edit Vendor' subHeading='Vendor Management' LastHeading='Edit Vendor' backLink='/vendor/all-vendors' />
            <form onSubmit={handleSubmit} className='dashboard-list-wraps-body py-3 px-3'>
                <div className='row'>
                    {role === 'vendor' && (
                        <div className='col-md-6 mb-3'><label>Company Name</label><input type='text' name='companyName' value={formData.companyName} onChange={handleChange} className='form-control rounded' /></div>
                    )}
                    <div className='col-md-6 mb-3'><label>Email ID</label><input type='email' name='Email' value={formData.Email} onChange={handleChange} className='form-control rounded' /></div>
                    <div className='col-md-6 mb-3'><label>Name</label><input type='text' name='ownerName' value={formData.ownerName} onChange={handleChange} className='form-control rounded' /></div>
                    <div className='col-md-6 mb-3'><label>Number</label><input type='text' name='ContactNumber' value={formData.ContactNumber} onChange={handleChange} className='form-control rounded' /></div>
                    <div className='col-md-6 mb-3'><label>PAN No.</label><input type='text' name='panNo' value={formData.panNo} onChange={handleChange} className='form-control rounded' /></div>
                    {role === 'vendor' && <div className='col-md-6 mb-3'><label>GST No.</label><input type='text' name='gstNo' value={formData.gstNo} onChange={handleChange} className='form-control rounded' /></div>}
                    <div className='col-md-6 mb-3'><label>Aadhar No.</label><input type='text' name='adharNo' value={formData.adharNo} onChange={handleChange} className='form-control rounded' /></div>
                    {role === 'vendor' && <div className='col-md-6 mb-3'><label>Year of Registration</label><input type='date' name='yearOfRegistration' value={formData.yearOfRegistration} onChange={handleChange} className='form-control rounded' /></div>}
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
                        <input type='file' onChange={(e) => handleImageUpload(e, 'vendorImage')} className='form-control' />
                        {imagePreviews.vendorImage && <img src={imagePreviews.vendorImage} alt='Profile Preview' width='100' height='100' />}
                    </div>
                    <div className='col-md-6 mb-3'>
                        <label>Upload PAN Image</label>
                        <input type='file' onChange={(e) => handleImageUpload(e, 'panImage')} className='form-control' />
                        {imagePreviews.panImage && <img src={imagePreviews.panImage} alt='PAN Preview' width='100' height='100' />}
                    </div>
                    <div className='col-md-6 mb-3'>
                        <label>Upload Aadhar Image</label>
                        <input type='file' onChange={(e) => handleImageUpload(e, 'adharImage')} className='form-control' />
                        {imagePreviews.adharImage && <img src={imagePreviews.adharImage} alt='Aadhar Preview' width='100' height='100' />}
                    </div>
                    {role === 'vendor' &&
                        <div className='col-md-6 mb-3'>
                            <label>Upload GST Image</label>
                            <input type='file' onChange={(e) => handleImageUpload(e, 'gstImage')} className='form-control' />
                            {imagePreviews.gstImage && <img src={imagePreviews.gstImage} alt='GST Preview' width='100' height='100' />}
                        </div>
                    }
                    <div className='col-md-12 mt-3'><button className='btn btn-primary w-100' disabled={loading}>{loading ? 'Updating...' : 'Update'}</button></div>
                </div>
            </form>
        </div>
    );
};

export default EditVendor;
