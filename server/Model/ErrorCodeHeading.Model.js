const mongoose = require('mongoose')

const ErrorCodeHeadingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})

const ErrorCodeHeading = mongoose.model('ErrorCodeHeading', ErrorCodeHeadingSchema)
module.exports = ErrorCodeHeading