const mongoose = require('mongoose')

const serviceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    iconImage: {
        url:{
            type: String,
            required: true
        },
        
    }
})