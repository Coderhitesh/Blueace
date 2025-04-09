import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditFAQContent() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/get-single-faq-content/${id}`)
                const faq = data.data;
                setFormData({
                    question: faq.question,
                    answer: faq.answer
                })
            } catch (error) {
                setError('Failed to load previous faq data')
                console.log("Failed to load faq:", error)
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
        payload.append('question', formData.question)
        payload.append('answer', formData.answer)

        try {
            await axios.put(`https://api.blueaceindia.com/api/v1/update-faq-content/${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success('Faq updated successfully!')
            setError('')
        } catch (error) {
            console.error('Error updating FAQ Content:', error);
            setError('Failed to update FAQ Content');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Breadcrumb heading={'FAQ Content'} subHeading={'All FAQ Content'} LastHeading={'Edit FAQ Content'} backLink={'/home-layout/all-faq-content'} />

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

export default EditFAQContent
