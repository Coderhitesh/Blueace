import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/Forms/Input';

function EditGalleryName() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`https://api.blueace.co.in/api/v1/get-single-gallery-category-name/${id}`)
                const faq = data.data;
                setFormData({
                    name: faq.name,
                })
            } catch (error) {
                setError('Failed to load previous Gallery title')
                console.log("Failed to load gallery title:", error)
            }
        }
        fetchData();
    }, [id])

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

        const payload = new FormData()
        payload.append('name', formData.name)

        try {
            await axios.put(`https://api.blueace.co.in/api/v1/update-gallery-category-name/${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success('Gallery Title updated successfully!')
            setError('')
        } catch (error) {
            console.error('Error updating Gallery Title:', error);
            setError('Failed to update Gallery Title');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Breadcrumb heading={'Gallery Title'} subHeading={'All Gallery Title'} LastHeading={'Edit Gallery Title'} backLink={'/home-layout/all-gallery-title'} />

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

                    <div className='col-md-10 mx-auto mt-4'>
                        <button className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`} disabled={loading} type='submit'>
                            {loading ? 'Please Wait...' : 'Update'}
                        </button>
                    </div>
                </div>
            } />
        </div >
    )
}

export default EditGalleryName
