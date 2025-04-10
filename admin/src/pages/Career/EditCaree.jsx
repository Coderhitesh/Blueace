import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditCaree() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        points: '',
        noOfVacancy:''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCareerData = async () => {
            try {
                const { data } = await axios.get(`https://www.api.blueaceindia.com/api/v1/careers/${id}`);
                const career = data.data;

                setFormData({
                    title: career.title,
                    description: career.description,
                    points: career.points.join(', '),
                    noOfVacancy: career.noOfVacancy
                });
            } catch (error) {
                setError('Failed to load career data.');
                console.error('Failed to load career:', error);
            }
        };
        fetchCareerData();
    }, [id]);

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
        try {
            const processedData = {
                ...formData,
                points: formData.points.split(',').map(point => point.trim())
            };

            await axios.put(`https://www.api.blueaceindia.com/api/v1/careers/${id}`, processedData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            toast.success('Career updated successfully!');
        } catch (error) {
            console.error('Error updating career:', error);
            setError('Failed to update career.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb
                heading={'Update Career'}
                subHeading={'All Careers'}
                LastHeading={'Update Career'}
                backLink={'/career/all-career'}
            />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups
                onSubmit={handleSubmit}
                Elements={
                    <div className="row">
                        {/* Title Input */}
                        <div className="col-md-12">
                            <label className="form-label" htmlFor="title">Job Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter Job Title"
                                required
                                id="title"
                            />
                        </div>

                        <div className="col-md-12 mt-3">
                            <label className="form-label" htmlFor="noOfVacancy">No. of Vacancy</label>
                            <input
                                type="Number"
                                className="form-control"
                                name="noOfVacancy"
                                value={formData.noOfVacancy}
                                onChange={handleChange}
                                placeholder="No. of Vacancy"
                                required
                                id="noOfVacancy"
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
                                placeholder="Enter Job Description"
                                required
                                id="description"
                                rows="4"
                            />
                        </div>

                        {/* Points Input */}
                        <div className="col-md-12 mt-3">
                            <label className="form-label" htmlFor="points">Key Points</label>
                            <input
                                type="text"
                                className="form-control"
                                name="points"
                                value={formData.points}
                                onChange={handleChange}
                                placeholder="Enter Key Points (comma-separated)"
                                required
                                id="points"
                            />
                            <small className="form-text text-muted">Enter multiple points separated by commas.</small>
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
}

export default EditCaree;
