const mongoose = require('mongoose');

const EstimatedBudget = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    EstimatedTotalPrice: {
        type: Number, 
        required: true
    },
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
    },
    Items: [{
        name: {
            type: String
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        Discount: {
            type: Number,
          
        }
    }],

    statusOfBill:{
        type:Boolean
    },

}, { timestamps: true });

module.exports = mongoose.model('EstimatedBudget', EstimatedBudget);
