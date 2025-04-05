import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

function AddScript() {
  const [formData, setFormData] = useState({
    headScript: '',
    bodyScript: '',
    footerScript: ''
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
      await axios.post(`http://localhost:7987/api/v1/create-script`, formData)
      toast.success('Script Added Successfully')
    } catch (error) {
      console.error('Error creating script:', error);
      setError('Failed to create script.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Breadcrumb heading={'Create Script'} subHeading={'All Script'} LastHeading={'Create Script'} backLink={'/all-script'} />

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

export default AddScript
