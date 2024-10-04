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
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
    }
})

const Service = mongoose.model('Service', serviceSchema)
module.exports = Service;
