import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditScript() {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    headScript: '',
    bodyScript: '',
    footerScript: '',
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(`https://www.api.blueaceindia.com/api/v1/get-single-script/${id}`)
        const res = data.data;
        setFormData({
          headScript: res.headScript,
          bodyScript: res.bodyScript,
          footerScript: res.footerScript
        })
      } catch (error) {
        setError('Failed to load previous Script data')
        console.log("Failed to load Script:", error)
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
    try {
      await axios.put(`https://www.api.blueaceindia.com/api/v1/update-script/${id}`, formData)
      toast.success('Script updated successfully!')
      setError('')
    } catch (error) {
      console.error('Error updating Script Content:', error);
      setError('Failed to update Script Content');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Breadcrumb heading={'Update Script'} subHeading={'All Script'} LastHeading={'Update Script'} backLink={'/all-script'} />

      {error && <div className="alert alert-danger">{error}</div>}

      <FormGroups onSubmit={handleSubmit} Elements={
        <div className='row'>

          <div className="col-lg-6 mt-3">
            <label className='form-label' htmlFor="headScript">Head Script</label>
            <input
              type="text"
              className="form-control rounded"
              placeholder="Enter Head Script"
              name='headScript'
              value={formData.headScript}
              onChange={handleChange}
              required={true}
              id='headScript'
            />
          </div>
          <div className="col-lg-6 mt-3">
            <label className='form-label' htmlFor="bodyScript">Body Script</label>
            <input
              type="text"
              className="form-control rounded"
              placeholder="Enter Body Script"
              name='bodyScript'
              value={formData.bodyScript}
              onChange={handleChange}
              required={true}
              id='bodyScript'
            />
          </div>
          <div className="col-lg-6 mt-3">
            <label className='form-label' htmlFor="footerScript">Footer Script</label>
            <input
              type="text"
              className="form-control rounded"
              placeholder="Enter Footer Script"
              name='footerScript'
              value={formData.footerScript}
              onChange={handleChange}
              required={true}
              id='footerScript'
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

export default EditScript
