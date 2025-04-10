import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddErrorCode = () => {
    const [formData, setFormData] = useState({
        Heading: '',       // For the Heading (dropdown)
        code: '',          // For the code
        description: '',   // For the description
        note: '',          // For the notes
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [allHeading, setAllHeading] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFetchHeading = async () => {
        try {
            const { data } = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-error-heading');
            setAllHeading(data.data);  // Set the allHeading data fetched from the API
        } catch (error) {
            console.log("Internal server error", error);
        }
    };

    useEffect(() => {
        handleFetchHeading();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('https://www.api.blueaceindia.com/api/v1/create-error-code', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.success) {
                toast.success('Error Code Created Successfully');
                // setFormData({
                //     Heading: '',
                //     code: '',
                //     description: '',
                //     note: '',
                // });
            } else {
                toast.error('Failed to create Error Code');
            }
        } catch (error) {
            console.error('Error creating error code:', error);
            setError('Failed to create Error Code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb
                heading={'Create Error Code'}
                subHeading={'All Error Codes'}
                LastHeading={'Create Error Code'}
                backLink={'/Error-Code/all-error'}
            />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups
                onSubmit={handleSubmit}
                Elements={
                    <div className="row">
                        {/* Heading Dropdown */}
                        <div className="col-md-12">
                            <label className="form-label" htmlFor="Heading">Heading</label>
                            <select
                                className="form-control"
                                name="Heading"
                                value={formData.Heading}
                                onChange={handleChange}
                                required
                                id="Heading"
                            >
                                <option value="">Select Heading</option>
                                {allHeading.map((heading, index) => (
                                    <option key={index} value={heading._id}>
                                        {heading.title} {/* Assuming `title` is the field in the response */}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Error Code Input */}
                        <div className="col-md-12 mt-3">
                            <label className="form-label" htmlFor="code">Error Code</label>
                            <input
                                type="text"
                                className="form-control"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="Enter Error Code"
                                required
                                id="code"
                            />
                        </div>

                        {/* Description Input */}
                        <div className="col-md-12 mt-3">
                            <label className="form-label" htmlFor="description">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter Description"
                                required
                                id="description"
                                rows="3"
                            />
                        </div>

                        {/* Notes Input */}
                        <div className="col-md-12 mt-3">
                            <label className="form-label" htmlFor="note">Notes (Comma Separated)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Enter Notes (Comma Separated)"
                                id="note"
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

export default AddErrorCode;
