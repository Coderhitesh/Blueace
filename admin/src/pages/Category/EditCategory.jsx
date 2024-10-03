import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EditCategory = () => {
    const url = new URLSearchParams(window.location.search);
    const id = url.get('id');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        imageAlreadyUploaded: '',  // Pre-uploaded image
        status: true,
        CategoryType:[],
        image: null,  // New image to be uploaded
    });

    const handleFetch = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/Product/Get-All-category`);
            const category = data.data.find((item) => item._id === id);
            if (category) {
                setFormData({
                    title: category.CategoryTitle || '',
                    status: category.isActive,
                    CategoryType: category.CategoryType || [],
                    imageAlreadyUploaded: category.Image.url || '' 
                });
                setImagePreview(category.Image.url);  
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    // Handle file change and set preview
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData((prevFormData) => ({ ...prevFormData, image: file }));
        setImagePreview(URL.createObjectURL(file));  // Show the new image as preview
    };

    // Handle input change for title and status
    const handleChange = (e) => {
        const { name, value } = e.target;
            if (name === 'CategoryType') {
          const categoryArray = value.split(',').map(cat => cat.trim()); // Split and trim
          setFormData((prevFormData) => ({ ...prevFormData, [name]: categoryArray }));
        } else {
          setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        }
      };
    // Handle form submit
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const newData = new FormData();
        newData.append('CategoryTitle', formData.title);
        newData.append('status', formData.status);
        newData.append('CategoryType', formData.CategoryType.join(','));
        if (formData.image) {
            newData.append('images', formData.image);  // Only append new image if it exists
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/Product/update-category/${id}`, newData);
            console.log(data);
            toast.success('Category updated successfully!');
            window.location.href = "/category/manage";  // Redirect after success
        } catch (error) {
            console.log(error);
            setError('Error updating category');
            toast.error('Failed to update category!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h5 className="card-title mb-4">Update Category</h5>
                <div className="row">
                    <div className="col-lg-6">
                        {/* Image Section */}
                        <div className="mb-3">
                            {imagePreview ? (
                                <img className="img-fluid" src={imagePreview} alt="Category" />
                            ) : (
                                <img className="img-fluid" src="https://placehold.co/600x600" alt="Placeholder" />
                            )}
                        </div>
                    </div>

                    <div className="col-lg-6">
                        {/* Form Section */}
                        <div className="mb-3">
                            <label className="form-label f-w-600 mb-2">Title</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Category Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label f-w-600 mb-2">Category Type</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Category Types (comma separated)"
                                name="CategoryType"
                                value={formData.CategoryType.join(',')}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label f-w-600 mb-2">Category Status</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value={true}>Active</option>
                                <option value={false}>Pause</option>
                            </select>
                        </div>

                        {/* Image Upload Section */}
                        <div className="mb-3">
                            <label className="form-label f-w-600 mb-2">Upload Category Image</label>
                            <div className="dropzone card" onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }}>
                                <div className="dz-message needsclick text-center p-4">
                                    <i className="fa-solid fa-cloud-arrow-up mb-3"></i>
                                    <h6>Drop files here or click to upload.</h6>
                                    <span className="note needsclick">
                                        (Supported formats: JPG, PNG. Maximum file size: 5MB.)
                                    </span>
                                </div>
                            </div>
                            <input
                                type="file"
                                id="fileInput"
                                className="form-control"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Category'}
                        </button>
                        {error && <div className="text-danger mt-3">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCategory;
