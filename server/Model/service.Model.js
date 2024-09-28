const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    serviceImage: {
        url:{
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
        }
    },
    serviceBanner: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    }
})

const Service = mongoose.model('Service', serviceSchema)
module.exports = Service;
