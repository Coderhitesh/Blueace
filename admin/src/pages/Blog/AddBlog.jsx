import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

function AddBlog() {
    const [formData, setFormData] = useState({
        smallImage: null,
        title: '',
        content: '',
        largeImage: null,
        metaTitle: '',
        metaDescription: ''
    });
    const editor = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [smallImagePreviews, setsmallImagePreviews] = useState(null);
    const [largeImagePreview, setlargeImagePreview] = useState(null);

    // Handle input changes
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

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('content', formData.content);
        payload.append('metaTitle', formData.metaTitle);
        payload.append('metaDescription', formData.metaDescription);

        if (formData.smallImage) {
            payload.append('smallImage', formData.smallImage);
        } else {
            setError('Service image is required.');
            setLoading(false);
            return;
        }

        if (formData.largeImage) {
            payload.append('largeImage', formData.largeImage);
        } else {
            setError('Service banner is required.');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('https://api.blueace.co.in/api/v1/create-blog', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Service Created Successfully!');
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
            <Breadcrumb heading={'Home Layout'} subHeading={'Add Blog'} LastHeading={'Create Blog'} backLink={'/home-layout/all-blog'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>

                    {/* Service Name Input */}
                    <div className="col-md-6">
                        <label htmlFor="name">Title</label>
                        <Input
                            type='text'
                            placeholder='Enter Title'
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
                            ref={editor}
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
                                    <h5>LLarge Image Preview:</h5>
                                    <img src={largeImagePreview} alt="Icon Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                </div>
                            )}
                            <label className="form-label f-w-600 mb-2">Upload Large Image Image</label>
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
        </div>
    );
}

export default AddBlog
