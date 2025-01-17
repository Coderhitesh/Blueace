const mongoose = require('mongoose');
const slugify = require('slugify'); 

const BlogModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    smallImage: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    largeImage: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    content: {
        type: String,
        required: true,
    },
    metaTitle: {
        type: String,
        required: true,
    },
    metaDescription: {
        type: String,
        required: true,
    },
    isTranding: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

BlogModel.pre('save', function (next) {
    if (this.isModified('title')) { // Check if 'title' has been modified
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
        });
    }
    next();
});



const Blog = mongoose.model('Blog', BlogModel);
module.exports = Blog;
