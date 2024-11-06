import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddCorporateOrder() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userId:'',
        serviceId:'',
        vendorAlloted:'',
        OrderStatus:'Service Done',
        VendorAllotedStatus:true,
        serviceType:'',
        orderTime:'',
        RangeWhereYouWantService: [{
            location: { type: 'Point', coordinates: [] }
        }]
    });
    const [latitude, setLatitude] = useState(''); // For manual entry of latitude
    const [longitude, setLongitude] = useState(''); // For manual entry of longitude

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(`Selected ${name}: ${value}`);
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        const payload = new FormData();
        payload.append('userId', formData.userId);
        payload.append('serviceId', formData.serviceId);
        payload.append('orderTime', formData.orderTime);

        if (formData.panImage) payload.append('panImage', formData.panImage);
        if (formData.adharImage) payload.append('adharImage', formData.adharImage);
        if (formData.gstImage) payload.append('gstImage', formData.gstImage);


        payload.append('RangeWhereYouWantService[0][location][type]', 'Point');
        payload.append('RangeWhereYouWantService[0][location][coordinates][0]', longitude || 40.7128);
        payload.append('RangeWhereYouWantService[0][location][coordinates][1]', latitude || 74.0060);

        try {
            const res = await axios.post('https://api.blueace.co.in/api/v1/make-order', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Employ Registration Successful!');

        } catch (error) {
            console.log(error)
            if (error.response) {
                toast.error(error.response.data.message || 'An error occurred');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb heading={'Make Order'} subHeading={'Corporate Order'} LastHeading={'Make Order'} backLink={'/corporate-order/add-corporate-order'} />

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="form-control rounded" placeholder="Enter Latitude" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="form-control rounded" placeholder="Enter Longitude" required />
                    </div>
                    {/* <div className="col-md-6 mt-3">
                        <select
                            className="form-select"
                            name='Role'
                            id="Role"
                            value={formData.Role}
                            onChange={handleChange}
                        >
                            <option value="">Select Role</option>
                            <option value='vendor'>Vendor</option>
                            <option value='employ'>Employ</option>
                        </select>
                    </div> */}
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

export default AddCorporateOrder
