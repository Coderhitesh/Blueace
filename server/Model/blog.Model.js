const mongoose = require('mongoose')

const BlogModel = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    smallImage: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    largeImage: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    content: {
        type: String,
        required: true
    },
    metaTitle:{
        type: String,
        required: true
    },
    metaDescription:{
        type: String,
        required: true
    },
    isTranding: {
        type: Boolean,
        default: false
    }
},{timestamps:true})

const Blog = mongoose.model('Blog', BlogModel)
module.exports = Blog;