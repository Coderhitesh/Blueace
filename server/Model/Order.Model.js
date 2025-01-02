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
        type: String,
        default: 'Pending',
        enum: ['Pending','Send Request', 'Accepted','Reject']
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
    pinCode: {
        type: String,
        match: [/^\d{6}$/, 'Please enter a valid PinCode with 6 digits']
    },
    houseNo: {
        type: String,
        // required: true
    },
    address: {
        type: String,
        required: true
    },

    nearByLandMark: {
        type: String,
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
    EstimatedBill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EstimatedBudget'
    },
    orderTime: {
        type: Date
    },
    beforeWorkVideo: {
        url: {
            type: String,
            // required: true
        },
        public_id: {
            type: String,
            // required: true
        },
    },
    afterWorkVideo: {
        url: {
            type: String,
            // required: true
        },
        public_id: {
            type: String,
            // required: true
        },
    },
    AllowtedVendorMember: {
        type: String
    },
    workingDay: {
        type: String
    },
    workingTime: {
        type: String
    },
    totalAmount:{
        type: Number
    },
    commissionPercent: {
        type: Number
    },
    vendorCommissionAmount: {
        type: Number
    },
    adminCommissionAmount: {
        type: Number
    },
    transactionId: {
        type: String
    },
    PaymentStatus:{
        type:String,
        default:'pending',
    },
    paymentMethod:{
        type:String
    },
    razorpayOrderId: {
        type: String
    },
    VendorAllotedBoolean:{
        type:Boolean,
        default:false
    },
    workingDate: {
        type: Date
    }
}, { timestamps: true })

OrderSchema.index({ 'RangeWhereYouWantService.location': '2dsphere' });

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order