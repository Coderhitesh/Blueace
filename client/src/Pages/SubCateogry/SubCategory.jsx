import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import qualityAssured from './quality-assured-logo.webp';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function SubCategory() {
  const { title } = useParams();
  const [allService, setAllService] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Function to format the title
  const formatTitle = (title) => {
    return title
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const newTitle = formatTitle(title);

  // Fetch service data from the API
  const fetchServiceData = async () => {
    try {
      const res = await axios.get(`https://api.blueace.co.in/api/v1/get-service-by-name/${newTitle}`);
      setAllService(res.data.data);
    } catch (error) {
      console.log('Internal server error in fetching services', error);
    }
  };

  const handleOpenModel = () => {
    // Check if fullName is not filled or email is not filled
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.message) {

      toast.error("Please fill all the required fields");
      return;
    } else {
      setIsModalOpen(true);
    }
  };
  
  const handleCloseModel = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchServiceData();
  }, [title]);

  // Voice Recorder Logic
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const audioPlayback = useRef(null);
  const voiceFileInput = useRef(null);

  const voiceRecoderStart = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.start();
      setIsRecording(true);

      recorder.addEventListener('dataavailable', event => {
        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      });

      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioPlayback.current) {
          audioPlayback.current.src = audioUrl;
        }

        // Convert blob to file and add to input
        const file = new File([audioBlob], 'voiceNote.mp3', { type: 'audio/mpeg' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        if (voiceFileInput.current) {
          voiceFileInput.current.files = dataTransfer.files;
        }
      });
    });
  };

  const voiceRecoderStop = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };



  const [formData, setFormData] = useState({
    userId: '',
    serviceId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    message: '',
    voiceNote: '',
    serviceType: '',
    city: '',
    pinCode: '',
    houseNo: '',
    street: '',
    nearByLandMark: '',
    RangeWhereYouWantService: [
      {
        location: {
          type: 'Point',
          coordinates: [] // Coordinates [longitude, latitude]
        }
      }
    ]
  });

  const [location, setLocation] = useState({ latitude: '', longitude: '' });

  // Update formData once the serviceId is available
  useEffect(() => {
    if (allService._id) {
      setFormData((prevData) => ({
        ...prevData,
        serviceId: allService._id
      }));
    }
  }, [allService]);

  // Get user location
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // Handle form submission
  const handleSubmit = async () => {
    // e.preventDefault();
    const userDataString = sessionStorage.getItem('user');
    const userData = JSON.parse(userDataString);

    if (!userData || !userData._id) {
      toast.error('User not logged in. Redirecting to sign-in.');
      // window.location.href = '/sign-in';
      navigate(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }


    const userId = userData._id;

    if (!formData.serviceId) {
      toast.error('Service ID not available. Please try again.');
      return;
    }

    const updatedFormData = new FormData();

    // Append userId directly to the form data
    updatedFormData.append('userId', userId);
    updatedFormData.append('serviceId', formData.serviceId);
    updatedFormData.append('fullName', formData.fullName);
    updatedFormData.append('email', formData.email);
    updatedFormData.append('phoneNumber', formData.phoneNumber);
    updatedFormData.append('message', formData.message);
    updatedFormData.append('serviceType', formData.serviceType);
    updatedFormData.append('city', formData.city);
    updatedFormData.append('pinCode', formData.pinCode);
    updatedFormData.append('houseNo', formData.houseNo);
    updatedFormData.append('street', formData.street);
    updatedFormData.append('nearByLandMark', formData.nearByLandMark);

    // Append voice note file if available
    if (voiceFileInput.current?.files?.[0]) {
      updatedFormData.append('voiceNote', voiceFileInput.current.files[0]);
    }

    // Append location data
    updatedFormData.append(
      'RangeWhereYouWantService',
      JSON.stringify([
        {
          location: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
          }
        }
      ])
    );

    try {
      await axios.post('https://api.blueace.co.in/api/v1/make-order', updatedFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Order placed successfully!');
      window.location.href = '/successfully-booking'
    } catch (error) {
      toast.error('Error placing the order');
      console.log(error);
    }
  };


  const handleModalSubmit = () => {
    if (formData.serviceType && formData.houseNo && formData.street && formData.city && formData.pinCode && formData.nearByLandMark) {
      const modal = document.getElementById('exampleModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      handleSubmit();
      modalInstance.hide();
    } else {
      toast.error('Please fill all fields in the address form and select a service type.');
    }
  };




  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      {/* Main Form */}
      <div className='container mb-5'>
        <div className='row mt-5'>
          <div className='col-lg-9 col-md-9'>
            <div className='hero-image mb-3'>
              <img src={allService?.serviceBanner?.url} className='rounded w-100' alt='Service Image' />
            </div>
            <div className='services-content'>
              <div className='services-title'>
                <h2 className='fw-bold'>{allService.name}</h2>
              </div>
              <div className='content-body mt-3' dangerouslySetInnerHTML={{ __html: allService.description || 'No description available.' }}>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='col-lg-3 col-md-3'>
            <div className={`services-sidebar ${window.innerWidth >= 992 ? 'sticky-top' : ''}`}>
              <div className='card px-3 py-3'>
                <div className='d-flex'>
                  <div className='flex-shrink-0'>
                    <img src={qualityAssured} alt='Quality log' className='img-fluid quality-logo' />
                  </div>
                  <div className='flex-grow-1 ms-3'>
                    <h4>Blueace India Promise</h4>
                    <ul className='promise-list'>
                      <li><i className='fa fa-chevron-right'></i> Verified Professionals</li>
                      <li><i className='fa fa-chevron-right'></i> Hassle Free Booking</li>
                      <li><i className='fa fa-chevron-right'></i> Transparent Pricing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Enquiry Form */}
              <div className='sidebar-form mt-5'>
                <h3 className='text-white text-center'>Get Enquiry</h3>
                <form onSubmit={handleSubmit}>
                  <div className='row'>
                    <div className='mb-3 col-lg-12'>
                      <input type='text' name='fullName' className='form-control' placeholder='Full Name' required onChange={handleChange} />
                    </div>
                    <div className='mb-3 col-lg-12'>
                      <input type='email' name='email' className='form-control' placeholder='Email' required onChange={handleChange} />
                    </div>
                    <div className='mb-3 col-lg-12'>
                      <input type='tel' name='phoneNumber' className='form-control' placeholder='Phone' required onChange={handleChange} />
                    </div>
                    <div className='mb-3 col-lg-12'>
                      <select
                        className='form-select'
                        name='serviceType'
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                      >
                        <option value=''>Select Service Type:</option>
                        <option value='Service'>Service</option>
                        <option value='AMC'>AMC</option>
                        <option value='New Purchase'>New Purchase</option>
                        <option value='Consultation'>Consultation</option>
                      </select>

                    </div>

                    <div className='col-lg-12'>
                      <div className='form-group fs-6 text-white mb-2 mt-2'>
                        <label htmlFor='voiceNote col-12'>Recording Voice Note:</label>
                      </div>
                      <div className='d-flex justify-content-between w-100'>
                        <button
                          className='btn btn-success btn-sm col-6 w-50 rounded'
                          type='button'
                          onClick={voiceRecoderStart}
                          disabled={isRecording}
                        >
                          Start
                        </button>
                        <button
                          className='btn btn-danger btn-sm col-6 w-50 mx-2 rounded'
                          type='button'
                          onClick={voiceRecoderStop}
                          disabled={!isRecording}
                        >
                          Stop
                        </button>
                      </div>

                      <div className='mt-3 mb-3'>
                        <audio id='audioPlayback' controls className='w-100' ref={audioPlayback}></audio>
                        <input type='file' id='voiceFile' name='voiceFile' style={{ display: 'none' }} ref={voiceFileInput} />
                      </div>
                    </div>
                    <div className='mb-3 col-lg-12'>
                      <textarea className='form-control messagearea' name='message' placeholder='Message' required onChange={handleChange} />
                    </div>
                    <div className='mb-3 col-lg-12 text-center'>
                      <button type='button' onClick={handleOpenModel} className='btn btn-primary rounded'  data-bs-target='#exampleModal'>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* // Modal for Address Entry */}
      <div className='modal '     style={{ display: `${isModalOpen ? 'block' : 'none'}` }} id='exampleModal' tabIndex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>Enter Address</h5>
              <button type='button' onClick={handleCloseModel} className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <form onSubmit={handleModalSubmit}>
                <div className='row'>
                  <div className='col-md-6 mb-2'>
                    <label htmlFor='houseNo' className='col-form-label'>House No:</label>
                    <input type='text' name='houseNo' className='form-control' id='houseNo' onChange={handleChange} required />
                  </div>
                  <div className='col-md-6 mb-2'>
                    <label htmlFor='street' className='col-form-label'>Street:</label>
                    <input type='text' name='street' className='form-control' id='street' onChange={handleChange} required />
                  </div>
                  <div className='col-md-6 mb-2'>
                    <label htmlFor='city' className='col-form-label'>City:</label>
                    <input type='text' name='city' className='form-control' id='city' onChange={handleChange} required />
                  </div>
                  <div className='col-md-6 mb-2'>
                    <label htmlFor='pinCode' className='col-form-label'>Pin Code:</label>
                    <input type='text' name='pinCode' className='form-control' id='pinCode' onChange={handleChange} required />
                  </div>
                  <div className='col-md-12 mb-2'>
                    <label htmlFor='nearByLandMark' className='col-form-label'>Nearby Landmark:</label>
                    <input type='text' name='nearByLandMark' className='form-control' id='nearByLandMark' onChange={handleChange} required />
                  </div>
                </div>
              </form>
            </div>
            <div className='modal-footer'>
              <button type='button' onClick={handleCloseModel} className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
              <button type='button' className='btn btn-primary' onClick={handleModalSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default SubCategory;
