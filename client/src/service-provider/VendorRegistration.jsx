import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

function VendorRegistration() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const [previewPanImage, setPanImage] = useState(null);
    const [previewAdharImage, setAdharImage] = useState(null);
    const [previewGstImage, setGstImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        yearOfRegistration: '',
        registerAddress: '',
        panImage: null,
        adharImage: null,
        gstImage: null,
        registerEmail: '',
        ownerName: '',
        ownerNumber: '',
        panNo: '',
        gstNo: '',
        adharNo: '',
        member: [],
        Password: '', // Changed from 'Password' to 'password' for consistency
        RangeWhereYouWantService: [{
            location: {
                type: 'Point',
                coordinates: [] // Will be updated with [longitude, latitude]
            }
        }]
    });
    const [location, setLocation] = useState({
        latitude: '',
        longitude: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleMemberChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMembers = [...formData.member]; // Ensure to refer to 'members'
        updatedMembers[index] = { ...updatedMembers[index], [name]: value };
        setFormData((prevData) => ({
            ...prevData,
            members: updatedMembers
        }));
    };

    const addMember = () => {
        setFormData((prevData) => ({
            ...prevData,
            member: [...prevData.member, { name: '', adharImage: null }] // Updated for clarity
        }));
    };

    const removeMember = (index) => {
        const updatedMembers = formData.member.filter((_, i) => i !== index);
        setFormData((prevData) => ({
            ...prevData,
            members: updatedMembers
        }));
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
                (error) => {
                    toast.error('Unable to retrieve your location');
                }
            );
        } else {
            toast.error('Geolocation is not supported by this system');
        }
    };

    const handlePanImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                panImage: file
            }));
            setPanImage(URL.createObjectURL(file)); // Preview the selected PAN
        }
    };

    const handleAdharImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                adharImage: file
            }));
            setAdharImage(URL.createObjectURL(file)); // Preview the selected Aadhar
        }
    };

    const handleGstImageUpload = (e) => {
        const file = e.target.files[0];
        // console.log("gst",file)
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                gstImage: file
            }));
            setGstImage(URL.createObjectURL(file)); // Preview the selected GST
        }
    };

    const handleMemberImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('YOUR_IMAGE_UPLOAD_ENDPOINT', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const { url, public_id } = response.data;

                const updatedMembers = [...formData.member];
                updatedMembers[index].adharImage = { url, public_id };  // Update the adharImage with URL and public_id

                setFormData((prevData) => ({
                    ...prevData,
                    member: updatedMembers
                }));

            } catch (error) {
                console.error('Error uploading member Aadhar image:', error);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const payload = new FormData();

        // Append all other form fields to the FormData object
        payload.append('companyName', formData.companyName);
        payload.append('yearOfRegistration', formData.yearOfRegistration);
        payload.append('registerAddress', formData.registerAddress);
        payload.append('registerEmail', formData.registerEmail);
        payload.append('ownerName', formData.ownerName);
        payload.append('ownerNumber', formData.ownerNumber);
        payload.append('panNo', formData.panNo);
        payload.append('adharNo', formData.adharNo);
        payload.append('gstNo', formData.gstNo);

        // Append member details (name, adharImage)
        formData.member.forEach((member, index) => {
            payload.append(`member `,  member.name);
            if (member.adharImage) {
                payload.append(`member[${index}].adharImage.url`, member.adharImage.url);
                payload.append(`member[${index}].adharImage.public_id`, member.adharImage.public_id);
            }
        });

        // Append file fields for PAN, Aadhar, and GST images
        if (formData.panImage) {
            payload.append('panImage', formData.panImage);
        }
        if (formData.adharImage) {
            payload.append('adharImage', formData.adharImage);
        }
        if (formData.gstImage) {
            payload.append('gstImage', formData.gstImage);
        }

        // Append location as a JSON string
        payload.append('RangeWhereYouWantService', JSON.stringify([{
            location: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude]
            }
        }]));

        // Append Password
        payload.append('Password', formData.Password);

        try {
            const res = await axios.post('http://localhost:7000/api/v1/register-vendor', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Vendor Registration Successful!');
            console.log(res.data);
        } catch (error) {
            console.log('Error in create vendor', error);
            toast.error('Vendor registration failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <>
            <Toaster />
            {/* ======================= RegisterServiceProvider Detail ======================== */}
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
                                                <input type="text" value={formData.companyName} name='companyName' onChange={handleChange} className="form-control rounded" placeholder="Name of Company*" required />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input type="date" value={formData.yearOfRegistration} name='yearOfRegistration' onChange={handleChange} className="form-control rounded" placeholder="Year of Registration*" required />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="form-group col-lg-6">
                                                <input type="email" value={formData.registerEmail} name='registerEmail' onChange={handleChange} className="form-control rounded" placeholder="Registered Email*" />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input type="text" value={formData.ownerName} name='ownerName' onChange={handleChange} className="form-control rounded" placeholder="Owner's Name*" />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input type="Number" value={formData.ownerNumber} name='ownerNumber' onChange={handleChange} className="form-control rounded" placeholder="Owner's Number*" />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input type="text" value={formData.panNo} name='panNo' onChange={handleChange} className="form-control rounded" placeholder="Pan No.*" />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input type="text" value={formData.adharNo} name='adharNo' onChange={handleChange} className="form-control rounded" placeholder="Adhar No.*" />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input type="text" value={formData.gstNo} name='gstNo' onChange={handleChange} className="form-control rounded" placeholder="GST No.*" />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input type="text" value={formData.registerAddress} name='registerAddress' onChange={handleChange} className="form-control rounded" placeholder="Registered Address*" />
                                            </div>
                                        </div>

                                        {/* Adding members */}
                                        <h4 className='bg-primary text-white p-2 mb-3'>Members</h4>
                                        {formData.member.map((member, index) => (
                                            <div key={index} className="row mb-3">
                                                <div className="form-group col-lg-8">
                                                    <input type="text" name='name' value={member.name} onChange={(e) => handleMemberChange(index, e)} className="form-control rounded" placeholder="Member Name*" />
                                                </div>
                                                <div className="form-group col-lg-4">
                                                    <button type="button" className="btn btn-danger" onClick={() => removeMember(index)}>Remove</button>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <input type="file" accept="image/*" onChange={(e) => handleMemberImageUpload(e, index)} className="form-control rounded" placeholder="Upload Aadhar Image" />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mb-3">
                                            <button type="button" className="btn btn-success" onClick={addMember}>Add Member</button>
                                        </div>

                                        {/* File uploads */}
                                        <h4 className='bg-primary text-white p-2 mb-3'>Upload Documents</h4>
                                        <div className="form-group">
                                            <label>Upload PAN Image*</label>
                                            <input type="file" accept="image/*" onChange={handlePanImageUpload} className="form-control rounded" required />
                                            {previewPanImage && <img style={{ width: '100px' }} src={previewPanImage} alt="Preview PAN" className="img-preview" />}
                                        </div>
                                        <div className="form-group">
                                            <label>Upload Aadhar Image*</label>
                                            <input type="file" accept="image/*" onChange={handleAdharImageUpload} className="form-control rounded" required />
                                            {previewAdharImage && <img style={{ width: '100px' }} src={previewAdharImage} alt="Preview Aadhar" className="img-preview" />}
                                        </div>
                                        <div className="form-group">
                                            <label>Upload GST Image*</label>
                                            <input type="file" accept="image/*" onChange={handleGstImageUpload} className="form-control rounded" required />
                                            {previewGstImage && <img style={{ width: '100px' }} src={previewGstImage} alt="Preview GST" className="img-preview" />}
                                        </div>
                                        <div className="form-group">
                                            <input type="password" value={formData.Password} name='Password' onChange={handleChange} className="form-control rounded" placeholder="Password*" required />
                                        </div>
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? 'Submitting...' : 'Register'}
                                            </button>
                                        </div>
                                    </form>
                                    <p className="text-center mt-3">
                                        Already have an account? <Link to="/login">Login</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default VendorRegistration;
