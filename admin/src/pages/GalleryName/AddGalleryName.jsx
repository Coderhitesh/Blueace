import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddGalleryName() {
    const [formData, setFormData] = useState({
        name: '',
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
        payload.append('name', formData.name);
        // payload.append('answer', formData.answer);
        try {
            await axios.post('http://localhost:7987/api/v1/create-gallery-category-name', payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            // toast.success('Gallery Title Added Successfully');
            toast.success('Gallery Title Added Successfully')
        } catch (error) {
            toast.error('Error creating Gallery Title:');
            setError('Failed to create Gallery Title.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Breadcrumb heading={'Add Gallery Title'} subHeading={'All Gallery Title'} LastHeading={'Create Gallery Title'} backLink={'/home-layout/all-gallery-title'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>

                    <div className="col-md-12">
                        <label className='form-label' htmlFor="name">Title</label>
                        
                        <Input
                            placeholder="Enter Title"
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required={true}
                            id='name'
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

export default AddGalleryName
