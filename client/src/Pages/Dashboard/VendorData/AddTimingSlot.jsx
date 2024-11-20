import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddTimingSlot({ userData }) {
    const vendorId = userData?._id;
    const [formData, setFormData] = useState([{ day: '', morningSlot: '', afternoonSlot: '', eveningSlot: '', is_active: true }]);
    const [loading, setLoading] = useState(false);
    const [allTimeSlot, setAllTimeSlot] = useState([])

    // Handle Change
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const newFormData = [...formData];
        newFormData[index][name] = value;
        setFormData(newFormData);
    };

    // Add More Schedule
    const handleAddMore = () => {
        setFormData([...formData, { day: '', morningSlot: '', afternoonSlot: '', eveningSlot: '', is_active: true }]);
    };

    // Remove Schedule
    const handleRemove = (index) => {
        const newFormData = formData.filter((_, i) => i !== index);
        setFormData(newFormData);
    };

    const handleFetchTimeSlot = async () => {
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-timing')
            // console.log("time", res.data.data)
            setAllTimeSlot(res.data.data)
        } catch (error) {
            console.log("Error in getting time slots:", error);
            toast.error('Error in getting time slots')
        }
    }

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`https://api.blueaceindia.com/api/v1/create-working-hours/${vendorId}`, { schedule: formData }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Slot Added Successfully');
            setFormData([{ day: '', morningSlot: '', afternoonSlot: '', eveningSlot: '', is_active: true }]); // Reset form
        } catch (error) {
            console.log("Error in Slot:", error);
            toast.error('Internal server error');
        }
    };

    useEffect(() => {
        handleFetchTimeSlot();
    }, [])

    return (
        <div className="goodup-dashboard-content">
            <div className="dashboard-tlbar d-block mb-5">
                <h1 className="ft-medium">Time Slots</h1>
            </div>
            <div className="dashboard-widg-bar d-block">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 bg-white rounded">
                        <div className="dashboard-list-wraps-body py-3 px-3">
                            <form className="submit-form" onSubmit={handleSubmit}>
                                {formData.map((schedule, index) => (
                                    <div key={index} className='row mt-2'>
                                        <div className='col-6'>
                                            <label>Day:</label>
                                            <select
                                                class="form-control mt-1"
                                                name="day"
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            >
                                                <option value={''}>--Select Days--</option>
                                                <option value="Monday">Monday</option>
                                                <option value="Tuesday">Tuesday</option>
                                                <option value="Wednesday">Wednesday</option>
                                                <option value="Thursday">Thursday</option>
                                                <option value="Friday">Friday</option>
                                                <option value="Saturday">Saturday</option>
                                                <option value="Sunday">Sunday</option>
                                            </select>
                                        </div>
                                        <div className='col-6'>
                                            <label>Morning Slot:</label>
                                            <select
                                                class="form-control"
                                                name='morningSlot'
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            >
                                                <option value={''}>--Morning Slot--</option>
                                                {
                                                    allTimeSlot && allTimeSlot.map((item, index) => (
                                                        <option key={index} value={item.time}>{item.time}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-6 text-right mt-2">
                                            <label>Afternoon Slot:</label>
                                            <select
                                                class="form-control"
                                                name='afternoonSlot'
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            >
                                                <option value={''}>--Afternoon Slot--</option>
                                                {
                                                    allTimeSlot && allTimeSlot.map((item, index) => (
                                                        <option key={index} value={item.time}>{item.time}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-6 text-right mt-2">
                                            <label>Evening Slot:</label>
                                            <select
                                                class="form-control"
                                                name='eveningSlot'
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            >
                                                <option value={''}>--Evening Slot--</option>
                                                {
                                                    allTimeSlot && allTimeSlot.map((item, index) => (
                                                        <option key={index} value={item.time}>{item.time}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-12 text-right mt-2">
                                            {index > 0 && (
                                                <button type="button" className="btn btn-danger" onClick={() => handleRemove(index)}>Remove</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-primary mt-3" onClick={handleAddMore}>Add More</button>
                                <button type="submit" className="btn btn-md full-width theme-bg text-light rounded ft-medium mt-3" disabled={loading}>
                                    {loading ? 'Loading...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTimingSlot;