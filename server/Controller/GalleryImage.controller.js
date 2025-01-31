const GalleryImage = require('../Model/GalleryImage.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../Utils/Cloudnary');
const fs = require('fs');

exports.createGalleryImage = async (req, res) => {
    try {
        // console.log(req.file)
        const { galleryCategoryId } = req.body;
        if (!galleryCategoryId) {
            return res.status(400).json({
                status: false,
                message: "Gallery Category Id is required"
            })
        }
        const newGalleryImage = new GalleryImage({
            galleryCategoryId
        })

        if (req.file) {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            newGalleryImage.image.url = image;
            newGalleryImage.image.public_id = public_id;
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.log('Error deleting file from local storage', error)
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please upload a Gallery image',
            })
        }
        // console.log(req.body)
        const saveNewGalleryImage = await newGalleryImage.save();
        if (!saveNewGalleryImage) {
            await deleteImageFromCloudinary(saveNewGalleryImage.image.public_id)
            return res.status(400).json({
                success: false,
                message: 'Failed to save Gallery Image',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Gallery Image saved successfully',
            data: saveNewGalleryImage
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error creating gallery image'
        })
    }
}

exports.getSingleGalleryImage = async (req, res) => {
    try {
        const id = req.params._id
        const galleryImage = await GalleryImage.findById(id).populate('galleryCategoryId')
        // const galleryImage = await GalleryImage.findById(id)
        if (!galleryImage) {
            return res.status(404).json({
                success: false,
                message: 'Single Gallery Image not found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Single Gallery Image founded',
            data: galleryImage
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'internal server error in geting single gallery image'
        })
    }
}

exports.getAllGalleryImage = async (req, res) => {
    try {
        const allImage = await GalleryImage.find().populate('galleryCategoryId')
        if (!allImage) {
            return res.status(404).json({
                success: false,
                message: 'No Gallery Image found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Gallery Image founded',
            data: allImage
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'internal server error in getting all gallery image'
        })
    }
}

exports.deleteGalleryImage = async (req, res) => {
    try {
        const id = req.params._id;

        // Find the gallery image by ID
        const galleryImage = await GalleryImage.findById(id);
        if (!galleryImage) {
            return res.status(404).json({
                success: false,
                message: 'Gallery Image not found',
            });
        }

        // Check if there's an associated image and delete it from Cloudinary
        if (galleryImage.image && galleryImage.image.public_id) {
            try {
                await deleteImageFromCloudinary(galleryImage.image.public_id);
            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete image from Cloudinary',
                });
            }
        }

        // Delete the gallery image from the database
        await galleryImage.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Gallery Image deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting gallery image',
        });
    }
};


exports.updateGalleryImage = async (req, res) => {
    try {
        const id = req.params._id;
        const { galleryCategoryId } = req.body;

        // Find the gallery image by ID
        const galleryImage = await GalleryImage.findById(id);
        if (!galleryImage) {
            return res.status(404).json({
                success: false,
                message: 'Gallery Image not found',
            });
        }

        // Update the gallery category if provided
        if (galleryCategoryId) {
            galleryImage.galleryCategoryId = galleryCategoryId;
        }

        // Handle image update if a new file is provided
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (galleryImage.image && galleryImage.image.public_id) {
                try {
                    await deleteImageFromCloudinary(galleryImage.image.public_id);
                } catch (error) {
                    console.error('Error deleting old image from Cloudinary:', error);
                }
            }

            // Upload new image to Cloudinary
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            galleryImage.image = { url: image, public_id };

            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error('Error deleting local image file:', error);
            }
        }

        // Save the updated gallery image
        await galleryImage.save();

        res.status(200).json({
            success: true,
            message: 'Gallery Image updated successfully',
            data: galleryImage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating gallery image',
        });
    }
};
