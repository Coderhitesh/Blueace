import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditMarquee() {
    const { id } = useParams()
    const [formData, setFormData] = useState({
        text: ''
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSingleData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:7987/api/v1/get-single-marquee/${id}`)
                const res = data.data;
                setFormData({
                    text: res.text
                })
            } catch (error) {
                setError('Failed to load previous Marquee data')
                console.log("Failed to load Marquee:", error)
            }
        }
        fetchSingleData();
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const payload = new FormData();
        payload.append('text', formData.text);
        try {
            await axios.put(`http://localhost:7987/api/v1/update-marquee/${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success('Marquee updated successfully!')
            setError('')
        } catch (error) {
            console.error('Error updating Marquee Content:', error);
            setError('Failed to update Marquee Content');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Breadcrumb heading={'Update Marquee'} subHeading={'All Marquee'} LastHeading={'Update Marquee'} backLink={'/home-layout/all-marquee'} />

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

export default EditMarquee
