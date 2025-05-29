import React, { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

const CreateOrder = () => {
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [allService, setAllService] = useState([]);
    const [serviceType, setServiceType] = useState([]);
    const [serviceCagetgory, setserviceCagetgory] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Voice Recording States
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [recordingDuration, setRecordingDuration] = useState(0);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const recordingTimer = useRef(null);

    const [selectedService, setSelectedService] = useState(null);

    const [formData, setFormData] = useState({
        serviceId: '', // This will store the service category ID
        fullName: '',
        email: '',
        phoneNumber: '',
        message: '',
        voiceNote: null, // This will store the actual Blob
        serviceType: '', // This will store the individual service ID
        address: '',
        pinCode: '',
        houseNo: '',
        nearByLandMark: '',
        workingDateUserWant: '',
        RangeWhereYouWantService: [{
            location: {
                type: 'Point',
                coordinates: []
            }
        }]
    });

    // Voice Recording Functions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            audioChunks.current = [];
            setRecordingDuration(0);

            // Start timer
            recordingTimer.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                clearInterval(recordingTimer.current);
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                setFormData(prev => ({ ...prev, voiceNote: audioBlob }));
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            setIsPaused(false);
            toast.success('Recording started');
        } catch (error) {
            console.error('Error accessing microphone:', error);
            toast.error('Could not access microphone. Please check your permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            setIsPaused(false);
            clearInterval(recordingTimer.current);
            toast.success('Recording stopped');
        }
    };

    const pauseRecording = () => {
        if (mediaRecorder.current && isRecording && !isPaused) {
            mediaRecorder.current.pause();
            setIsPaused(true);
            clearInterval(recordingTimer.current);
            toast.info('Recording paused');
        }
    };

    const resumeRecording = () => {
        if (mediaRecorder.current && isRecording && isPaused) {
            mediaRecorder.current.resume();
            setIsPaused(false);
            recordingTimer.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
            toast.info('Recording resumed');
        }
    };

    const cancelRecording = () => {
        if (mediaRecorder.current) {
            if (isRecording) {
                mediaRecorder.current.stop();
            }
            mediaRecorder.current.stream?.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            setIsPaused(false);
            setAudioURL('');
            setRecordingDuration(0);
            clearInterval(recordingTimer.current);
            setFormData(prev => ({ ...prev, voiceNote: null }));
            toast.info('Recording cancelled');
        }
    };

    const deleteRecording = () => {
        setAudioURL('');
        setRecordingDuration(0);
        setFormData(prev => ({ ...prev, voiceNote: null }));
        toast.info('Recording deleted');
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFetchService = async () => {
        try {
            const { data } = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-service-category');
            setAllService(data?.data || []);
        } catch (error) {
            console.log("Error fetching services:", error);
            toast.error('Failed to load services');
        }
    };

    useEffect(() => {
        handleFetchService();
    }, []);

    useEffect(() => {
        const savedFormData = localStorage.getItem('serviceFormData');
        if (savedFormData) {
            try {
                const parsed = JSON.parse(savedFormData);
                setFormData(prevData => ({ ...prevData, ...parsed, voiceNote: null })); // Don't restore voice note from localStorage
            } catch (error) {
                console.error('Error parsing saved form data:', error);
            }
        }
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;

        // Handle service category selection (serviceId dropdown) - FIXED TO MATCH GetServicePopup
        if (name === 'serviceId') {
            try {
                const selectedService = allService.find((item) => item._id === value);
                const serviceName = selectedService?.name;
                
                if (serviceName) {
                    const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-service');
                    const allData = res.data.data || [];
                    
                    // Find the first matching service (like GetServicePopup)
                    const fil = allData.find((item) => item?.subCategoryId?.name === serviceName);
                    setSelectedService(fil);
                    
                    // Filter services that match this category
                    const regex = new RegExp(`^${serviceName}$`, 'i');
                    const filterData = allData.filter((item) => regex.test(item?.subCategoryId?.name));
                    setServiceType(filterData);
                }
                
                // Update form data - store the category ID
                setFormData(prev => ({
                    ...prev,
                    serviceId: value,
                }));
                
            } catch (error) {
                console.error('Error fetching services:', error);
                toast.error('Failed to load service types');
            }
            return;
        }

        // Handle individual service selection (serviceType dropdown) - SIMPLIFIED TO MATCH GetServicePopup
        if (name === 'serviceType') {
            setFormData((prevFormData) => {
                const updatedFormData = {
                    ...prevFormData,
                    serviceType: value, // Store the service name directly like GetServicePopup
                };
                // Save to localStorage (excluding voiceNote)
                const { voiceNote, ...dataToSave } = updatedFormData;
                localStorage.setItem('serviceFormData', JSON.stringify(dataToSave));
                return updatedFormData;
            });
            return;
        }

        // Handle all other form fields
        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [name]: value };
            // Save to localStorage (excluding voiceNote)
            const { voiceNote, ...dataToSave } = updatedFormData;
            localStorage.setItem('serviceFormData', JSON.stringify(dataToSave));
            return updatedFormData;
        });
    };

    const fetchAddressSuggestions = async (query) => {
        if (!query.trim()) {
            setAddressSuggestions([]);
            return;
        }

        try {
            const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/autocomplete?input=${encodeURIComponent(query)}`);
            setAddressSuggestions(res.data || []);
        } catch (err) {
            console.error('Error fetching address suggestions:', err);
        }
    };

    const fetchGeocode = async (selectedAddress) => {
        try {
            const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/geocode?address=${encodeURIComponent(selectedAddress)}`);
            const { latitude, longitude } = res.data;

            // Ensure coordinates are valid numbers
            const validLat = parseFloat(latitude);
            const validLng = parseFloat(longitude);

            if (isNaN(validLat) || isNaN(validLng)) {
                throw new Error('Invalid coordinates received');
            }

            setLocation({ latitude: validLat, longitude: validLng });
            setFormData(prev => ({
                ...prev,
                address: selectedAddress,
                RangeWhereYouWantService: [{
                    location: {
                        type: 'Point',
                        coordinates: [validLng, validLat] // MongoDB uses [longitude, latitude] format
                    }
                }]
            }));
            setAddressSuggestions([]);
        } catch (err) {
            console.error('Error fetching geocode:', err);
            toast.error('Failed to get location coordinates');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate coordinates before submission
            if (!location.latitude || !location.longitude ||
                isNaN(parseFloat(location.latitude)) || isNaN(parseFloat(location.longitude))) {
                toast.error('Please select a valid address to get location coordinates');
                setLoading(false);
                return;
            }

            // Create FormData for multipart/form-data
            const formDataToSend = new FormData();

            // FIXED: Send data in the same format as GetServicePopup
            formDataToSend.append('serviceId', selectedService?._id || ''); // Individual service ID
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phoneNumber', formData.phoneNumber);
            formDataToSend.append('message', formData.message);
            formDataToSend.append('serviceType', formData.serviceType); // Service name
            formDataToSend.append('address', formData.address);
            formDataToSend.append('pinCode', formData.pinCode);
            formDataToSend.append('houseNo', formData.houseNo);
            formDataToSend.append('nearByLandMark', formData.nearByLandMark);

            // Add optional fields if they exist
            if (formData.workingDateUserWant) {
                formDataToSend.append('workingDateUserWant', formData.workingDateUserWant);
            }

            // Add location data as JSON string with validated coordinates
            const validLng = parseFloat(location.longitude);
            const validLat = parseFloat(location.latitude);

            formDataToSend.append(
                'RangeWhereYouWantService',
                JSON.stringify([
                    {
                        location: {
                            type: 'Point',
                            coordinates: [validLng, validLat] // [longitude, latitude]
                        }
                    }
                ])
            );

            // Add voice note file if it exists
            if (formData.voiceNote && formData.voiceNote instanceof Blob) {
                formDataToSend.append('voiceNote', formData.voiceNote, 'voice-note.webm');
            }

            const res = await axios.post('https://www.api.blueaceindia.com/api/v1/make-order-admin', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Reset form on success
            setFormData({
                serviceId: '',
                fullName: '',
                email: '',
                phoneNumber: '',
                message: '',
                voiceNote: null,
                serviceType: '',
                address: '',
                pinCode: '',
                houseNo: '',
                nearByLandMark: '',
                workingDateUserWant: '',
                RangeWhereYouWantService: [{
                    location: {
                        type: 'Point',
                        coordinates: []
                    }
                }]
            });

            setSelectedService(null);
            setServiceType([]);
            setAudioURL('');
            setRecordingDuration(0);
            setLocation({ latitude: '', longitude: '' });
            localStorage.removeItem('serviceFormData');

            toast.success('Order created successfully!');

        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMessage = error?.response?.data?.message || 'An error occurred while creating the order';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb
                heading={'Create Order'}
                subHeading={'All Orders'}
                LastHeading={'Create Order'}
                backLink={'/home-layout/all-orders'}
            />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    {/* Service Category Selection - First dropdown */}
                    <div className="col-md-6">
                        <label className='form-label' htmlFor="serviceId">Select Service Category *</label>
                        <select
                            className="form-control"
                            name='serviceId'
                            value={formData.serviceId}
                            onChange={handleChange}
                            required
                            id='serviceId'
                        >
                            <option value="">Select Service Category</option>
                            {allService.map((service) => (
                                <option key={service._id} value={service._id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Individual Service Selection - Second dropdown */}
                    <div className="col-md-6">
                        <label className='form-label' htmlFor="serviceType">Select Specific Service *</label>
                        <select
                            className="form-control"
                            name='serviceType'
                            value={formData.serviceType}
                            onChange={handleChange}
                            required
                            id='serviceType'
                            disabled={!formData.serviceId || serviceType.length === 0}
                        >
                            <option value="">Select Specific Service</option>
                            {serviceType.map((service) => (
                                <option key={service._id} value={service.name}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Personal Information */}
                    <div className="col-md-4">
                        <label className='form-label' htmlFor="fullName">Full Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Full Name"
                            name='fullName'
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            id='fullName'
                        />
                    </div>

                    <div className="col-md-4">
                        <label className='form-label' htmlFor="email">Email *</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                            id='email'
                        />
                    </div>

                    <div className="col-md-4">
                        <label className='form-label' htmlFor="phoneNumber">Phone Number *</label>
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="Enter Phone Number"
                            name='phoneNumber'
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            id='phoneNumber'
                        />
                    </div>

                    {/* Address Information */}
                    <div className="col-md-6">
                        <label className='form-label' htmlFor="address">Address *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Address"
                            name='address'
                            value={formData.address}
                            onChange={(e) => {
                                handleChange(e);
                                fetchAddressSuggestions(e.target.value);
                            }}
                            required
                            id='address'
                        />
                        {addressSuggestions.length > 0 && (
                            <div className="dropdown-menu show" style={{ position: 'relative', width: '100%' }}>
                                {addressSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() => fetchGeocode(suggestion.description)}
                                    >
                                        {suggestion.description}
                                    </button>
                                ))}
                            </div>
                        )}
                        {location.latitude && location.longitude && (
                            <small className="text-success">
                                ✓ Address verified (Lat: {location.latitude}, Lng: {location.longitude})
                            </small>
                        )}
                    </div>

                    <div className="col-md-3">
                        <label className='form-label' htmlFor="houseNo">House No.</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter House No."
                            name='houseNo'
                            value={formData.houseNo}
                            onChange={handleChange}
                            id='houseNo'
                        />
                    </div>

                    <div className="col-md-3">
                        <label className='form-label' htmlFor="pinCode">Pin Code</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Pin Code"
                            name='pinCode'
                            value={formData.pinCode}
                            onChange={handleChange}
                            id='pinCode'
                        />
                    </div>

                    <div className="col-md-6">
                        <label className='form-label' htmlFor="nearByLandMark">Nearby Landmark</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Nearby Landmark"
                            name='nearByLandMark'
                            value={formData.nearByLandMark}
                            onChange={handleChange}
                            id='nearByLandMark'
                        />
                    </div>

                    <div className="col-md-3">
                        <label className='form-label' htmlFor="workingDateUserWant">Preferred Working Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name='workingDateUserWant'
                            value={formData.workingDateUserWant}
                            onChange={handleChange}
                            id='workingDateUserWant'
                        />
                    </div>

                    {/* Message */}
                    <div className="col-md-12">
                        <label className='form-label' htmlFor="message">Message</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Enter your message"
                            name='message'
                            value={formData.message}
                            onChange={handleChange}
                            id='message'
                        ></textarea>
                    </div>

                    {/* Voice Note Section */}
                    <div className="col-md-12">
                        <label className='form-label'>Voice Note (Optional)</label>
                        <div className="voice-note-section p-3 border rounded">
                            {!audioURL ? (
                                <div className="recording-controls">
                                    {!isRecording ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary me-2"
                                            onClick={startRecording}
                                        >
                                            <i className="fas fa-microphone me-2"></i>
                                            Start Recording
                                        </button>
                                    ) : (
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-danger">
                                                Recording: {formatDuration(recordingDuration)}
                                            </span>

                                            {!isPaused ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm"
                                                    onClick={pauseRecording}
                                                >
                                                    <i className="fas fa-pause"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-info btn-sm"
                                                    onClick={resumeRecording}
                                                >
                                                    <i className="fas fa-play"></i>
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="btn btn-success btn-sm"
                                                onClick={stopRecording}
                                            >
                                                <i className="fas fa-stop"></i>
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={cancelRecording}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="audio-playback">
                                    <div className="d-flex align-items-center gap-3">
                                        <audio controls src={audioURL} className="flex-grow-1">
                                            Your browser does not support the audio element.
                                        </audio>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={deleteRecording}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                deleteRecording();
                                                startRecording();
                                            }}
                                        >
                                            <i className="fas fa-microphone"></i> Re-record
                                        </button>
                                    </div>
                                    <small className="text-muted">
                                        Duration: {formatDuration(recordingDuration)}
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='col-md-10 mx-auto mt-4'>
                        <button
                            className={`btn w-100 py-3 btn-primary ${loading ? 'disabled' : ''}`}
                            disabled={loading}
                            type='submit'
                        >
                            {loading ? 'Creating Order...' : 'Create Order'}
                        </button>
                    </div>
                </div>
            } />
        </div>
    )
}

export default CreateOrder;