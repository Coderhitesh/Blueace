import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function Registration() {
  // State to store form inputs and location
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    ContactNumber: '',
    Password: '',
    City: '',
    PinCode: '',
    HouseNo: '',
    Street: '',
    NearByLandMark: '',
    RangeWhereYouWantService: [{
      location: {
        type: 'Point',
        coordinates: [] // Will be updated with [longitude, latitude]
      }
    }]
  });

  const [location, setLocation] = useState({
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get user location (latitude and longitude)
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          toast.error('Unable to retrieve your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this system');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    if (!formData.FullName || !formData.Email || !formData.ContactNumber || !formData.Password) {
      toast.error('Please fill all required fields');
      return;
    }

    // Update formData with location coordinates before submitting
    const updatedFormData = {
      ...formData,
      RangeWhereYouWantService: [{
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude] // Coordinates as [longitude, latitude]
        }
      }]
    };

    try {
      // Send data to the backend
      const res = await axios.post('https://api.blueace.co.in/api/v1/Create-User', updatedFormData);

      window.location.href = '/'

      if (res.data.success) {
        toast.success('User registered successfully');
        setFormData({
          FullName: '',
          Email: '',
          ContactNumber: '',
          Password: '',
          City: '',
          PinCode: '',
          HouseNo: '',
          Street: '',
          NearByLandMark: '',
          RangeWhereYouWantService: [{
            location: {
              type: 'Point',
              coordinates: []
            }
          }]
        });

        setLocation({
          latitude: '',
          longitude: ''
        });
      }
    } catch (err) {
      console.log(err)
      if (err.response) {
        toast.error(err.response.data.msg || 'An error occurred');
    } else {
        // Fallback for unexpected errors
        toast.error('Something went wrong. Please try again.');
    }
    } finally {
      setLoading(false)
    }
  };

  // Fetch the location when the component mounts
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      <Toaster />
      {/* ======================= Registration Detail ======================== */}
      <section className="gray">
        <div className="container">
          <div className="row align-items-start justify-content-center">
            <div className="col-xl-6 col-lg-8 col-md-12">
              <div className="signup-screen-wrap">
                <div className="signup-screen-single light">
                  <div className="text-center mb-4">
                    <h4 className="m-0 ft-medium">Create An Account</h4>
                  </div>

                  <form className="submit-form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control rounded"
                            placeholder="Enter Your Name"
                            name="FullName"
                            value={formData.FullName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control rounded"
                            placeholder="Enter Your Email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control rounded"
                            placeholder="Enter Your Phone Number"
                            name="ContactNumber"
                            value={formData.ContactNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control rounded"
                            placeholder="House No."
                            name="HouseNo"
                            value={formData.HouseNo}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control rounded"
                            placeholder="Street"
                            name="Street"
                            value={formData.Street}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control rounded"
                            placeholder="Near By LandMark"
                            name="NearByLandMark"
                            value={formData.NearByLandMark}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control rounded"
                            placeholder="City"
                            name="City"
                            value={formData.City}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="Number"
                            className="form-control rounded"
                            placeholder="PinCode"
                            name="PinCode"
                            value={formData.PinCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control rounded"
                        placeholder="Password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <button type="submit" className="btn btn-md full-width theme-bg text-light rounded ft-medium">{`${loading ? "lLoading..." : "Sign Up"}`}</button>
                    </div>

                    <div className="form-group text-center mt-4 mb-0">
                      <p className="mb-0">Already have an account? <Link to={'/sign-in'} className="ft-medium text-success">Sign In</Link></p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======================= Registration End ======================== */}
    </>
  );
}

export default Registration;
