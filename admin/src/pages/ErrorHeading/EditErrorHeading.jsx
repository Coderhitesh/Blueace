import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditErrorHeading = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',  // Updated to match the field in the model
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch the existing error code details when the component loads
    useEffect(() => {
        const fetchErrorCodeData = async () => {
            try {
                const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/get-single-error-heading/${id}`);
                const errorCode = data.data;
                setFormData({
                    title: errorCode.title,  // Updated to match the field in the model
                });
            } catch (error) {
                setError('Failed to load error code data.');
                console.error('Failed to load error code:', error);
            }
        };
        fetchErrorCodeData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const updatedData = {
            title: formData.title,  // Only updating the title field as per the new model
        };

        try {
            await axios.put(`https://api.blueaceindia.com/api/v1/update-error-heading/${id}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            toast.success('Error code updated successfully!');
        } catch (error) {
            console.error('Error updating error code:', error);
            setError('Failed to update error code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb
                heading={'Update Error Code'}
                subHeading={'All Error Codes'}
                LastHeading={'Update Error Code'}
                backLink={'/error-code-heading/all-error-code-heading'}
            />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups
                onSubmit={handleSubmit}
                Elements={
                    <div className="row">
                        {/* Title Input */}
                        <div className="col-md-12">
                            <label className="form-label" htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"  // Updated field name
                                value={formData.title}
                                onChange={handleChange}
                                required
                                id="title"  // Updated id
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="col-md-10 mx-auto mt-4">
                            <button
                                className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`}
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? 'Please Wait...' : 'Update'}
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default EditErrorHeading
