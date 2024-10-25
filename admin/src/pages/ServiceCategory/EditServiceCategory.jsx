import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To get the category ID from URL
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

function EditServiceCategory() {
    const { id } = useParams(); // Get category ID from URL parameters
    const [categories, setCategories] = useState([]);
    const editorRef = useRef(null);
    const [formData, setFormData] = useState({
        icon: null,
        name: '',
        description: '',
        sliderImage: [],
        mainCategoryId:'',
        metaTitle: '',
        metaDescription: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [iconPreview, setIconPreview] = useState(null); // For single icon preview

    const handleFetchCategory = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/get-all-service-main-category')
            setCategories(res.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchCategory();
    }, [])

    useEffect(() => {
        // Fetch the existing service category data based on the ID
        const fetchCategoryData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:7000/api/v1/get-single-service-category/${id}`);
                const category = data.data;

                setFormData({
                    name: category.name,
                    description: category.description,
                    icon: null, 
                    sliderImage: [], 
                    mainCategoryId: category.mainCategoryId?._id,
                    metaTitle: category.metaTitle,
                    metaDescription: category.metaDescription,
                });

                setIconPreview(category.icon?.url || null);
                setImagePreviews(category.sliderImage.map(img => img.url)); // Set existing slider images
            } catch (error) {
                setError('Failed to load category data');
                console.error(error);
            }
        };

        fetchCategoryData();
    }, [id]);

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true before starting the request

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('description', formData.description);
        payload.append('mainCategoryId', formData.mainCategoryId);
        payload.append('metaTitle', formData.metaTitle);
        payload.append('metaDescription', formData.metaDescription);

        // Append icon if updated
        if (formData.icon) {
            payload.append('icon', formData.icon);
        }

        // Append slider images if updated
        if (formData.sliderImage.length > 0) {
            Array.from(formData.sliderImage).forEach((image) => {
                payload.append('sliderImage', image);
            });
        }

        try {
            await axios.put(`http://localhost:7000/api/v1/update-service-category/${id}`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Updated Successfully!')

            setError(''); // Clear errors
        } catch (error) {
            console.error('Error updating service category:', error);
            setError('Failed to update service category');
        } finally {
            setLoading(false); // Ensure loading is set to false after request completion
        }
    };

    // Editor Configuration
    const editorConfig = {
        readonly: false,
        height: 400,
    };

    // Handle Editor Change for Multiple Fields
    const handleEditorChange = useCallback((newContent, field) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: newContent
        }));
    }, []);


    return (
        <div>
            <Breadcrumb heading={'Service'} subHeading={'Sub Category'} LastHeading={'Edit Sub Category'} backLink={'/service/category'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-md-6">
                        <label htmlFor="name">Category</label>
                        <select
                            class="form-select"
                            name='mainCategoryId'
                            id="category"
                            value={formData.mainCategoryId}
                            onChange={handleChange} // Add this to handle selection
                        >
                            <option value="">Select Main Category</option> {/* Add a default empty option */}
                            {
                                categories && categories.map((item, index) => (
                                    <option key={index} value={item._id}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="name">Sub Category</label>
                        <Input
                            type='text'
                            placeholder='Enter Sub category'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>

                    <div className="col-md-12 mb-4 mt-4">
                        <label htmlFor="description" className="form-label">Description</label>
                        <JoditEditor
                            ref={editorRef}
                            value={formData.description}
                            config={editorConfig}
                            tabIndex={1}
                            onBlur={(newContent) => handleEditorChange(newContent, 'description')} // Pass 'courseDescription'
                        />
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

                    
                    <div className="col-md-12 mt-3">
                        <label htmlFor="metaTitle" className='form-label'>Meta Title</label>
                        <textarea
                            class="form-control"
                            rows="5"
                            cols="5"
                            placeholder="Enter Meta Title"
                            name='metaTitle'
                            value={formData.metaTitle}
                            onChange={handleChange}
                            required={true}
                            id='metaTitle'
                        ></textarea>
                    </div>
                    <div className="col-md-12 mt-3">
                        <label htmlFor="metaDescription" className='form-label'>Meta Description</label>
                        <textarea
                            class="form-control"
                            rows="5"
                            cols="5"
                            placeholder="Enter Meta Description"
                            name='metaDescription'
                            value={formData.metaDescription}
                            onChange={handleChange}
                            required={true}
                            id='metaDescription'
                        ></textarea>
                    </div>

                    <div className='col-md-10 mx-auto mt-4'>
                        <button className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`} disabled={loading} type='submit'>
                            {loading ? 'Please Wait...' : 'Update'}
                        </button>
                    </div>
                </div>
            } />
        </div >
    );
}

export default EditServiceCategory;
