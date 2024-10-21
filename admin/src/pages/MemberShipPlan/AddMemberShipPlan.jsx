import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

function AddMemberShipPlan() {
    // State for form fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [offers, setOffers] = useState(['']); // For multiple offers
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data
        const membershipData = {
            name,
            price: Number(price || 0), // Ensure price is a number
            offer: offers.map((offer) => ({ name: offer })) // Map offer array
        };

        try {
            const response = await axios.post('https://api.blueace.co.in/api/v1/create-membership-plan', membershipData);
            toast.success('Membership plan created successfully')
        } catch (error) {
            console.error('Failed to create membership plan:', error);
            toast.error('Error creating membership plan')
        }
    };

    // Handle offer field change
    const handleOfferChange = (index, event) => {
        const newOffers = [...offers];
        newOffers[index] = event.target.value;
        setOffers(newOffers);
    };

    // Add new offer input field
    const addOfferField = () => {
        setOffers([...offers, '']);
    };

    // Remove offer input field
    const removeOfferField = (index) => {
        const newOffers = offers.filter((_, i) => i !== index);
        setOffers(newOffers);
    };
    return (
        <div>
            <Breadcrumb heading={'Create Membership Plan'} subHeading={'Vendor'} LastHeading={'Create Membership Plan'} backLink={'/vendors/all-membership-plan'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>

                    <div className="col-md-6">
                        <label className='form-label' htmlFor="text">Plan Name:</label>
                        <input
                            type='text'
                            placeholder="Enter Title"
                            name='text'
                            className='form-control'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={true}
                        ></input>
                    </div>

                    <div className="col-md-6">
                        <label className='form-label' htmlFor="price">Plan Price:</label>
                        <input
                            type='number'
                            className='form-control'
                            placeholder="Enter Title"
                            name='price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required={true}
                        ></input>
                    </div>

                    <div className="col-md-12 mt-3">
                        <label className='form-label' htmlFor="price">Plan Price:</label>
                        {offers.map((offer, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={offer}
                                    onChange={(e) => handleOfferChange(index, e)}
                                    placeholder={`Offer ${index + 1}`}
                                    required
                                />
                                {offers.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-danger ml-2"
                                        onClick={() => removeOfferField(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-secondary mb-2"
                            onClick={addOfferField}
                        >
                            Add Offer
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className='col-md-10 mx-auto mt-4'>
                        <button className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`} disabled={loading} type='submit'>
                            {loading ? 'Please Wait...' : 'Submit'}
                        </button>
                    </div>
                </div>
            } />
        </div>
    );

};

export default AddMemberShipPlan
