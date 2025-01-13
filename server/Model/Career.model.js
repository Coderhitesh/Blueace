const mongoose = require('mongoose')

const careerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    points: [{
        type: String,
        required: true
    }],
    noOfVacancy: {
        type: Number,
        required: true
    }
})

const Career = mongoose.model('Career', careerSchema)
module.exports = Career;