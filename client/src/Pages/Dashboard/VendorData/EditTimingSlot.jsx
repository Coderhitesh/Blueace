import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function EditTimingSlot({ userData }) {
    const vendorId = userData?._id;
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allTimeSlot, setAllTimeSlot] = useState([]);

    // Fetch Existing Schedule
    const fetchExistingSchedule = async () => {
        try {
            const res = await axios.get(`https://www.api.blueaceindia.com/api/v1/get-single-working-hours/${vendorId}`);
            if (res.data?.data?.schedule?.length > 0) {
                setFormData(res.data.data.schedule); // Pre-populate with existing schedule
            } else {
                setFormData([{ day: '', morningSlot: '', afternoonSlot: '', eveningSlot: '', is_active: true }]);
                toast.error("No schedules found");
            }
        } catch (error) {
            console.error("Error fetching existing schedule:", error);
            toast.error('Error fetching existing schedule');
        }
    };

    // Fetch Time Slots
    const handleFetchTimeSlot = async () => {
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-timing');
            setAllTimeSlot(res.data.data);
        } catch (error) {
            console.error("Error in getting time slots:", error);
            toast.error('Error in getting time slots');
        }
    };

    // Handle Change
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedFormData = [...formData];
        updatedFormData[index][name] = value;
        setFormData(updatedFormData);
    };

    // Add More Schedule
    const handleAddMore = () => {
        setFormData([...formData, { day: '', morningSlot: '', afternoonSlot: '', eveningSlot: '', is_active: true }]);
    };

    // Remove Schedule
    const handleRemove = (index) => {
        const updatedFormData = formData.filter((_, i) => i !== index);
        setFormData(updatedFormData);
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`https://www.api.blueaceindia.com/api/v1/update-working-hours/${vendorId}`, { schedule: formData }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Schedule Updated Successfully');
        } catch (error) {
            console.error("Error updating schedule:", error);
            toast.error('Internal server error');
        }
        setLoading(false);
    };

    useEffect(() => {
        handleFetchTimeSlot();
        fetchExistingSchedule();
    }, []);

    return (
        <div className="goodup-dashboard-content">
            <div className="dashboard-tlbar d-block mb-5">
                <h1 className="ft-medium">Edit Time Slots</h1>
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
                                                className="form-control mt-1"
                                                name="day"
                                                value={schedule.day}
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
                                                className="form-control"
                                                name="morningSlot"
                                                value={schedule.morningSlot}
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            >
                                                <option value={''}>--Morning Slot--</option>
                                                {allTimeSlot.map((item, idx) => (
                                                    <option key={idx} value={item.time}>{item.time}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-6 mt-2">
                                            <label>Afternoon Slot:</label>
                                            <select
                                                className="form-control"
                                                name="afternoonSlot"
                                                value={schedule.afternoonSlot}
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            >
                                                <option value={''}>--Afternoon Slot--</option>
                                                {allTimeSlot.map((item, idx) => (
                                                    <option key={idx} value={item.time}>{item.time}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-6 mt-2">
                                            <label>Evening Slot:</label>
                                            <select
                                                className="form-control"
                                                name="eveningSlot"
                                                value={schedule.eveningSlot}
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            >
                                                <option value={''}>--Evening Slot--</option>
                                                {allTimeSlot.map((item, idx) => (
                                                    <option key={idx} value={item.time}>{item.time}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-12 mt-2">
                                            {index > 0 && (
                                                <button type="button" className="btn btn-danger" onClick={() => handleRemove(index)}>Remove</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-primary mt-3" onClick={handleAddMore}>Add More</button>
                                <button type="submit" className="btn btn-md full-width theme-bg text-light rounded ft-medium mt-3" disabled={loading}>
                                    {loading ? 'Loading...' : 'Update Schedule'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditTimingSlot;
