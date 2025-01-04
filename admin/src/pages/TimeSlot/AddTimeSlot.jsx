import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddTimeSlot() {
    const [formData, setFormData] = useState({
        time: '',
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const payload = new FormData();
        payload.append('time', formData.time);
        try {
            await axios.post('https://api.blueaceindia.com/api/v1/create-timing', payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success('Timing Added Successfully')
        } catch (error) {
            toast.error('Error creating Timing:',error);
            setError('Failed to create Timing.');
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Breadcrumb heading={'Add Time'} subHeading={'All Time'} LastHeading={'Create Time'} backLink={'/vendors/all-time-slot'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>

                    <div className="col-md-12">
                        <label className='form-label' htmlFor="time">Time</label>
                        
                        <Input
                            placeholder="Enter Time (9AM - 12PM)"
                            name='time'
                            value={formData.time}
                            onChange={handleChange}
                            required={true}
                            id='time'
                        />
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
    )
}

export default AddTimeSlot
