const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Employee','Vendor']
    },
    percent: {
        type: String,
        required: true
    }
})

const Commission = mongoose.model('Commission',commissionSchema)
module.exports = Commission;