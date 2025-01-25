import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

function AddMarquee() {
    const [formData, setFormData] = useState({
        text: ''
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
        payload.append('text', formData.text);
        try {
            await axios.post(`https://www.api.blueaceindia.com/api/v1/create-marquee`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success('Marquee Added Successfully')
        } catch (error) {
            console.error('Error creating marquee:', error);
            setError('Failed to create marquee.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Breadcrumb heading={'Create Marquee'} subHeading={'All Marquee'} LastHeading={'Create Marquee'} backLink={'/home-layout/all-marquee'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>

                    <div className="col-md-12">
                        <label className='form-label' htmlFor="text">Marquee</label>
                        <textarea
                            class="form-control"
                            rows="5"
                            cols="5"
                            placeholder="Enter Marquee"
                            name='text'
                            value={formData.text}
                            onChange={handleChange}
                            required={true}
                            id='text'
                        ></textarea>
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

export default AddMarquee
