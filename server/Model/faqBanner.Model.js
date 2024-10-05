const mongoose = require('mongoose')

const faqBannerSchema = new mongoose.Schema({
    bannerImage: {
        url:{
            type:String,
            required:true
        },
        public_id:{
            type:String,
            required: true
        }
    },
    active: {
        type:Boolean,
        default: true
    }
})

const FaqBanner = mongoose.model('FaqBanner', faqBannerSchema)
module.exports = FaqBanner;
