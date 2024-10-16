const mongoose = require('mongoose')

const offerMiniSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

const MembershipPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    offer: [offerMiniSchema]
},{timestamps:true})

const MembershipPlan = mongoose.model('MembershipPlan', MembershipPlanSchema)
module.exports = MembershipPlan