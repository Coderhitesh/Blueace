const FAQBanner = require('../Model/faqBanner.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../Utils/Cloudnary');
const fs = require('fs').promises;

exports.createFAQBanner = async (req, res) => {
    const uploadedImages = [];
    try {
        const newPromotionalBanner = new FAQBanner({})
        if (req.file) {
            const imgUrl = await uploadImage(req.file.path)
            const { image, public_id } = imgUrl;
            newPromotionalBanner.bannerImage.url = image;
            newPromotionalBanner.bannerImage.public_id = public_id;
            uploadedImages.push(newPromotionalBanner.bannerImage.public_id)
            try {
                fs.unlink(req.file.path)
            } catch (error) {
                console.log('Error in deleting file form local storage')
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image',
            })
        }
        const newPromotionalBannerSave = await newPromotionalBanner.save()
        if (!newPromotionalBannerSave) {
            if (newPromotionalBanner.bannerImage.public_id) {
                await deleteImageFromCloudinary(newPromotionalBanner.bannerImage.public_id)
            }
            return res.status(400).json({
                success: false,
                message: 'Failed to save faq banner',
            })
        }
        return res.status(201).json({
            success: true,
            message: 'FAQ banner created successfully',
            data: newPromotionalBanner
        })
    } catch (error) {
        console.log('Internal server error in creating faq banner', error)

        if (uploadedImages) {
            deleteImageFromCloudinary(uploadedImages)
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.getFAQBanner = async (req, res) => {
    try {
        const promotionalBanner = await FAQBanner.find()
        if (!promotionalBanner) {
            return res.status(404).json({
                success: false,
                message: 'No faq banner found',
            })
        }
        return res.status(200).json({
            success: true,
            message: 'faq banner found',
            data: promotionalBanner
        })

    } catch (error) {
        console.log('creating faq banner error', error)
        res.status(500).json({
            success: false,
            message: 'getting faq banner error',
            error: error.message
        })

    }
}

exports.getSingleFAQBanner = async (req, res) => {
    try {
        const id = req.params._id;
        const promotionalBanner = await FAQBanner.findById(id)
        if (!promotionalBanner) {
            return res.status(400).json({
                success: false,
                message: 'faq banner not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'faq banner found',
            data: promotionalBanner
        })

    } catch (error) {
        console.log('Internal server error in geting single faq banner', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in geting single faq banner',
            error: error.message
        })
    }
}

exports.deleteFAQBanner = async (req, res) => {
    try {
        const id = req.params._id;
        const promotionalBanner = await FAQBanner.findById(id)
        if (promotionalBanner.bannerImage.public_id) {
            await deleteImageFromCloudinary(promotionalBanner.bannerImage.public_id)
        }
        await FAQBanner.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'faq banner deleted',
            data: promotionalBanner
        })
    } catch (error) {
        console.log('Internal server error in deleting faq banner', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in deleting faq banner',
            error: error.message
        })
    }
}

exports.updateFAQBanner = async (req, res) => {
    const uploadedImages = [];
    try {
        const id = req.params._id;
        const promotionalBanner = await FAQBanner.findById(id)
        if (!promotionalBanner) {
            return res.status(400).json({
                success: false,
                message: 'faq banner not found',
            })
        }

        if (req.file) {
            await deleteImageFromCloudinary(promotionalBanner.bannerImage.public_id)
            const imgUrl = await uploadImage(req.file.path)
            const { image, public_id } = imgUrl;
            promotionalBanner.bannerImage.url = image;
            promotionalBanner.bannerImage.public_id = public_id;
            uploadedImages.push = promotionalBanner.bannerImage.public_id
            try {
                fs.unlink(req.file.path)
            } catch (error) {
                console.log('Error in deleting file from local', error)
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'No image uploaded',
            })
        }

        const promotionalBannerSave = await promotionalBanner.save();
        if (!promotionalBannerSave) {
            await deleteImageFromCloudinary(promotionalBanner.bannerImage.public_id)
            return res.status(400).json({
                success: false,
                message: 'Failed to update faq banner',
            })
        }
        res.status(200).json({
            success: true,
            message: 'faq banner updated successfully',
            data: promotionalBannerSave
        })

    } catch (error) {
        console.log('Internal server error in updating faq banner', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in updating faq banner',
            error: error.message
        })

    }
}