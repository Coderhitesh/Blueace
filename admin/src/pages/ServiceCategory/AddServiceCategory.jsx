import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';

function AddServiceCategory() {
    const [formData, setFormData] = useState({
        icon: null,
        name: '',
        description: '',
        sliderImage: [], 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [iconPreview, setIconPreview] = useState(null); // For single icon preview

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form data state
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle icon upload and preview
    const handleIconUpload = (e) => {
        const file = e.target.files[0]; // Single file for icon
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                icon: file
            }));
            setIconPreview(URL.createObjectURL(file)); // Create preview for the icon
        }
    };

    // Handle slider image upload and preview
    const handleImageUpload = (e) => {
        const files = e.target.files; // Multiple files for slider
        setFormData(prevData => ({
            ...prevData,
            sliderImage: files // Save files directly in the state
        }));

        // Create image previews
        const imagePreviewsArray = Array.from(files).map(image => URL.createObjectURL(image));
        setImagePreviews(imagePreviewsArray);
    };

    // Handle form submission
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true before starting the request
    
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('description', formData.description);
        
        // Append icon
        if (formData.icon) {
            payload.append('icon', formData.icon);
        } else {
            setError('Icon is required');
            setLoading(false); // Reset loading state if there is an error
            return;
        }
    
        // Append slider images
        if (formData.sliderImage.length > 0) {
            Array.from(formData.sliderImage).forEach((image) => {
                payload.append('sliderImage', image);
            });
        } else {
            setError('Slider images are required');
            setLoading(false); // Reset loading state if there is an error
            return;
        }
    
        try {
            await axios.post('http://localhost:7000/api/v1/create-service-category', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Reset form and states
            setImagePreviews([]);
            setIconPreview(null);
            setFormData({ 
                icon: null,
                name: '',
                description: '',
                sliderImage: [],
            });
        } catch (error) {
            console.error('Error creating service:', error);
            setError('Failed to create service');
        } finally {
            setLoading(false); // Ensure loading is set to false after request completion
        }
    };
    


    return (
        <div>
            <Breadcrumb heading={'Service'} subHeading={'Service'} LastHeading={'Create Service'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-md-6">
                        <label htmlFor="name">Service Title</label>
                        <Input
                            type='text'
                            placeholder='Enter Service Title'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>
                    <div className="col-md-12 mb-4 mt-4">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            className="form-control"
                            rows="4"
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter your text here..."
                        ></textarea>
                    </div>

                    {/* Icon Upload */}
                    <div className="col-md-12 mt-4">
                        <div className="mb-3">
                        {iconPreview && (
                                <div className="mb-3">
                                    <h5>Icon Preview:</h5>
                                    <img src={iconPreview} alt="Icon Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
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
                                onChange={handleIconUpload}
                                name="icon"
                                accept="image/*"
                            />
                           
                        </div>
                    </div>

                    {/* Image Previews */}
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

                    {/* Slider Image Upload */}
                    <div className="col-md-12 mt-4">
                        <div className="mb-3 mt-4">
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
                                 name="sliderImage"
                                multiple
                                className="form-control"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    

                    <div className='col-md-10 mx-auto mt-4'>
    <button className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`} disabled={loading} type='submit'>
        {loading ? 'Please Wait...' : 'Submit'}
    </button>
</div>

                </div>
            } />
        </div >
    );
}

export default AddServiceCategory;
