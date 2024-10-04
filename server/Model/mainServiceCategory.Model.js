const mongoose = require('mongoose')

const MainCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
},{timestamps:true})

const MainCategory = mongoose.model('MainCategory',MainCategorySchema)
module.exports = MainCategory