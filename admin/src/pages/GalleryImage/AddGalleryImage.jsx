import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import toast from 'react-hot-toast';

function AddGalleryImage() {
  const [galleryTitle, setGalleryTitle] = useState([])
  const [formData, setFormData] = useState({
    image: null,
    galleryCategoryId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        image: file
      }));
      setImagePreviews(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  const handleFetchGalleryTitle = async () => {
    try {
      const res = await axios.get('http://localhost:7987/api/v1/get-all-gallery-category-name')
      setGalleryTitle(res.data.data)
    } catch (error) {
      console.log("Eror in fetching  gallery title", error);
      toast.error('Internal Server Error in getting gallery title');
    }
  }

  useEffect(() => {
    handleFetchGalleryTitle()
  }, [])

  const handleChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = new FormData();
    payload.append('galleryCategoryId', formData.galleryCategoryId)
    if (formData.image) {
      payload.append('image', formData.image);
    } else {
      setError('Please select an image');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:7987/api/v1/create-gallery-image', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Gallery image uploaded successfully!')
    } catch (error) {
      console.error('Error creating Gallery image:', error);
      setError('Failed to Gallery image.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <Breadcrumb heading={'Home Layout'} subHeading={'All Gallery Image'} LastHeading={'Create Gallery Image'} backLink={'/home-layout/all-gallery-image'} />

      {error && <div className="alert alert-danger">{error}</div>}

      <FormGroups onSubmit={handleSubmit} Elements={
        <div className='row'>

          <div className="col-md-6">
            <label className="form-label" htmlFor="categoryId">Gallery Title</label>
            <select
              className="form-select"
              name='galleryCategoryId'
              id="galleryCategoryId"
              value={formData.galleryCategoryId}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {galleryTitle.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-12 mt-4">
            <div className="mb-3 mt-4">
              {imagePreviews && (
                <div className="mb-3">
                  <h5>Gallery Image Preview:</h5>
                  <img src={imagePreviews} alt="Icon Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </div>
              )}
              <label className="form-label f-w-600 mb-2">Upload Gallery Image</label>
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
                name="image"
                multiple
                className="form-control"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
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
  )
}

export default AddGalleryImage
