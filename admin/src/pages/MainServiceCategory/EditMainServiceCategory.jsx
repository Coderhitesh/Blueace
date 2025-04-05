import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditMainServiceCategory() {
    const { id } = useParams();
    const [formData,setFormData] = useState({
        name: '',
        metaTitle: '',
        metaDescription: '',
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetchData = async () => {
        try {
            const {data} = await axios.get(`http://localhost:7987/api/v1/get-single-service-main-category/${id}`) 
            const category = data.data
            setFormData({
                name: category.name,
                metaTitle: category.metaTitle,
                metaDescription: category.metaDescription
            })
        } catch (error) {
            console.error('Faild to load service Category:', error.response ? error.response.data : error.message);
            setError('Failed to load service category');
        }
    }
    useEffect(()=>{
        handleFetchData();
    },[id])

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('metaTitle', formData.metaTitle);
        payload.append('metaDescription', formData.metaDescription);
        try {
            await axios.put(`http://localhost:7987/api/v1/update-service-main-category/${id}`,payload,{
                headers: {
                    'Content-Type': 'application/json'
                    }
            })
            toast.success('Updated Successfully!')
        } catch (error) {
            console.error('Error updating main service Category:', error.response ? error.response.data : error.message);
            setError('Failed to updating service Category');
        }finally{
            setLoading(false);
        }
    }

  return (
    <div>
            <Breadcrumb heading={'Service'} subHeading={'Sub Category'} LastHeading={'Edit Sub Category'} backLink={'/service/main-category'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                   
                    <div className="col-md-6">
                        <label htmlFor="name">Category</label>
                        <Input
                            type='text'
                            placeholder='Enter category'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>

                    <div className="col-md-12 mt-3">
                        <label htmlFor="metaTitle" className='form-label'>Meta Title</label>
                        <textarea
                            class="form-control"
                            rows="5"
                            cols="5"
                            placeholder="Enter Meta Title"
                            name='metaTitle'
                            value={formData.metaTitle}
                            onChange={handleChange}
                            required={true}
                            id='metaTitle'
                        ></textarea>
                    </div>
                    <div className="col-md-12 mt-3">
                        <label htmlFor="metaDescription" className='form-label'>Meta Description</label>
                        <textarea
                            class="form-control"
                            rows="5"
                            cols="5"
                            placeholder="Enter Meta Description"
                            name='metaDescription'
                            value={formData.metaDescription}
                            onChange={handleChange}
                            required={true}
                            id='metaDescription'
                        ></textarea>
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

export default EditMainServiceCategory
