import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import qualityAssured from './quality-assured-logo.webp'
import axios from 'axios'

function SubCategory() {
  const { title } = useParams();
  const [allService, setAllService] = useState([])
  // Function to convert the title to a normal format
  const formatTitle = (title) => {
    return title
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const newTitle = formatTitle(title);

  console.log('Formatted Title:', newTitle);

  const fetchServiceData = async () => {
    try {
      const res = await axios.get(`http://localhost:7000/api/v1/get-service-by-name/${newTitle}`)
      // console.log(res.data.data)
      setAllService(res.data.data)
    } catch (error) {
      console.log('Internal server error in fetching services', error)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    fetchServiceData()
  }, [title])

  // ye hai voice recoder

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
                {/* <div class="services-rating d-flex"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><div class="services-review"><span><a href='#'>(4.9) Reviews</a></span></div></div> */}
              </div>
              <div className='content-body mt-3' dangerouslySetInnerHTML={{ __html: allService.description || 'No description available.' }}>
              </div>
            </div>
          </div>

          {/* right sidbar */}
          <div className='col-lg-3 col-md-3'>
            <div className='services-sidebar sticky-top'>
              <div className='card px-3 py-3'>
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <img src={qualityAssured} alt="Quality log" className='img-fluid quality-logo' />
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h4>Blueace India Promise</h4>
                    <ul className='promise-list'>
                      <li><i class="fa fa-chevron-right"></i> Verified Professionals</li>
                      <li><i class="fa fa-chevron-right"></i> Hassle Free Booking</li>
                      <li><i class="fa fa-chevron-right"></i> Transparent Pricing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* chat or call area */}

              <div className='contact-area mt-5'>
                <Link to="" className='btn btn-success w-100 text-uppercase'><i class="fa-brands fa-whatsapp"></i> Whatsapp Us</Link>
                <Link to="" className='btn btn-danger w-100 mt-3 text-uppercase'><i class="fa-solid fa-headset"></i> Get A Free Call</Link>
              </div>

              {/* get service form section */}

              <div className='sidebar-form mt-5'>
                <h3 className='text-white text-center'>Get Enquiry</h3>
                <form action='' method='POST'>
                  <div className='row'>
                    <div class="mb-3 col-lg-12">
                      <input type="text" class="form-control" id="Name" placeholder='Full Name' required />
                    </div>
                    <div class="mb-3 col-lg-12">
                      <input type="email" class="form-control" id="email" placeholder='Email' required />
                    </div>
                    <div class="mb-3 col-lg-12">
                      <input type="tel" class="form-control" id="Phone" placeholder='Phone' required />
                    </div>
                    <div class="mb-1 col-lg-12">
                      <div className='readio-btn'>
                        <div class="form-check mt-2">
                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                          <label class="form-check-label text-white" for="flexRadioDefault1">
                            Service
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                          <label class="form-check-label text-white" for="flexRadioDefault2">
                            AMC
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" checked />
                          <label class="form-check-label text-white" for="flexRadioDefault3">
                            New Purchase
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4" checked />
                          <label class="form-check-label text-white" for="flexRadioDefault4">
                            Consultation
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="mb-3 col-lg-12">
                      <textarea class="form-control messagearea" id="message-text" placeholder='Message' required />
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
                    <div class="mb-3 col-lg-12 text-center">
                      {/* <button type="button" class="btn btn-primary rounded">Send Message</button> */}
                      <button type="button" class="btn btn-primary rounded" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">Send Message</button>
                    </div>
                  </div>
                </form>
              </div>


            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">New Address</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div className="row">
                  <div class="col-md-6 mb-2">
                    <label for="recipient-name" class="col-form-label">HouseNo:</label>
                    <input type="text" class="form-control" id="recipient-name" />
                  </div>
                  <div class="col-md-6 mb-2">
                    <label for="recipient-name" class="col-form-label">Street:</label>
                    <input type="text" class="form-control" id="recipient-name" />
                  </div>
                  <div class="col-md-6 mb-2">
                    <label for="recipient-name" class="col-form-label">City:</label>
                    <input type="text" class="form-control" id="recipient-name" />
                  </div>
                  <div class="col-md-6 mb-2">
                    <label for="recipient-name" class="col-form-label">PinCode:</label>
                    <input type="text" class="form-control" id="recipient-name" />
                  </div>
                  <div class="col-md-12 mb-2">
                    <label for="recipient-name" class="col-form-label">Land Mark:</label>
                    <input type="text" class="form-control" id="recipient-name" />
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Send message</button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default SubCategory;
