const mongoose = require('mongoose')

const promotionalBannerSchema = new mongoose.Schema({
    bannerImage: {
        url:{
            type:String,
            required:true
        },
        public_id:{
            type:String,
            required: true
        }
    }
})

const PromotionalBanner = mongoose.model('PromotionalBanner', promotionalBannerSchema)
module.exports = PromotionalBanner;
