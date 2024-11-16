import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import qualityAssured from './quality-assured-logo.webp';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './subCategory.css'
import MetaTag from '../../Components/Meta/MetaTag';

function SubCategory() {
  const { title } = useParams();
  const userData = JSON.parse(sessionStorage.getItem('user'));
  const [allService, setAllService] = useState({});
  const [service, setService] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const formatTitle = (title) => {
    return title
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const newTitle = formatTitle(title);
  const role = userData?.Role
  // console.log("userData", role)

  const openModal = (item) => {
    const modalServiceImage = document.getElementById('modalServiceImage');
    const modalServiceName = document.getElementById('modalServiceName');
    const modalServiceDescription = document.getElementById('modalServiceDescription');

    // Set service image
    if (item.serviceImage?.url) {
      modalServiceImage.src = item.serviceImage.url;
    } else {
      modalServiceImage.src = '';
      modalServiceImage.alt = 'No Image Available';
    }

    // Set service name
    modalServiceName.textContent = item.name;

    // Set service description using dangerouslySetInnerHTML
    modalServiceDescription.innerHTML = item?.description || 'No description available.';
  };



  const fetchdata = async () => {
    try {
      const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/get-service-category-by-name/${newTitle}`);
      setService(res.data.data);
      // console.log('data', res.data.data)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllData = async () => {
    try {
      const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-service');
      const allData = res.data.data;

      // Apply regex search directly in the frontend filtering
      const searchName = newTitle; // Input search term
      const regex = new RegExp(`^${searchName}$`, 'i'); // Regex for case-insensitive matching

      // Filtering data based on regex match
      const filterData = allData.filter((item) => regex.test(item?.subCategoryId?.name));

      // console.log("filterData", filterData);
      setAllService(filterData);
    } catch (error) {
      console.log('Internal server error in fetching service');
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

  // console.log('filterdata', allService)

  const handleCloseModel = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // fetchServiceData();
    fetchAllData();
    fetchdata();
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
  // console.log('service id',allService)
  // useEffect(() => {
  //   if (allService._id) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       serviceId: allService._id
  //     }));
  //   }
  // }, [allService]);

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

    if (name === 'serviceType') {
      // Find the selected service from allService array
      const selectedService = allService.find((item) => item.name === value);

      // Update both serviceType and serviceId
      setFormData({
        ...formData,
        serviceType: value,
        serviceId: selectedService ? selectedService._id : '', // Set the serviceId if found
      });
    } else {
      // Update other fields
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAlert = () => {
    toast.error('You are a vendor or employee; you cannot avail of the services.');
  }




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
      await axios.post('https://www.api.blueaceindia.com/api/v1/make-order', updatedFormData, {
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
      <MetaTag title={service.metaTitle} description={service.metaDescription} keyword={service.metaKeyword} focus={service.metafocus} />
      {/* Main Form */}
      <div className='container mb-5'>
        <div className='row mt-5'>
          <div className='col-lg-9 col-md-9 mb-3'>
            <div className='hero-image mb-3'>
              {service && service?.sliderImage ? (
                <img src={service.sliderImage[0].url} className='rounded w-100' alt='Service Image' />
              ) : (
                <p>Loading...</p>
              )}

              {/* <img src={service?.sliderImage[0]?.url} className='rounded w-100' alt='Service Image' /> */}
            </div>
            <div className='services-content'>
              <div className='services-title'>
                <h2 className='fw-bold'>{service?.name}</h2>
              </div>
              <div className='content-body mt-3' dangerouslySetInnerHTML={{ __html: service?.description || 'No description available.' }}>
              </div>
            </div>
            <div className='row'>
              {Array.isArray(allService) &&
                allService.map((item, index) => (
                  <div
                    className='col-lg-4'
                    key={index}
                    onClick={() => openModal(item)}
                    data-bs-toggle="modal"
                    data-bs-target="#serviceModal"
                  >
                    <div>
                      <div style={{ backgroundColor: '#E5EAF3' }} className='card p-1 border-0'>
                        {item.serviceImage?.url ? (
                          <img src={item.serviceImage.url} className='forserviceImage' alt={item.name} />
                        ) : (
                          <div className="placeholder-image">No Image Available</div>
                        )}
                        <h6 className='fw-semibold mt-2 mb-2 text-center'>{item.name}</h6>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div
              className="modal fade"
              id="serviceModal"
              tabIndex="-1"
              aria-labelledby="serviceModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="serviceModalLabel">Service Details</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <img src="" alt="Service" id="modalServiceImage" className="img-fluid mb-3" />
                    <h4 id="modalServiceName"></h4>
                    <div
                      id="modalServiceDescription"
                      className="content-body mt-3"
                    ></div>
                  </div>
                </div>
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
                        {Array.isArray(allService) &&
                          allService.map((item, index) => (
                            <option key={index} value={item.name}>
                              {item.name}
                            </option>
                          ))}
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
                    {
                      role === 'employ' || role === 'vendor' ? (
                        <div className='mb-3 col-lg-12 text-center'>
                          <button type='button' onClick={handleAlert} className='btn btn-primary rounded'>
                            Send Message
                          </button>
                        </div>
                      ) : (
                        <div className='mb-3 col-lg-12 text-center'>
                          <button type='button' onClick={handleOpenModel} className='btn btn-primary rounded' data-bs-target='#exampleModal'>
                            Send Message
                          </button>
                        </div>
                      )
                    }

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* // Modal for Address Entry */}
      <div className='modal ' style={{ display: `${isModalOpen ? 'block' : 'none'}` }} id='exampleModal' tabIndex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
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
