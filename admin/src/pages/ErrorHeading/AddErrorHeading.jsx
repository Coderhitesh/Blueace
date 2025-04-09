import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddErrorHeading = () => {
    const [formData, setFormData] = useState({
        title: '',       // For the title (used to match with the model)
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('https://api.blueaceindia.com/api/v1/create-error-heading', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.success) {
                toast.success('Error Code Heading Created Successfully');
                setFormData({ title: '' });
            } else {
                toast.error('Failed to create Error Code Heading');
            }
        } catch (error) {
            console.error('Error creating error code heading:', error);
            setError('Failed to create Error Code Heading.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb
                heading={'Create Error Code Heading'}
                subHeading={'All Error Code Headings'}
                LastHeading={'Create Error Code Heading'}
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
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter Title"
                                required
                                id="title"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="col-md-10 mx-auto mt-4">
                            <button
                                className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`}
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? 'Please Wait...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default AddErrorHeading;
