const mongoose = require('mongoose')

const WithDrawSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Types.ObjectId,
        res: 'Vendor'
    },
    amount: {
        type: Number,
        required: true
    },
    status:{
        type:String,
        default: 'Pending',
        enum: ['Pending','Approved','Rejected'],
        required: true
    }
})

const WithDraw = mongoose.model('WithDraw',WithDrawSchema)
module.exports = WithDraw;