import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditMemberShipPlan() {
    const { id } = useParams(); // Get membership plan ID from URL
    const [membershipPlan, setMembershipPlan] = useState({});
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [offers, setOffers] = useState(['']); // For multiple offers
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch existing membership plan data
    const fetchExistingData = async () => {
        try {
            const res = await axios.get(`http://localhost:7987/api/v1/get-single-membership-plan/${id}`);
            const exist = res.data.data;
            setMembershipPlan(exist);
            setName(exist.name || '');
            setPrice(exist.price || '');
            setOffers(exist.offer.map(o => o.name) || ['']); // Populate offers
        } catch (error) {
            console.log(error);
            setError('Failed to fetch membership plan data');
        }
    };

    useEffect(() => {
        fetchExistingData();
    }, [id]);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare the data
        const membershipData = {
            name,
            price: Number(price || 0), // Ensure price is a number
            offer: offers.map((offer) => ({ name: offer })) // Map offer array
        };

        try {
            const response = await axios.put(`http://localhost:7987/api/v1/update-membership-plan/${id}`, membershipData);
            toast.success('Membership plan updated successfully');
        } catch (error) {
            console.error('Failed to update membership plan:', error);
            toast.error('Error updating membership plan');
        } finally {
            setLoading(false);
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
            <Breadcrumb heading={'Edit Membership Plan'} subHeading={'Vendor'} LastHeading={'Edit Membership Plan'} backLink={'/vendors/all-membership-plan'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-md-6">
                        <label className='form-label' htmlFor="text">Plan Name:</label>
                        <input
                            type='text'
                            placeholder="Enter Plan Name"
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
                            placeholder="Enter Price"
                            name='price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required={true}
                        ></input>
                    </div>

                    <div className="col-md-12 mt-3">
                        <label className='form-label' htmlFor="price">Plan Offers:</label>
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
                            {loading ? 'Please Wait...' : 'Update Plan'}
                        </button>
                    </div>
                </div>
            } />
        </div>
    );
}

export default EditMemberShipPlan;
