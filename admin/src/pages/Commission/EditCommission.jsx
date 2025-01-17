import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditCommission() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        percent: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCommissionData = async () => {
            try {
                const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/get-single-commission/${id}`);
                const commission = data.data;
                setFormData({
                    name: commission.name,
                    percent: commission.percent
                });
            } catch (error) {
                setError('Failed to load commission data.');
                console.error('Failed to load commission:', error);
            }
        };
        fetchCommissionData();
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
            await axios.put(`https://api.blueaceindia.com/api/v1/update-commission/${id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            toast.success('Commission updated successfully!');
        } catch (error) {
            console.error('Error updating commission:', error);
            setError('Failed to update commission.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb
                heading={'Update Commission'}
                subHeading={'All Commissions'}
                LastHeading={'Update Commission'}
                backLink={'/commission/all-commission'}
            />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups
                onSubmit={handleSubmit}
                Elements={
                    <div className="row">
                        {/* Name Dropdown */}
                        <div className="col-md-12">
                            <label className="form-label" htmlFor="name">Select Name</label>
                            <select
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                id="name"
                            >
                                <option value="">-- Select --</option>
                                <option value="Employee">Employee</option>
                                <option value="Vendor">Vendor</option>
                            </select>
                        </div>

                        {/* Percent Input */}
                        <div className="col-md-12 mt-3">
                            <label className="form-label" htmlFor="percent">Percentage</label>
                            <input
                                type="number"
                                className="form-control"
                                name="percent"
                                value={formData.percent}
                                onChange={handleChange}
                                placeholder="Enter Percentage"
                                required
                                id="percent"
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
}

export default EditCommission;
