import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function GetServicePopup({ handlePopupDeactive }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [allService, setAllService] = useState([]);
    const [serviceType, setServiceType] = useState([]);
    const [serviceCagetgory, setserviceCagetgory] = useState({})

    // Voice Recording States
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const [selectedService, setSelectedService] = useState(null)

    const [formData, setFormData] = useState({
        userId: '',
        serviceId: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        message: '',
        voiceNote: '',
        serviceType: '',
        address: '',
        pinCode: '',
        houseNo: '',
        nearByLandMark: '',
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
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                setFormData(prev => ({ ...prev, voiceNote: audioBlob }));
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            setIsPaused(false);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            toast.error('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            setIsPaused(false);
        }
    };

    const pauseRecording = () => {
        if (mediaRecorder.current && isRecording && !isPaused) {
            mediaRecorder.current.pause();
            setIsPaused(true);
        }
    };

    const resumeRecording = () => {
        if (mediaRecorder.current && isRecording && isPaused) {
            mediaRecorder.current.resume();
            setIsPaused(false);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            setIsPaused(false);
            setAudioURL('');
            setFormData(prev => ({ ...prev, voiceNote: '' }));
        }
    };

    const handleFetchService = async () => {
        try {
            const { data } = await axios.get('https://api.blueaceindia.com/api/v1/get-all-service-category');
            setAllService(data?.data);
        } catch (error) {
            console.log("Internal server error", error);
        }
    };

    useEffect(() => {
        handleFetchService();
    }, []);

    useEffect(() => {
        const savedFormData = localStorage.getItem('serviceFormData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === 'serviceId') {
            try {
                const selectedService = allService.find((item) => item._id === value); // Find the service by ID
                const serviceName = selectedService?.name;
                const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-service');
                const allData = res.data.data;
                const fil = allData.find((item) => item?.subCategoryId?.name === serviceName);
                setSelectedService(fil)

                if (serviceName) {
                    const regex = new RegExp(`^${serviceName}$`, 'i'); // Case-insensitive match
                    const filterData = allData.filter((item) => regex.test(item?.subCategoryId?.name));
                    setServiceType(filterData); // Update service type options
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        }

        if (name === 'serviceType') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                serviceType: value,
            }));
        } else {
            setFormData((prevFormData) => {
                const updatedFormData = { ...prevFormData, [name]: value };
                localStorage.setItem('serviceFormData', JSON.stringify(updatedFormData)); // Persist to localStorage
                return updatedFormData;
            });
        }
    };

    const fetchAddressSuggestions = async (query) => {
        try {
            const res = await axios.get(`https://api.blueaceindia.com/api/v1/autocomplete?input=${encodeURIComponent(query)}`);
            setAddressSuggestions(res.data || []);
        } catch (err) {
            console.error('Error fetching address suggestions:', err);
        }
    };

    const fetchGeocode = async (selectedAddress) => {
        try {
            const res = await axios.get(`https://api.blueaceindia.com/api/v1/geocode?address=${encodeURIComponent(selectedAddress)}`);
            const { latitude, longitude } = res.data;
            setLocation({ latitude, longitude });
            setFormData(prev => ({
                ...prev,
                address: selectedAddress,
                RangeWhereYouWantService: [{
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]  // Ensure the format is correct here
                    }
                }]
            }));
            setAddressSuggestions([]);
        } catch (err) {
            console.error('Error fetching geocode:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userDataString = sessionStorage.getItem('user');
            const userData = JSON.parse(userDataString);
            if (!userData || !userData._id) {
                toast.error('Please sign in to continue');
                localStorage.setItem('serviceFormData', JSON.stringify(formData));
                window.location.href = `/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`
                return;
            }
            const userId = userData._id;

            const updatedFormData = new FormData();

            updatedFormData.append('userId', userId);
            updatedFormData.append('serviceId', selectedService?._id);
            updatedFormData.append('fullName', formData.fullName);
            updatedFormData.append('email', formData.email);
            updatedFormData.append('phoneNumber', formData.phoneNumber);
            updatedFormData.append('message', formData.message);
            updatedFormData.append('serviceType', formData.serviceType);
            updatedFormData.append('address', formData.address);
            updatedFormData.append('pinCode', formData.pinCode);
            updatedFormData.append('houseNo', formData.houseNo);
            updatedFormData.append('nearByLandMark', formData.nearByLandMark);

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
            updatedFormData.append('voiceNote', audioURL)

            const res = await axios.post('https://api.blueaceindia.com/api/v1/make-order', updatedFormData);
            setSelectedService(null)
            toast.success('Service request submitted successfully!');
            localStorage.removeItem('serviceFormData');
            handlePopupDeactive();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(error?.response?.data?.message || 'An error occurred');
        }
    };


    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="bg-white rounded-4 shadow-lg overflow-hidden">
                            {/* Header */}
                            <div className="position-relative bg-primary bg-gradient p-4">
                                <h4 className="text-white mb-0 fw-bold">Book Your Service</h4>
                                <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                                    <span className="text-white me-3">Step {step} of 3</span>
                                    <button onClick={handlePopupDeactive}
                                        className="btn text-white"
                                        style={{ fontSize: '1.5rem' }}>×</button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="progress" style={{ height: '4px', borderRadius: 0 }}>
                                <div className="progress-bar"
                                    style={{ width: `${(step / 3) * 100}%` }}></div>
                            </div>

                            {/* Form Body */}
                            <div className="p-4">
                                <form onSubmit={handleSubmit}>
                                    {step === 1 && (
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="text"
                                                        className="form-control"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        placeholder="Your Name"
                                                        required />
                                                    <label>Full Name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="email"
                                                        className="form-control"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="name@example.com"
                                                        required />
                                                    <label>Email Address</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <input type="tel"
                                                        className="form-control"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleChange}
                                                        placeholder="Phone"
                                                        required />
                                                    <label>Phone Number</label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div className="form-floating">
                                                    <select className="form-select"
                                                        name="serviceId"
                                                        value={formData.serviceId}
                                                        onChange={handleChange}
                                                        required>
                                                        <option value="">Select a service</option>
                                                        {allService && allService.map((item, index) => (
                                                            <option key={index} value={item._id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                    <label>Select Service</label>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-floating">
                                                    <select className="form-select"
                                                        name="serviceType"
                                                        value={formData.serviceType}
                                                        onChange={handleChange}
                                                        required>
                                                        <option value="">Select a service</option>
                                                        {serviceType && serviceType.map((item, index) => (
                                                            <option key={index}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                    <label>Select Service Type</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <textarea className="form-control"
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        placeholder="Your message"
                                                        style={{ height: '100px' }}
                                                        required></textarea>
                                                    <label>Describe Your Requirements</label>
                                                </div>
                                            </div>

                                            {/* Voice Recording Section */}
                                            <div className="col-12 mt-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="card-title mb-3">Voice Note</h5>
                                                        <div className="d-flex gap-2 mb-3">
                                                            {!isRecording && !audioURL && (
                                                                <button type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={startRecording}>
                                                                    Start Recording
                                                                </button>
                                                            )}

                                                            {isRecording && !isPaused && (
                                                                <>
                                                                    <button type="button"
                                                                        className="btn btn-warning"
                                                                        onClick={pauseRecording}>
                                                                        Pause
                                                                    </button>
                                                                    <button type="button"
                                                                        className="btn btn-success"
                                                                        onClick={stopRecording}>
                                                                        Stop
                                                                    </button>
                                                                    <button type="button"
                                                                        className="btn btn-danger"
                                                                        onClick={cancelRecording}>
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            )}

                                                            {isRecording && isPaused && (
                                                                <>
                                                                    <button type="button"
                                                                        className="btn btn-primary"
                                                                        onClick={resumeRecording}>
                                                                        Resume
                                                                    </button>
                                                                    <button type="button"
                                                                        className="btn btn-success"
                                                                        onClick={stopRecording}>
                                                                        Stop
                                                                    </button>
                                                                    <button type="button"
                                                                        className="btn btn-danger"
                                                                        onClick={cancelRecording}>
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>

                                                        {audioURL && (
                                                            <div className="mt-3">
                                                                <audio controls src={audioURL} className="w-100" />
                                                                <button type="button"
                                                                    className="btn btn-danger btn-sm mt-2"
                                                                    onClick={cancelRecording}>
                                                                    Delete Recording
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <input type="text"
                                                        className="form-control"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            fetchAddressSuggestions(e.target.value);
                                                        }}
                                                        placeholder="Address"
                                                        required />
                                                    <label>Complete Address</label>
                                                </div>
                                                {addressSuggestions.length > 0 && (
                                                    <div className="list-group mt-2">
                                                        {addressSuggestions.map((suggestion, index) => (
                                                            <button key={index}
                                                                type="button"
                                                                className="list-group-item list-group-item-action"
                                                                onClick={() => fetchGeocode(suggestion.description)}>
                                                                {suggestion.description}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="text"
                                                        className="form-control"
                                                        name="houseNo"
                                                        value={formData.houseNo}
                                                        onChange={handleChange}
                                                        placeholder="House No"
                                                        required />
                                                    <label>House/Flat No</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="text"
                                                        className="form-control"
                                                        name="pinCode"
                                                        value={formData.pinCode}
                                                        onChange={handleChange}
                                                        placeholder="PIN Code"
                                                        required />
                                                    <label>PIN Code</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <input type="text"
                                                        className="form-control"
                                                        name="nearByLandMark"
                                                        value={formData.nearByLandMark}
                                                        onChange={handleChange}
                                                        placeholder="Landmark" />
                                                    <label>Nearby Landmark (Optional)</label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between mt-4">
                                        {step > 1 && (
                                            <button type="button"
                                                className="btn btn-outline-primary px-4"
                                                onClick={prevStep}>
                                                Previous
                                            </button>
                                        )}
                                        {step < 3 ? (
                                            <button type="button"
                                                className="btn btn-primary px-4 ms-auto"
                                                onClick={nextStep}>
                                                Next
                                            </button>
                                        ) : (
                                            <button type="submit"
                                                className="btn btn-primary px-4 ms-auto">
                                                Submit Request
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetServicePopup;