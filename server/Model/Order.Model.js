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
    },
    OrderStatus: {
        type: String,
        enum: ["Pending", 'Vendor Assign', 'Vendor Ready To Go', 'Service Done', 'Cancelled'],
        default: 'Pending'
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    serviceType: {
        type: String,
        required: true
    },
    message: {
        type: String,
    },
    voiceNote: {
        url: {
            type: String,
            required: true // Make URL required
        },
        public_id: {
            type: String,
            required: true // Make public_id required
        }
    }
}, { timestamps: true })

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order