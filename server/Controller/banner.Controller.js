const Banner = require('../Model/banner.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../Utils/Cloudnary');
const fs = require('fs').promises;

exports.createBanner = async (req, res) => {
    const uploadedImages = [];
    try {
        const newPromotionalBanner = new Banner({})
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
                message: 'Failed to save promotional banner',
            })
        }
        return res.status(201).json({
            success: true,
            message: 'Promotional banner created successfully',
            data: newPromotionalBanner
        })
    } catch (error) {
        console.log('Internal server error in creating promotional banner', error)

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

exports.getBanner = async (req, res) => {
    try {
        const promotionalBanner = await Banner.find()
        if (!promotionalBanner) {
            return res.status(404).json({
                success: false,
                message: 'No promotional banner found',
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Promotional banner found',
            data: promotionalBanner
        })

    } catch (error) {
        console.log('creating promotional banner error', error)
        res.status(500).json({
            success: false,
            message: 'getting promotional banner error',
            error: error.message
        })

    }
}

exports.getSingleBanner = async (req, res) => {
    try {
        const id = req.params._id;
        const promotionalBanner = await Banner.findById(id)
        if (!promotionalBanner) {
            return res.status(400).json({
                success: false,
                message: 'Promotional banner not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Promotional banner found',
            data: promotionalBanner
        })

    } catch (error) {
        console.log('Internal server error in geting single promotional banner', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in geting single promotional banner',
            error: error.message
        })
    }
}

exports.deleteBanner = async (req, res) => {
    try {
        const id = req.params._id;
        const promotionalBanner = await Banner.findById(id)
        if (promotionalBanner.bannerImage.public_id) {
            await deleteImageFromCloudinary(promotionalBanner.bannerImage.public_id)
        }
        await PromotionalBanner.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Promotional banner deleted',
            data: promotionalBanner
        })
    } catch (error) {
        console.log('Internal server error in deleting promotional banner', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in deleting promotional banner',
            error: error.message
        })
    }
}

exports.updateBanner = async (req, res) => {
    const uploadedImages = [];
    try {
        const id = req.params._id;
        const promotionalBanner = await Banner.findById(id)
        if (!promotionalBanner) {
            return res.status(400).json({
                success: false,
                message: 'Promotional banner not found',
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
                message: 'Failed to update promotional banner',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Promotional banner updated successfully',
            data: promotionalBannerSave
        })

    } catch (error) {
        console.log('Internal server error in updating promotional banner', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in updating promotional banner',
            error: error.message
        })

    }
}

exports.updateBannerActiveStatus = async (req, res) => {
    try {
        const id = req.params._id;
        const { active } = req.body;
        const bannerActiveStatus = await Banner.findById(id);
        if (!bannerActiveStatus) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found',
            })
        }
        bannerActiveStatus.active = active;
        await bannerActiveStatus.save();
        res.status(200).json({
            success: true,
            message: 'Banner active status updated successfully',
        })
    } catch (error) {
        console.log('Internal server error in creating banner', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in creating banner',
            error: error.message
        })
    }
}