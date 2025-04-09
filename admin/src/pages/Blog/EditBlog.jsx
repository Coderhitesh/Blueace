import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To get the category ID from URL
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';
import { useMemo } from 'react';

function EditBlog() {
    const { id } = useParams();
    const editorRef = useRef(null);
    const [formData, setFormData] = useState({
        smallImage: null,
        title: '',
        content: '',
        largeImage: null,
        metaTitle: '',
        metaDescription: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [smallImagePreviews, setsmallImagePreviews] = useState(null);
    const [largeImagePreview, setlargeImagePreview] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/get-single-blog/${id}`);
                const category = data.data;

                setFormData({
                    title: category.title,
                    content: category.content,
                    smallImage: null,
                    largeImage: null,
                    metaTitle: category.metaTitle,
                    metaDescription: category.metaDescription,
                });

                setsmallImagePreviews(category.smallImage?.url || null);
                setlargeImagePreview(category.largeImage?.url || null);

                // console.log('existing serviceimage', category.serviceImage?.url)


            } catch (error) {
                setError('Failed to load service data');
                console.error(error);
            }
        };

        fetchCategoryData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle service image upload
    const handlesmallImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                smallImage: file
            }));
            setsmallImagePreviews(URL.createObjectURL(file)); // Preview the selected image
        }
    };

    // Handle service banner upload
    const handlelargeImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                largeImage: file
            }));
            setlargeImagePreview(URL.createObjectURL(file)); // Preview the selected banner
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('content', formData.content);
        payload.append('metaTitle', formData.metaTitle);
        payload.append('metaDescription', formData.metaDescription);

        // console.log('sending serviceimage', formData.serviceImage)

        // Check if a new service image has been uploaded
        if (formData.smallImage) {
            payload.append('smallImage', formData.smallImage);
        } else {
            // If no new image is uploaded, use the existing one
            if (smallImagePreviews) {
                payload.append('smallImage', smallImagePreviews);
            } else {
                setError('Blog Small Image is required.');
                setLoading(false);
                return;
            }
        }

        // Check if a new service banner has been uploaded
        if (formData.largeImage) {
            payload.append('largeImage', formData.largeImage);
        } else {
            if (largeImagePreview) {
                payload.append('largeImage', largeImagePreview);
            } else {
                setError('Blog Large Image is required.');
                setLoading(false);
                return;
            }
        }

        try {
            await axios.put(`https://api.blueaceindia.com/api/v1/update-blog/${id}`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Updated Successfully!')

            setError('');
        } catch (error) {
            console.error('Error updating blogs:', error);
            setError('Failed to update blogs');
        } finally {
            setLoading(false);
        }
    };

    // Editor Configuration
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
            <Breadcrumb heading={'Home Layout'} subHeading={'All Blog'} LastHeading={'Edit Blog'} backLink={'/home-layout/all-blog'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>

                {/* Service Name Input */}
                <div className="col-md-6">
                    <label htmlFor="name">Title</label>
                    <Input
                        type='text'
                        placeholder='Enter Ttile'
                        name='title'
                        value={formData.title}
                        onChange={handleChange}
                        required={true}
                    />
                </div>

                {/* content Editor */}
                <div className="col-md-12 mb-4 mt-4">
                    <label htmlFor="content" className="form-label">Content</label>
                    <JoditEditor
                        ref={editorRef}
                        value={formData.content}
                        config={editorConfig}
                        onBlur={(newContent) => handleEditorChange(newContent, 'content')}
                    />
                </div>

                {/* Service Image Upload */}
                <div className="col-md-12 mt-4">
                    <div className="mb-3">
                        {smallImagePreviews && (
                            <div className="mb-3">
                                <h5>Small Image Preview:</h5>
                                <img src={smallImagePreviews} alt="Icon Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            </div>
                        )}
                        <label className="form-label f-w-600 mb-2">Upload Small Image (Single Image)</label>
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
                            onChange={handlesmallImageUpload}
                            name="smallImage"
                            accept="image/*"
                        />

                    </div>
                </div>

                {/* Service Banner Upload */}
                <div className="col-md-12 mt-4">
                    <div className="mb-3 mt-4">
                        {largeImagePreview && (
                            <div className="mb-3">
                                <h5>Large Image Preview:</h5>
                                <img src={largeImagePreview} alt="Icon Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            </div>
                        )}
                        <label className="form-label f-w-600 mb-2">Upload Large Image</label>
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
                            name="largeImage"
                            multiple
                            className="form-control"
                            style={{ display: 'none' }}
                            onChange={handlelargeImageUpload}
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

                {/* Submit Button */}
                <div className='col-md-10 mx-auto mt-4'>
                    <button className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`} disabled={loading} type='submit'>
                        {loading ? 'Please Wait...' : 'Submit'}
                    </button>
                </div>
            </div>
            } />
        </div >
    )
}

export default EditBlog
