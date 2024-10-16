const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    vendorAlloted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    }
})

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order