import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CreateCategoryModel = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    status: true,
    CategoryType:[],
    image: null,
  });

  // Handle file change and set preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevFormData) => ({ ...prevFormData, image: file }));
    setImagePreview(URL.createObjectURL(file)); // Set image preview
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
    newData.append('images', formData.image);
    newData.append('CategoryType', formData.CategoryType.join(','));

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/Product/create-category`, newData);
      console.log(data)
      toast.success('Category created successfully!');
      window.location.reload()
      onClose(); // Close the modal after success
    } catch (error) {
      console.log(error)
      setError('Error creating category');
      toast.error('Failed to create category!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={`modal fade`} style={{ display: isOpen ? 'block' : 'none' }} id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title">Create Category</h5>
              <button className="btn-close" type="button" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="product-box row">
                <div className="product-img col-lg-6">
                  {imagePreview ? (
                    <img className="img-fluid" src={imagePreview} alt="Category" />
                  ) : (
                    <img className="img-fluid" src="https://placehold.co/600x600" alt="Placeholder" />
                  )}
                </div>
                <div className="product-details col-lg-6 text-start">
                  <div className="col-sm-12">
                    <div className="mb-3">
                      <h5 className="f-w-600 mb-2">Title</h5>
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
                  <div className="col-sm-12">
                    <div className="mb-3">
                      <h5 className="f-w-600 mb-2">Category Status</h5>
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
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="mb-3">
                        <h5 className="f-w-600 mb-2">Upload Category Image</h5>
                        {/* Make the div clickable */}
                        <div className="dropzone" id="singleFileUpload" onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }}>
                          <div className="dz-message needsclick">
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                            <h6>Drop files here or click to upload.</h6>
                            <span className="note needsclick">
                              (This is just a demo dropzone. Selected files are<strong> not</strong> actually uploaded.)
                            </span>
                          </div>
                        </div>
                        {/* Hidden file input */}
                        <input
                          type="file"
                          id="fileInput"
                          className="form-control"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Category'}
                  </button>
                  {error && <div className="text-danger mt-3">{error}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModel;
