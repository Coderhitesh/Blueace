import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditErrorCode = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        Heading: '',       // For the Heading (dropdown)
        code: '',          // For the code
        description: '',   // For the description
        note: ''           // For the notes
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [allHeading, setAllHeading] = useState([]);

    // Fetch the existing error code details when the component loads
    useEffect(() => {
        const fetchErrorCodeData = async () => {
            try {
                const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/get-single-error-code/${id}`);
                const errorCode = data.data;
                setFormData({
                    Heading: errorCode.Heading,  // Assuming Heading is an ID
                    code: errorCode.code,
                    description: errorCode.description,
                    note: errorCode.note.join(', ') // Join the notes array to display in a single field
                });
            } catch (error) {
                setError('Failed to load error code data.');
                console.error('Failed to load error code:', error);
            }
        };
        fetchErrorCodeData();
    }, [id]);

    // Fetch all headings for the dropdown
    const handleFetchHeading = async () => {
        try {
            const { data } = await axios.get('https://api.blueaceindia.com/api/v1/get-all-error-heading');
            setAllHeading(data.data);  // Set the allHeading data fetched from the API
        } catch (error) {
            console.log("Internal server error", error);
        }
    };

    useEffect(() => {
        handleFetchHeading();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formattedNote = formData.note.split(',').map(item => item.trim()); // Convert the notes to an array

        const updatedData = {
            Heading: formData.Heading,
            code: formData.code,
            description: formData.description,
            note: formattedNote
        };

        try {
            await axios.put(`https://api.blueaceindia.com/api/v1/update-error-code/${id}`, updatedData, {
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
                                value={formData.Heading._id}
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

                        {/* Code Input */}
                        <div className="col-md-12 mt-3">
                            <label className="form-label" htmlFor="code">Code</label>
                            <input
                                type="text"
                                className="form-control"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                id="code"
                            />
                        </div>

                        {/* Description Input */}
                        <div className="col-md-12 mt-3">
                            <label className="form-label" htmlFor="description">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                id="description"
                            />
                        </div>

                        {/* Note Input */}
                        <div className="col-md-12 mt-3">
                            <label className="form-label" htmlFor="note">Note (comma separated)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Enter Notes"
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
                                {loading ? 'Please Wait...' : 'Update'}
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default EditErrorCode;
