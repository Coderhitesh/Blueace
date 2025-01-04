import React, { useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import toast from 'react-hot-toast';

function AddMainServiceCategory() {
    const [formData, setFormData] = useState({ 
        name: '',
        metaTitle: '',
        metaDescription: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const payload = {
            name: formData.name.trim(), // Trim spaces
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription
        };
    
        // console.log('Payload before sending:', payload); // Check payload content
    
        try {
            // console.log('Sending request...');
            const res = await axios.post('https://api.blueaceindia.com/api/v1/create-service-main-category', payload, {
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
            });
            // console.log('Response:', res.data); // Log the response data
            toast.success('Category Created Successfully!')
            setFormData({ name: '' }); // Reset form
            setError(''); // Clear any previous error messages
        } catch (error) {
            console.error('Error creating main service Category:', error.response ? error.response.data : error.message);
            setError('Failed to create service Category');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <Breadcrumb heading={'Category'} subHeading={'Service'} LastHeading={'Create Category'} backLink={'/service/main-category'} />
            {error && <div className="alert alert-danger">{error}</div>}
            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-md-12">
                        <label htmlFor="name" className='form-label'>Category</label>
                        <Input
                            type='text'
                            placeholder='Enter Category Name'
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
                            {loading ? 'Please Wait...' : 'Submit'}
                        </button>
                    </div>
                </div>
            } />
        </div>
    );
}

export default AddMainServiceCategory;
