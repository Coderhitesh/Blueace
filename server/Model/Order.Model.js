const mongoose = require('mongoose')

const rangeSchema = new mongoose.Schema({
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
})

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
        enum: ["Pending", 'Vendor Assigned', 'Service Done', 'Cancelled'],
        default: 'Pending'
    },
    VendorAllotedTime: {
        type: String
    },
    VendorAllotedStatus: {
        type: Boolean,
        default: false
    },
    fullName: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    phoneNumber: {
        type: Number,
        // required: true
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
            // required: true // Make URL required
        },
        public_id: {
            type: String,
            // required: true // Make public_id required
        }
    },

    city: {
        type: String,
    },

    pinCode: {
        type: String,
        match: [/^\d{6}$/, 'Please enter a valid PinCode with 6 digits']
    },

    houseNo: {
        type: String,
        // required: true
    },

    street: {
        type: String,
        // required: true
    },

    nearByLandMark: {
        type: String,
        // required: true
    },

    RangeWhereYouWantService: [
        rangeSchema
    ],
    beforeWorkImage: {
        url: {
            type: String,
            // required: true
        },
        public_id: {
            type: String,
            // required: true
        }
    },
    afterWorkImage: {
        url: {
            type: String,
            // required: true
        },
        public_id: {
            type: String,
            // required: true
        },
        
       
    },
    EstimatedBill:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'EstimatedBudget'
    },
    orderTime: {
        type: Date
    }
}, { timestamps: true })

OrderSchema.index({ 'RangeWhereYouWantService.location': '2dsphere' });

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order