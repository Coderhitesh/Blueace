const mongoose = require('mongoose');

// Define the VendorRatingSchema
const VendorRatingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, 
    },
    review: {
        type: String,
        required: true,
        trim: true,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true, 
});

const VendorRating = mongoose.model('VendorRating', VendorRatingSchema);

module.exports = VendorRating;
