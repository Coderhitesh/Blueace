import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddFAQContent() {
    const [formData, setFormData] = useState({
        question: '',
        answer: ''
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
        payload.append('question', formData.question);
        payload.append('answer', formData.answer);
        try {
            await axios.post('http://localhost:7000/api/v1/create-faq-content', payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success('FAQ Content Added Successfully');
        } catch (error) {
            console.error('Error creating FAQ content:', error);
            setError('Failed to create faq Content.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Breadcrumb heading={'FAQ Content'} subHeading={'All FAQ Content'} LastHeading={'Create FAQ'} backLink={'/home-layout/all-faq-content'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>

                    <div className="col-md-12">
                        <label className='form-label' htmlFor="question">Question</label>
                        <textarea
                            class="form-control"
                            rows="5"
                            cols="5"
                            placeholder="Enter Question"
                            name='question'
                            value={formData.question}
                            onChange={handleChange}
                            required={true}
                            id='question'
                        ></textarea>
                    </div>

                    <div className="col-md-12 mt-4">
                        <label className='form-label' htmlFor="Answer">Answer</label>
                        <textarea
                            class="form-control"
                            rows="5"
                            cols="5"
                            placeholder="Enter Answer"
                            name='answer'
                            value={formData.answer}
                            onChange={handleChange}
                            required={true}
                            id='Answer'
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

export default AddFAQContent
