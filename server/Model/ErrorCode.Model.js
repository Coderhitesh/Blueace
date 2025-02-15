const mongoose = require('mongoose')

const ErrorCodeSchema = new mongoose.Schema({
    Heading: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ErrorCodeHeading'
    },
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    note: [{
        type: String
    }]
})

const ErrorCode = mongoose.model('ErrorCode',ErrorCodeSchema)
module.exports = ErrorCode