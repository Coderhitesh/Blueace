import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddCorporateUser() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        FullName: '',
        ContactNumber: '',
        Email: '',
        Password: '',
        City: '',
        PinCode: '',
        HouseNo: '',
        Street: '',
        NearByLandMark: '',
        UserType: 'Corporate',
        RangeWhereYouWantService: [{
            location: { type: 'Point', coordinates: [] }
        }]
    });
    const [latitude, setLatitude] = useState(''); // For manual entry of latitude
    const [longitude, setLongitude] = useState(''); // For manual entry of longitude

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateFields = () => {
        const { companyName, Street, NearByLandMark, Email, FullName, ContactNumber, City, PinCode, HouseNo, Password } = formData;

        if (!companyName || !Street || !NearByLandMark || !Email || !FullName || !ContactNumber || !City || !PinCode || !HouseNo || !Password) {
            toast.error("Please fill out all required fields");
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email)) {
            toast.error("Invalid email format");
            return false;
        }

        // Password validation (length check)
        if (Password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }

        return true;
    };

    useEffect(()=>{
        setFormData((prevData) => ({
            ...prevData,
            RangeWhereYouWantService: [{
                location: {
                    type: 'Point',
                    coordinates: [12.000, 78.789] // Default coordinates
                }
            }]
        }));
    },[])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateFields()) return;
        // console.log("lon", longitude)
        // console.log("let", latitude)
        

        // Ensure RangeWhereYouWantService is initialized with the necessary structure
        // if (
        //     !formData.RangeWhereYouWantService ||
        //     !formData.RangeWhereYouWantService[0]?.location?.coordinates ||
        //     formData.RangeWhereYouWantService[0].location.coordinates.length === 0
        // ) {
        //     setFormData((prevData) => ({
        //         ...prevData,
        //         RangeWhereYouWantService: [{
        //             location: {
        //                 type: 'Point',
        //                 coordinates: [12.000, 78.789] // Default coordinates
        //             }
        //         }]
        //     }));
        // } 

        // if(formData.RangeWhereYouWantService[0].location.coordinates.length){
        //     setFormData((prevData) => ({
        //         ...prevData,
        //         RangeWhereYouWantService: [{
        //             location: {
        //                 type: 'Point',
        //                 coordinates: [12.000, 78.789] // Provided coordinates
        //             }
        //         }]
        //     }));
        // }



        setLoading(true);

        try {
            const res = await axios.post('https://www.api.blueaceindia.com/api/v1/Create-User', formData);
            toast.success('Corporate Registration Successful!');
            // Uncomment this line if you want to redirect after success
            // window.location.href = '/corporate-user/all-corporate-user';
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.msg || 'An error occurred');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Breadcrumb heading={'Add Corporate User'} subHeading={'All Corporate user'} LastHeading={'Create Corporate user'} backLink={'/corporate-user/all-corporate-user'} />
            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.companyName} name='companyName' onChange={handleChange} className="form-control rounded" placeholder="Name of Company*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="email" value={formData.Email} name='Email' onChange={handleChange} className="form-control rounded" placeholder="Email*" />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.FullName} name='FullName' onChange={handleChange} className="form-control rounded" placeholder="Name*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.ContactNumber} name='ContactNumber' onChange={handleChange} className="form-control rounded" placeholder="Contact Number*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.HouseNo} name='HouseNo' onChange={handleChange} className="form-control rounded" placeholder="House No*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.Street} name='Street' onChange={handleChange} className="form-control rounded" placeholder="Street*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.City} name='City' onChange={handleChange} className="form-control rounded" placeholder="City*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.NearByLandMark} name='NearByLandMark' onChange={handleChange} className="form-control rounded" placeholder="Near By LandMark*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={formData.PinCode} name='PinCode' onChange={handleChange} className="form-control rounded" placeholder="Pin Code*" required />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="form-control rounded" placeholder="Enter Latitude" />
                    </div>
                    <div className="col-lg-6 mt-3">
                        <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="form-control rounded" placeholder="Enter Longitude" />
                    </div>

                    <div className="col-lg-6 mt-3">
                        <input type="password" value={formData.Password} name='Password' onChange={handleChange} className="form-control rounded" placeholder="Password*" required />
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

export default AddCorporateUser
