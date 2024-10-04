const mongoose = require('mongoose')

const BannerSchema = new mongoose.Schema({
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
        type: Boolean,
        default: true
    }
})

const Banner = mongoose.model('Banner',BannerSchema)
module.exports = Banner;