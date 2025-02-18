import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function AddTimingSlot({ userData }) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [slots, setSlots] = useState({
    morningSlot: '',
    afternoonSlot: '',
    eveningSlot: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-timing');
      setTimeSlots(res.data.data);
    } catch (error) {
      toast.error('Error loading time slots');
    }
  };

  const handleDayToggle = (day) => {
    setSelectedDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    setSlots(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    setLoading(true);
    try {
      const schedule = selectedDays.map(day => ({
        day,
        ...slots,
        is_active: true
      }));

      await axios.post(
        `https://www.api.blueaceindia.com/api/v1/create-working-hours/${userData?._id}`,
        { schedule },
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast.success('Time slots added successfully');
      setSelectedDays([]);
      setSlots({ morningSlot: '', afternoonSlot: '', eveningSlot: '' });
    } catch (error) {
      toast.error('Error adding time slots');
    }
    setLoading(false);
  };

  return (
    <div className="goodup-dashboard-content">
      <div className="dashboard-tlbar d-block mb-5">
        <h1 className="ft-medium">Add Time Slots</h1>
      </div>

      <div className="dashboard-widg-bar d-block">
        <div className="row">
          <div className="col-xl-12 col-lg-12 bg-white rounded">
            <div className="dashboard-list-wraps-body py-3 px-3">
              <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <div className="col-12">
                    <label className="mb-2">Select Days:</label>
                    <div className="d-flex flex-wrap gap-3">
                      {DAYS.map(day => (
                        <div key={day} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={day}
                            checked={selectedDays.includes(day)}
                            onChange={() => handleDayToggle(day)}
                          />
                          <label className="form-check-label" htmlFor={day}>
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label>Morning Slot:</label>
                    <select
                      className="form-control"
                      name="morningSlot"
                      value={slots.morningSlot}
                      onChange={handleSlotChange}
                      required
                    >
                      <option value="">--Select Morning Slot--</option>
                      {timeSlots.map((slot, index) => (
                        <option key={index} value={slot.time}>{slot.time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Afternoon Slot:</label>
                    <select
                      className="form-control"
                      name="afternoonSlot"
                      value={slots.afternoonSlot}
                      onChange={handleSlotChange}
                      required
                    >
                      <option value="">--Select Afternoon Slot--</option>
                      {timeSlots.map((slot, index) => (
                        <option key={index} value={slot.time}>{slot.time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Evening Slot:</label>
                    <select
                      className="form-control"
                      name="eveningSlot"
                      value={slots.eveningSlot}
                      onChange={handleSlotChange}
                      required
                    >
                      <option value="">--Select Evening Slot--</option>
                      {timeSlots.map((slot, index) => (
                        <option key={index} value={slot.time}>{slot.time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-md full-width theme-bg text-light rounded ft-medium mt-3"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Time Slots'}
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