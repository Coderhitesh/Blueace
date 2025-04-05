import React, { useState } from 'react';
import axios from 'axios'
import toast from 'react-hot-toast';
const EstimatedBudget = () => {
    const url = new URLSearchParams(window.location.search);
    const orderId = url.get('OrderId');
    const vendorId = url.get('vendor');

    const [formData, setFormData] = useState({
        orderId: orderId || '',
        vendor: vendorId || '',
        EstimatedTotalPrice: 0,
        overallDiscount: 0,
        Items: [{ name: '', quantity: 1, price: 0, Discount: 0 }]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.Items];
        newItems[index][name] = value;
        setFormData({ ...formData, Items: newItems });
        calculateTotal(newItems);
    };

    const handleAddItems = () => {
        setFormData({
            ...formData,
            Items: [...formData.Items, { name: '', quantity: 1, price: 0, Discount: 0 }]
        });
    };

    const handleRemoveItems = (index) => {
        console.log(`Removing item at index: ${index}`);
        const newItems = formData.Items.filter((_, i) => i !== index);
        setFormData((prevState) => ({
            ...prevState,
            Items: newItems
        }));
        calculateTotal(newItems);
    };

    const calculateTotal = (items) => {
        let total = items.reduce((acc, item) => {
            const discount = (item.price * item.quantity * (item.Discount / 100)) || 0;
            return acc + (item.price * item.quantity - discount);
        }, 0);

        const gst = (total * 0.18);
        const estimatedTotalPrice = parseFloat((total + gst).toFixed(2));

        setFormData((prevState) => ({
            ...prevState,
            EstimatedTotalPrice: estimatedTotalPrice
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.orderId || !formData.vendor) {
            setError('Order ID and Vendor ID are required.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:7987/api/v1/make-Estimated-bills', formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 201) throw new Error('Failed to submit the estimated budget.');
            toast.success("Estimated budget submitted successfully")
            window.location.href="/vendor-dashboard#Active-Order"
        } catch (error) {
            console.log(error)
            toast.success(error.response.data.message || "Estimated budget failed to submitted Please retry")
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='container mx-auto mt-5 py-5 px-2'>
            <h2>Make An Estimated Budget for Order ID: {orderId}</h2>
            <hr />
            {error && <div className='alert alert-danger'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <h4 className='mt-4'>Items</h4>
                {formData.Items.map((item, index) => (
                    <div key={index} className='row mb-3'>
                        <div className='col-12 col-md-3'>
                            <div className='form-group'>
                                <label htmlFor={`item-name-${index}`}>Item Name</label>
                                <input
                                    type='text'
                                    name='name'
                                    id={`item-name-${index}`}
                                    value={item.name}
                                    onChange={(e) => handleChange(index, e)}
                                    placeholder='Item Name'
                                    className='form-control'
                                    required
                                />
                            </div>
                        </div>
                        <div className='col-12 col-md-2'>
                            <div className='form-group'>
                                <label htmlFor={`item-quantity-${index}`}>Quantity</label>
                                <input
                                    type='number'
                                    name='quantity'
                                    id={`item-quantity-${index}`}
                                    value={item.quantity}
                                    onChange={(e) => handleChange(index, e)}
                                    placeholder='Quantity'
                                    className='form-control'
                                    required
                                    min='0'
                                />
                            </div>
                        </div>
                        <div className='col-12 col-md-3'>
                            <div className='form-group'>
                                <label htmlFor={`item-price-${index}`}>Price</label>
                                <input
                                    type='number'
                                    name='price'
                                    id={`item-price-${index}`}
                                    value={item.price}
                                    onChange={(e) => handleChange(index, e)}
                                    placeholder='Price'
                                    className='form-control'
                                    required
                                    min='0'
                                />
                            </div>
                        </div>
                        <div className='col-12 col-md-2'>
                            <div className='form-group'>
                                <label htmlFor={`item-discount-${index}`}>Discount (%)</label>
                                <input
                                    type='number'
                                    name='Discount'
                                    id={`item-discount-${index}`}
                                    value={item.Discount}
                                    onChange={(e) => handleChange(index, e)}
                                    placeholder='Discount (%)'
                                    className='form-control'
                                    min='0'
                                    max='100'
                                />
                            </div>
                        </div>
                        <div className='col-12 col-md-2'>
                            <button
                                type='button'
                                className='btn btn-danger w-100 mt-4 mt-md-0'
                                onClick={() => handleRemoveItems(index)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                <button type='button' className='btn btn-secondary mt-2' onClick={handleAddItems}>
                    Add Item
                </button>

                <div className='mt-4'>
                    <h5>GST : 18 %</h5>
                    <h5>Total Estimated Price (including GST): Rs {formData.EstimatedTotalPrice.toFixed(2)}</h5>
                </div>

                <button type='submit' className='btn btn-primary mt-3 w-100' disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Estimated Budget'}
                </button>
            </form>
        </div>

    );
};

export default EstimatedBudget;
