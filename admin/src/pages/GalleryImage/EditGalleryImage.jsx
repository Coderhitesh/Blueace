import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditGalleryImage() {
  const { id } = useParams();
  const [galleryTitle, setGalleryTitle] = useState([]);
  const [formData, setFormData] = useState({
    image: null,
    galleryCategoryId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/get-single-gallery-image/${id}`);
        const res = data.data;
        setImagePreviews(res.image?.url || null);
        setFormData(prevData => ({
          ...prevData,
          galleryCategoryId: res.galleryCategoryId._id || ''
        }));
      } catch (error) {
        setError('Failed to load gallery image');
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  const handleFetchGalleryTitle = async () => {
    try {
      const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-gallery-category-name');
      setGalleryTitle(res.data.data);
    } catch (error) {
      console.log("Error in fetching gallery title", error);
      toast.error('Internal Server Error in getting gallery title');
    }
  };

  useEffect(() => {
    handleFetchGalleryTitle();
  }, []);

  const handleServiceImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        image: file
      }));
      setImagePreviews(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.galleryCategoryId) {
      setError('Please select a Gallery Title');
      setLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append('galleryCategoryId', formData.galleryCategoryId);
    if (formData.image) {
      payload.append('image', formData.image);
    } else {
      setError('Please select an image');
      setLoading(false);
      return;
    }

    try {
      await axios.put(`https://api.blueaceindia.com/api/v1/update-gallery-image/${id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Gallery Image Updated successfully!');
    } catch (error) {
      console.error('Error in updating Gallery Image:', error);
      setError('Failed to update Gallery Image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb heading={'Home Layout'} subHeading={'All Gallery Image'} LastHeading={'Edit Gallery Image'} backLink={'/home-layout/all-gallery-image'} />

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
                  <h5>FAQ Banner Preview:</h5>
                  <img src={imagePreviews} alt="Icon Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </div>
              )}
              <label className="form-label f-w-600 mb-2">Upload FAQ Banner Image:</label>
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
                className="form-control"
                style={{ display: 'none' }}
                onChange={handleServiceImageUpload}
                accept="image/*"
              />
            </div>
          </div>

          <div className='col-md-10 mx-auto mt-4'>
            <button className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`} disabled={loading} type='submit'>
              {loading ? 'Please Wait...' : 'Update'}
            </button>
          </div>
        </div>
      } />
    </div>
  );
}

export default EditGalleryImage;
