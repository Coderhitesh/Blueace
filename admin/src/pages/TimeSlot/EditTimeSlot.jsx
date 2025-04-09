import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/Forms/Input';

function EditTimeSlot() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        time: '',
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/get-single-timing/${id}`)
                const faq = data.data;
                // console.log('single data',faq)
                setFormData({
                    time: faq.time,
                })
            } catch (error) {
                setError('Failed to load previous slot time')
                console.log("Failed to load slot time:", error)
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
        payload.append('time', formData.time)

        try {
            await axios.put(`https://api.blueaceindia.com/api/v1/update-timing/${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success('Slot time updated successfully!')
            setError('')
        } catch (error) {
            console.error('Error updating Slot time:', error);
            setError('Failed to update Slot time');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Breadcrumb heading={'All Slot Time'} subHeading={'All Slot Time'} LastHeading={'Edit Slot Time'} backLink={'/vendors/all-time-slot'} />

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

export default EditTimeSlot
