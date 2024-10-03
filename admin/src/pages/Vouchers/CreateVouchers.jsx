import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import Toggle from '../../components/Forms/toggle';
import { useMutation } from '@tanstack/react-query';

const CreateVouchers = () => {
    const [formData, setFormData] = useState({
        CouponCode: '',
        MinimumAmount: '',
        HowMuchPercentageOf: '',
        Active: true
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Mutation for creating a voucher
    const createVoucherMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/Product/vouchers/create-vouchers`, data);
            return response.data;
        },
        onSuccess: () => {
            setSuccess('Voucher created successfully!');
            setFormData({
                CouponCode: '',
                MinimumAmount: '',
                HowMuchPercentageOf: '',
                Active: true
            });
            setError('');
        },
        onError: (error) => {
            setError(error.response?.data?.error || 'An error occurred while creating the voucher.');
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation for MinimumAmount
        if (parseFloat(formData.MinimumAmount) <= 249) {
            setError('Minimum Amount must be greater than 249.');
            setLoading(false);
            return;
        }

        createVoucherMutation.mutate(formData); // Trigger the mutation
        setLoading(false);
    };

    const handleToggle = () => {
        setFormData((prevData) => ({
            ...prevData,
            Active: !prevData.Active
        }));
    };

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Create Voucher'} subHeading={'Vouchers'} LastHeading={'Create Voucher'} />
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="error-message mt-4 text-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-md-6">
                        <label htmlFor="CouponCode">Coupon Code</label>
                        <Input
                            type="text"
                            name="CouponCode"
                            value={formData.CouponCode}
                            onChange={handleChange}
                            placeholder="Enter Coupon Code"
                            className="my-custom-class"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="MinimumAmount">Minimum Amount</label>
                        <Input
                            type="number"
                            name="MinimumAmount"
                            value={formData.MinimumAmount}
                            onChange={handleChange}
                            placeholder="Enter Minimum Amount"
                            className="my-custom-class"
                            required
                        />
                    </div>
                    <div className="col-md-6 mt-2">
                        <label htmlFor="HowMuchPercentageOf">Percentage Off</label>
                        <Input
                            type="number"
                            name="HowMuchPercentageOf"
                            value={formData.HowMuchPercentageOf}
                            onChange={handleChange}
                            placeholder="Enter Percentage"
                            className="my-custom-class"
                            required
                        />
                    </div>
                    <div className="col-md-6 mt-2">
                        <label htmlFor="Active">Status Of Voucher</label>
                        <Toggle
                            isActive={formData.Active}
                            onToggle={handleToggle}
                        />
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" disabled={loading || createVoucherMutation.isLoading}>
                            {loading || createVoucherMutation.isLoading ? 'Loading...' : 'Create Voucher'}
                        </button>
                    </div>
                </div>
            } />
        </div>
    );
};

export default CreateVouchers;
