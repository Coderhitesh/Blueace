import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';

const CreateService = () => {
    const [category, setCategory] = useState([]);
    const [formData, setFormData] = useState({
        ServiceCategorey: '',
        ServiceName: '',
        Para: '',
        Price: '',
        ServiceState: true,
        DiscountPrice: '',
        ServiceSpecilatity: [],
        DiscountPercentage: '',
        serviceImage: [], // Images
        newSpecilaity: '' // For handling new specialities
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);

    // Fetch service categories
    const fetchServicesCategorey = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/Product/Get-All-category`);
            const response = data.data;

            const findServices = response.filter(item =>
                item.CategoryType && (item.CategoryType.includes('Service') || item.CategoryType.includes('services'))
            );
            setCategory(findServices);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories');
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form data state
        setFormData(prevData => {
            const updatedData = { ...prevData, [name]: value };

            // Auto calculate discount price after updating the relevant fields
            if (name === 'Price' || name === 'DiscountPercentage') {
                const price = parseFloat(updatedData.Price);
                const discountPercentage = parseFloat(updatedData.DiscountPercentage);
                if (!isNaN(price) && !isNaN(discountPercentage)) {
                    const discountPrice = price - (price * (discountPercentage / 100));
                    updatedData.DiscountPrice = discountPrice.toFixed(2); // Round to two decimal places
                } else {
                    updatedData.DiscountPrice = ''; // Reset discount price if inputs are invalid
                }
            }

            return updatedData;
        });
    };

    // Handle image upload and preview
    const handleImageUpload = (e) => {
        const files = e.target.files; // Get the files from the input
        setFormData(prevData => ({
            ...prevData,
            serviceImage: files // Save files directly in the state
        }));

        // Create image previews
        const imagePreviewsArray = Array.from(files).map(image => URL.createObjectURL(image));
        setImagePreviews(imagePreviewsArray);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        setLoading(true);

        try {
            const payload = new FormData();
            payload.append('ServiceCategorey', formData.ServiceCategorey);
            payload.append('ServiceName', formData.ServiceName);
            payload.append('Price', formData.Price);
            payload.append('Para', formData.Para);

            payload.append('ServiceSpecilatity', formData.ServiceSpecilatity);
            payload.append('DiscountPrice', formData.DiscountPrice);
            payload.append('ServiceState', formData.ServiceState);
            payload.append('DiscountPercentage', formData.DiscountPercentage);

            // Append images to form data
            Array.from(formData.serviceImage).forEach((image) => {
                payload.append('images', image);
            });

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/Doctors/Create-Service`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle success
            // setFormData({
            //     ServiceCategorey: '',
            //     ServiceName: '',
            //     Para: '',
            //     Price: '',
            //     ServiceSpecilatity:[],
            //     DiscountPrice: '',
            //     DiscountPercentage: '',
            //     serviceImage: []
            // });
            setImagePreviews([]);
            setError('');
        } catch (error) {
            setError('Failed to create service');
        } finally {
            setLoading(false);
        }
    };

    // Handle add specialty
    const handleAddSpecilaity = (e) => {
        e.preventDefault();
        if (formData.newSpecilaity) {
            setFormData({
                ...formData,
                ServiceSpecilatity: [...formData.ServiceSpecilatity, formData.newSpecilaity],
                newSpecilaity: '' // Reset input after adding
            });
        }
    };

    // Handle remove specialty
    const handleRemoveSpecilaity = (index) => {
        const updatedSpecialities = formData.ServiceSpecilatity.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            ServiceSpecilatity: updatedSpecialities
        });
    };

    useEffect(() => {
        fetchServicesCategorey();
    }, []);

    return (
        <div>
            <Breadcrumb heading={'Service'} subHeading={'Service'} LastHeading={'Create Service'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-md-6">
                        <label htmlFor="ServiceCategorey">Service Category</label> <br />
                        <select name="ServiceCategorey" className='form-select' id="ServiceCategorey" value={formData.ServiceCategorey} onChange={handleChange} required>
                            <option value="">--- Select Service Category ---</option>
                            {category && category.length > 0 ? (
                                category.map((item) => (
                                    <option key={item._id} value={item._id}>{item.CategoryTitle}</option>
                                ))
                            ) : null}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="ServiceName">Service Title</label>
                        <Input
                            type='text'
                            placeholder='Enter Service Title'
                            name='ServiceName'
                            value={formData.ServiceName}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>
                    <div className="col-md-4 mt-4">
                        <label htmlFor="Price">Service Price</label>
                        <Input
                            type='number'
                            placeholder='Enter Service Price'
                            name='Price'
                            value={formData.Price}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>
                    <div className="col-md-4 mt-4">
                        <label htmlFor="DiscountPercentage">Discount Percentage</label>
                        <Input
                            type='number'
                            placeholder='Enter Discount Percentage'
                            name='DiscountPercentage'
                            value={formData.DiscountPercentage}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>
                    <div className="col-md-4 mt-4">
                        <label htmlFor="DiscountPrice">Discount Price</label>
                        <Input
                            type='number'
                            placeholder='Discount Price'
                            name='DiscountPrice'
                            value={formData.DiscountPrice}
                            readOnly
                        />
                    </div>
                    {imagePreviews.length > 0 && (
                        <div className="col-md-12">
                            <h5>Image Previews:</h5>
                            <div className="d-flex">
                                {imagePreviews.map((image, index) => (
                                    <div key={index} className="me-2">
                                        <img src={image} alt={`preview-${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="col-md-12 mt-4">
                        <div className="mb-3 mt-4">
                            <label className="form-label f-w-600 mb-2">Upload Service Image</label>
                            <div className="dropzone card" onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }}>
                                <div className="dz-message needsclick text-center p-4">
                                    <i className="fa-solid fa-cloud-arrow-up mb-3"></i>
                                    <h6>Drop files here or click to upload.</h6>
                                    <span className="note needsclick">(Supported formats: JPG, PNG)</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                id="fileInput"
                                multiple
                                className="form-control"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div className="col-md-12 mb-4 mt-4">
                        <label htmlFor="Para" className="form-label">Para</label>
                        <textarea
                            id="Para"
                            className="form-control"
                            rows="4"
                            name='Para'
                            value={formData.Para}
                            onChange={handleChange}
                            placeholder="Enter your text here..."

                        ></textarea>
                    </div>
                    {/* Speciality Field */}
                    <div className="col-md-12 mt-4">
                        <label htmlFor="newSpecilaity">Add Specialty</label>
                        <input
                            type="text"
                            name="newSpecilaity"
                            value={formData.newSpecilaity}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Add Specialty"
                        />
                        <button onClick={handleAddSpecilaity} className="btn btn-primary mt-2">Add Specialty</button>

                        {/* Display existing specialties */}
                        {formData.ServiceSpecilatity.length > 0 && (
                            <ul className="mt-3">
                                {formData.ServiceSpecilatity.map((specilaity, index) => (
                                    <li key={index}>
                                        {specilaity}
                                        <button className="btn btn-danger btn-sm ms-2" onClick={() => handleRemoveSpecilaity(index)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                    <div className='col-md-10 mx-auto mt-4'>
                        <button className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`} disabled={loading} type='submit'>{loading ? 'Please Wait' : 'Submit'}</button>

                    </div>
                </div>
            } />
        </div >
    );
};

export default CreateService;
