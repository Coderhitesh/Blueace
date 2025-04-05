import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditFAQBanner() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        bannerImage: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreviews, setImagePreviews] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:7987/api/v1/get-single-faq-banner/${id}`)
                const res = data.data;
                setImagePreviews(res.bannerImage?.url || null)
            } catch (error) {
                setError('Failed to load banner image')
                console.error(error)
            }
        };
        fetchData();
    }, [id])

    const handleServiceImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                bannerImage: file
            }));
            setImagePreviews(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        if (formData.bannerImage) {
            payload.append('bannerImage', formData.bannerImage);
        } else {
            setError('Please select an image');
            setLoading(false);
            return;
        }

        try {
            await axios.put(`http://localhost:7987/api/v1/update-faq-banner/${id}`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Banner Updated successfully!')
        } catch (error) {
            console.error('Error in updating banner image:', error);
            setError('Failed to update banner image.');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <Breadcrumb heading={'Home Layout'} subHeading={'All Offer Banner'} LastHeading={'Edit Offer Banner'} backLink={'/home-layout/all-offer-banner'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>

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
                                name="bannerImage"
                                multiple
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
        </div >
    )
}

export default EditFAQBanner
