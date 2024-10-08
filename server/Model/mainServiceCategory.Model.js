const mongoose = require('mongoose')

const MainCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    }
},{timestamps:true})

const MainCategory = mongoose.model('MainCategory',MainCategorySchema)
module.exports = MainCategory