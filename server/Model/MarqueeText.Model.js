const mongoose = require('mongoose')

const marqueeTextSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    }
},{timestamps:true})

const MarqueeText = mongoose.model('MarqueeText',marqueeTextSchema)
module.exports = MarqueeText