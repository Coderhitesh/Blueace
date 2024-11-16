const mongoose = require('mongoose')

const SlotTimingSchema = new mongoose.Schema({
    time: {
        type: String,
        require: true
    }
})

const SlotTiming = mongoose.model('SlotTiming',SlotTimingSchema)
module.exports = SlotTiming