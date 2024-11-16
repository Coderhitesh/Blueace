const mongoose = require('mongoose');

const scheduleMiniSchema = new mongoose.Schema({
    day: { 
        type: String, 
        required: true, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] // Optional: restrict values to valid weekdays
    },
    morningSlot: {
        type: String,
    },
    afternoonSlot: {
        type: String,
    },
    eveningSlot: {
        type: String,
    },
    is_active: { 
        type: Boolean, 
        default: true 
    }
}, { _id: false }); 

const WorkingHoursSchema = new mongoose.Schema({
    schedule: {
        type: [scheduleMiniSchema],
        validate: {
            validator: function(schedules) {
                // Ensure no duplicate day entries in the schedule array
                const days = schedules.map(schedule => schedule.day);
                return new Set(days).size === days.length;
            },
            message: 'Duplicate days are not allowed in the schedule.'
        }
    }
});

const WorkingHours = mongoose.model('WorkingHours', WorkingHoursSchema);
module.exports = WorkingHours;
