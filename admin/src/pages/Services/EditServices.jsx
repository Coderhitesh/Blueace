import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To get the category ID from URL
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';
import { useMemo } from 'react';

function EditServices() {
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const editorRef = useRef(null);
    const [formData, setFormData] = useState({
        serviceImage: null,
        name: '',
        description: '',
        serviceBanner: null,
        subCategoryId: '',
        categoryId: '',
        metaTitle: '',
        metaDescription: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [serviceImagePreviews, setServiceImagePreviews] = useState([]);
    const [serviceBannerPreview, setServiceBannerPreview] = useState(null);
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const handleFetchMainCategory = async () => {
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-service-main-category');
            setMainCategories(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFetchSubCategory = async (categoryId) => {
        try {
            const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/get-all-service-category?mainCategoryId=${categoryId}`);
            setSubCategories(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleFetchMainCategory();
    }, []);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const { data } = await axios.get(`https://www.api.blueaceindia.com/api/v1/get-single-service/${id}`);
                const category = data.data;

                setFormData({
                    name: category.name,
                    description: category.description,
                    serviceImage: null,
                    serviceBanner: null,
                    subCategoryId: category.subCategoryId?._id || '',
                    categoryId: category.categoryId?._id || '',
                    metaTitle: category.metaTitle,
                    metaDescription: category.metaDescription,
                });

                setServiceImagePreviews(category.serviceImage?.url || null);
                setServiceBannerPreview(category.serviceBanner?.url || null);

                // console.log('existing serviceimage', category.serviceImage?.url)

                if (category.categoryId?._id) {
                    handleFetchSubCategory(category.categoryId._id);
                }

            } catch (error) {
                setError('Failed to load service data');
                console.error(error);
            }
        };

        fetchCategoryData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'categoryId') {
            setFormData(prevData => ({
                ...prevData,
                categoryId: value,
                subCategoryId: '', // Reset subCategoryId when categoryId changes
            }));
            handleFetchSubCategory(value); // Fetch subcategories based on categoryId
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleServiceImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                serviceImage: file
            }));
            setServiceImagePreviews(URL.createObjectURL(file));
        }
    };

    const handleServiceBannerUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                serviceBanner: file
            }));
            setServiceBannerPreview(URL.createObjectURL(file));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if categoryId and subCategoryId are selected
        if (!formData.categoryId) {
            setError('Main Category is required.');
            setLoading(false);
            return;
        }
        if (!formData.subCategoryId) {
            setError('Sub Category is required.');
            setLoading(false);
            return;
        }

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('description', formData.description);
        payload.append('subCategoryId', formData.subCategoryId);
        payload.append('categoryId', formData.categoryId);
        payload.append('metaTitle', formData.metaTitle);
        payload.append('metaDescription', formData.metaDescription);

        // console.log('sending serviceimage', formData.serviceImage)

        // Check if a new service image has been uploaded
        if (formData.serviceImage) {
            payload.append('serviceImage', formData.serviceImage);
        } else {
            // If no new image is uploaded, use the existing one
            if (serviceImagePreviews) {
                payload.append('serviceImage', serviceImagePreviews);
            } else {
                setError('Service image is required.');
                setLoading(false);
                return;
            }
        }

        // Check if a new service banner has been uploaded
        if (formData.serviceBanner) {
            payload.append('serviceBanner', formData.serviceBanner);
        }

        try {
            await axios.put(`https://www.api.blueaceindia.com/api/v1/update-service/${id}`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Updated Successfully!')

            setError('');
        } catch (error) {
            console.error('Error updating service category:', error);
            setError('Failed to update service category');
        } finally {
            setLoading(false);
        }
    };

    // Editor Configuration
    // const editorConfig = {
    //     readonly: false,
    //     height: 400,
    // };

    const editorConfig = useMemo(
		() => ({
			readonly: false,
            height: 400,
		}),
		[]
	);

    const handleEditorChange = useCallback((newContent, field) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: newContent
        }));
    }, []);

    return (
        <div>
            <Breadcrumb heading={'Service'} subHeading={'All Services'} LastHeading={'Edit Service'} backLink={'/service/all-service'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="categoryId">Main Category</label>
                        <select
                            className="form-select"
                            name='categoryId'
                            id="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                        >
                            <option value="">Select Main Category</option>
                            {mainCategories.map((item) => (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label" htmlFor="subCategoryId">Sub Category</label>
                        <select
                            className="form-select"
                            name='subCategoryId'
                            id="subCategoryId"
                            value={formData.subCategoryId}
                            onChange={handleChange}
                            disabled={!formData.categoryId} // Disable if no category is selected
                        >
                            <option value="">Select Sub Category</option>
                            {subCategories.map((item) => (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mt-2">
                        <label className='form-label' htmlFor="name">Service Name</label>
                        <Input
                            type='text'
                            placeholder='Enter Service Name'
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
                            {serviceImagePreviews && (
                                <div className="mb-3">
                                    <h5>Icon Preview:</h5>
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
                    {/* <div className="col-md-12 mt-4">
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
                    </div> */}

                    {/* <div className="col-md-12 mt-3">
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
                    </div> */}
                    {/* <div className="col-md-12 mt-3">
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
                    </div> */}


                    <div className='col-md-10 mx-auto mt-4'>
                        <button className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`} disabled={loading} type='submit'>
                            {loading ? 'Please Wait...' : 'Update'}
                        </button>
                    </div>
                </div>
            } />
        </div >
    )
}

export default EditServices
