import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddCommission() {
    const [formData, setFormData] = useState({
        name: '',   // For the dropdown select
        percent: '' // For the percentage input
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
            await axios.post(`https://www.api.blueaceindia.com/api/v1/create-commission`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Commission Created Successfully');
            setFormData({
                name: '',
                percent: ''
            });
        } catch (error) {
            console.error('Error creating commission:', error);
            setError('Failed to create commission.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb
                heading={'Create Commission'}
                subHeading={'All Commissions'}
                LastHeading={'Create Commission'}
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
                                {loading ? 'Please Wait...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    );
}

export default AddCommission;
