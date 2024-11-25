const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    sliderImage: [
        {
            url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        }
    ],
    image: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainCategory',
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    metaKeyword: {
        type: String
    },
    metafocus: {
        type: String
    },
}, { timestamps: true });

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema);
module.exports = ServiceCategory;
