const mongoose = require('mongoose')

const GalleryCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const GalleryCategory = mongoose.model('GalleryCategory',GalleryCategorySchema)
module.exports = GalleryCategory