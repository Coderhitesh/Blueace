const mongoose = require('mongoose')

const CareerInquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    resume: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Career',
        required: true
    }
})

const CareerInquiry = mongoose.model('CareerInquiry', CareerInquirySchema)
module.exports = CareerInquiry