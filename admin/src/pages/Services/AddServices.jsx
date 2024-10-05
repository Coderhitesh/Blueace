import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

function AddServices() {
    const [formData, setFormData] = useState({
        serviceImage: null,
        name: '',
        description: '',
        serviceBanner: null,
        subCategoryId: ''
    });
    const editor = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [serviceImagePreviews, setServiceImagePreviews] = useState(null);
    const [serviceBannerPreview, setServiceBannerPreview] = useState(null); // For single icon preview
    const [categories, setCategories] = useState([]);

    // Fetching the categories from the backend
    const handleFetchCategory = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/get-all-service-category');
            setCategories(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleFetchCategory();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form data state
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle service image upload
    const handleServiceImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                serviceImage: file
            }));
            setServiceImagePreviews(URL.createObjectURL(file)); // Preview the selected image
        }
    };

    // Handle service banner upload
    const handleServiceBannerUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                serviceBanner: file
            }));
            setServiceBannerPreview(URL.createObjectURL(file)); // Preview the selected banner
        }
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('description', formData.description);
        payload.append('subCategoryId', formData.subCategoryId);

        if (formData.serviceImage) {
            payload.append('serviceImage', formData.serviceImage);
        } else {
            setError('Service image is required.');
            setLoading(false);
            return;
        }

        if (formData.serviceBanner) {
            payload.append('serviceBanner', formData.serviceBanner);
        } else {
            setError('Service banner is required.');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('http://localhost:7000/api/v1/create-service', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // console.log('Service created successfully:', res.data);
            toast.success('Service Created Successfully!')
        } catch (error) {
            console.error('Error creating service:', error);
            setError('Failed to create service.');
        } finally {
            setLoading(false);
        }
    };

    const editorConfig = {
        readonly: false,
        height: 400
    };

    const handleEditorChange = useCallback((newContent, field) => {
        setFormData(prevFormData => ({ ...prevFormData, [field]: newContent }));
    }, []);

    return (
        <div>
            <Breadcrumb heading={'Service'} subHeading={'All Services'} LastHeading={'Create Service'} backLink={'/service/all-service'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    {/* Sub Category Select */}
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="subCategoryId">Sub Category</label>
                        <select
                            className="form-select"
                            name='subCategoryId'
                            id="subCategoryId"
                            value={formData.subCategoryId}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Service Name Input */}
                    <div className="col-md-6">
                        <label htmlFor="name">Service Name</label>
                        <Input
                            type='text'
                            placeholder='Enter Service Name'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>

                    {/* Description Editor */}
                    <div className="col-md-12 mb-4 mt-4">
                        <label htmlFor="description" className="form-label">Description</label>
                        <JoditEditor
                            ref={editor}
                            value={formData.description}
                            config={editorConfig}
                            onBlur={(newContent) => handleEditorChange(newContent, 'description')}
                        />
                    </div>

                    {/* Service Image Upload */}
                    <div className="col-md-12 mt-4">
                        <div className="mb-3">
                            {serviceImagePreviews && (
                                <div className="mb-3">
                                    <h5>Service Image Preview:</h5>
                                    <img src={serviceImagePreviews} alt="Icon Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                </div>
                            )}
                            <label className="form-label f-w-600 mb-2">Upload Icon (Single Image)</label>
                            <div className="dropzone card" onClick={() => document.getElementById('iconInput').click()} style={{ cursor: 'pointer' }}>
                                <div className="dz-message needsclick text-center p-4">
                                    <i className="fa-solid fa-cloud-arrow-up mb-3"></i>
                                    <h6>Drop files here or click to upload.</h6>
                                    <span className="note needsclick">(Supported formats: JPG, PNG)</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                id="iconInput"
                                className="form-control"
                                style={{ display: 'none' }}
                                onChange={handleServiceImageUpload}
                                name="serviceImage"
                                accept="image/*"
                            />

                        </div>
                    </div>

                    {/* Service Banner Upload */}
                    <div className="col-md-12 mt-4">
                        <div className="mb-3 mt-4">
                            {serviceBannerPreview && (
                                <div className="mb-3">
                                    <h5>Service Banner Preview:</h5>
                                    <img src={serviceBannerPreview} alt="Icon Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                </div>
                            )}
                            <label className="form-label f-w-600 mb-2">Upload Category Slider Image</label>
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
                                name="serviceBanner"
                                multiple
                                className="form-control"
                                style={{ display: 'none' }}
                                onChange={handleServiceBannerUpload}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
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

export default AddServices;
