import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import qualityAssured from './quality-assured-logo.webp';
import axios from 'axios';

function SubCategory() {
  const { title } = useParams();
  const [allService, setAllService] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const audioPlayback = useRef(null);
  const voiceFileInput = useRef(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [message, setMessage] = useState('');

  const formatTitle = (title) => {
    return title
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const newTitle = formatTitle(title);

  const fetchServiceData = async () => {
    try {
      const res = await axios.get(`http://localhost:7000/api/v1/get-service-by-name/${newTitle}`);
      setAllService(res.data.data);
    } catch (error) {
      console.log('Internal server error in fetching services', error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Unable to retrieve your location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this system');
    }
  };

  const voiceRecoderStart = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.start();
      setIsRecording(true);

      recorder.addEventListener('dataavailable', (event) => {
        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      });

      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioPlayback.current) {
          audioPlayback.current.src = audioUrl;
        }

        const file = new File([audioBlob], 'voiceNote.mp3', {
          type: 'audio/mpeg',
        });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('serviceType', serviceType);
    formData.append('message', message);

    if (voiceFileInput.current && voiceFileInput.current.files[0]) {
      formData.append('voiceNote', voiceFileInput.current.files[0]);
    }

    if (location.latitude && location.longitude) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    }

    try {
      const res = await axios.post('http://localhost:7000/make-order', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Order created successfully', res.data);
    } catch (error) {
      console.error('Error creating order', error);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    fetchServiceData();
    getLocation();
  }, [title]);

  return (
    <>
      <div className='container mb-5'>
        <div className='row mt-5'>
          <div className='col-lg-9 col-md-9'>
            <div className='hero-image mb-3'>
              <img src={allService?.serviceBanner?.url} className='rounded w-100' alt='Bulk Cold Stores Image' />
            </div>
            <div className='services-content'>
              <div className='services-title'>
                <h2 className='fw-bold'>{allService.name}</h2>
              </div>
              <div className='content-body mt-3' dangerouslySetInnerHTML={{ __html: allService.description || 'No description available.' }}></div>
            </div>
          </div>

          {/* right sidebar */}
          <div className='col-lg-3 col-md-3'>
            <div className='services-sidebar sticky-top'>
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

              <div className='contact-area mt-5'>
                <Link to='' className='btn btn-success w-100 text-uppercase'><i className='fa-brands fa-whatsapp'></i> Whatsapp Us</Link>
                <Link to='' className='btn btn-danger w-100 mt-3 text-uppercase'><i className='fa-solid fa-headset'></i> Get A Free Call</Link>
              </div>

              {/* order form section */}
              <div className='sidebar-form mt-5'>
                <h3 className='text-white text-center'>Get Enquiry</h3>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                  <div className='row'>
                    <div className='mb-3 col-lg-12'>
                      <input type='text' className='form-control' placeholder='Full Name' required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className='mb-3 col-lg-12'>
                      <input type='email' className='form-control' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='mb-3 col-lg-12'>
                      <input type='tel' className='form-control' placeholder='Phone' required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <div className='mb-3 col-lg-12'>
                      <textarea className='form-control' placeholder='Message' required value={message} onChange={(e) => setMessage(e.target.value)} />
                    </div>
                    <div className='col-lg-12'>
                      <div className='form-group fs-6 text-white mb-2 mt-2'>
                        <label htmlFor='voiceNote col-12'>Recording Voice Note:</label>
                      </div>
                      <div className='d-flex justify-content-between w-100'>
                        <button className='btn btn-success btn-sm col-6 w-50 rounded' type='button' onClick={voiceRecoderStart} disabled={isRecording}>
                          Start
                        </button>
                        <button className='btn btn-danger btn-sm col-6 w-50 mx-2 rounded' type='button' onClick={voiceRecoderStop} disabled={!isRecording}>
                          Stop
                        </button>
                      </div>

                      <div className='mt-3 mb-3'>
                        <audio id='audioPlayback' controls className='w-100' ref={audioPlayback}></audio>
                        <input type='file' id='voiceFile' name='voiceFile' style={{ display: 'none' }} ref={voiceFileInput} />
                      </div>
                    </div>
                    <div className='mb-3 col-lg-12 text-center'>
                      <button type='submit' className='btn btn-primary rounded'>Send Message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubCategory;
