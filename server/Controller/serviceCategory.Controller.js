const Category = require('../Model/serviceCategoty.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../Utils/Cloudnary');
const fs = require('fs').promises;

exports.createServiceCategory = async (req, res) => {
    const uploadedImages = [];
    try {
        // console.log("i am hit")
        const { name, description, mainCategoryId, metaTitle, metaDescription, metaKeyword, metafocus } = req.body;
        // console.log(req.body)

        // Check for missing fields
        let emptyField = [];
        if (!name) emptyField.push('name');
        if (!description) emptyField.push('description');
        if (!mainCategoryId) emptyField.push('mainCategoryId');
        if (emptyField.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        const newCategory = new Category({ name, description, mainCategoryId, metaTitle, metaDescription, metaKeyword, metafocus });

        if (req.files) {
            const { sliderImage, icon, image } = req.files;
            // console.log('sliderImage', sliderImage)
            // console.log('icon', icon)

            // Handle multiple slider images
            if (sliderImage && sliderImage.length > 0) {
                const uploadedSliderImages = [];
                for (let img of sliderImage) {
                    const imgUrl = await uploadImage(img.path); // Upload image
                    uploadedSliderImages.push({
                        url: imgUrl.image,
                        public_id: imgUrl.public_id
                    });
                    // console.log(imgUrl)
                    uploadedImages.push(imgUrl.public_id); // Store the Cloudinary public_id for cleanup
                    await fs.unlink(img.path); // Delete local file
                }
                newCategory.sliderImage = uploadedSliderImages;
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'Please upload slider images'
                });
            }

            // Handle icon upload
            if (icon && icon[0]) {
                const iconUrl = await uploadImage(icon[0]?.path); // Upload icon
                newCategory.icon = {
                    url: iconUrl.image,
                    public_id: iconUrl.public_id
                };
                // console.log("iconUrl", iconUrl)
                uploadedImages.push(iconUrl.public_id); // Store for cleanup if needed
                await fs.unlink(icon[0].path); // Delete local icon file
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'Please upload an icon'
                });
            }

            // Handle image upload
            if (image && image[0]) {
                console.log("image", image)
                const imageUrl = await uploadImage(image[0]?.path); // Upload image
                newCategory.image = {
                    url: imageUrl.image,
                    public_id: imageUrl.public_id
                };
                // console.log("imageUrl", imageUrl)
                uploadedImages.push(imageUrl.public_id); // Store for cleanup if needed
                await fs.unlink(image[0].path); // Delete local image file
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'Please upload an image'
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: 'Please upload images and image'
            });
        }

        const savedCategory = await newCategory.save();

        if (!savedCategory) {
            for (let public_id of uploadedImages) {
                await deleteImageFromCloudinary(public_id)
            }
        }

        res.status(200).json({
            success: true,
            message: 'Category created successfully',
            data: savedCategory
        });

    } catch (error) {
        console.log('Error in create service category:', error);

        // Cleanup: Delete uploaded images from Cloudinary
        for (let public_id of uploadedImages) {
            await deleteImageFromCloudinary(public_id);
        }

        res.status(500).json({
            success: false,
            message: 'Internal Server Error in create service category',
            error: error.message
        });
    }
};

exports.getServiceCategory = async (req, res) => {
    try {
        const allServiceCategory = await Category.find().populate('mainCategoryId');
        if (!allServiceCategory) {
            return res.status(400).json({
                success: false,
                message: 'No categories found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            data: allServiceCategory
        });
    } catch (error) {
        console.log('error in geting service category', error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in getting service category',
            error: error.message
        })
    }
}

exports.getSingleServiceCategroy = async (req, res) => {
    try {
        const id = req.params._id;
        const singleServiceCategory = await Category.findById(id).populate('mainCategoryId');
        if (!singleServiceCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category not found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            data: singleServiceCategory
        });

    } catch (error) {
        console.log('Internal server error in getting single service category', error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in getting single service category',
            error: error.message
        })
    }
}

exports.getServiceCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const searchName = name.trim().toLowerCase();  // Convert input to lowercase

        // Perform a case-insensitive search using regex
        const serviceCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${searchName}$`, 'i') }
        }).populate('mainCategoryId');

        if (!serviceCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            data: serviceCategory
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in finding single service category by name',
            error: error.message
        });
    }
};


exports.deleteServiceCategory = async (req, res) => {
    try {
        const id = req.params._id;

        // Find the category by ID
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Delete all associated images from Cloudinary
        const { sliderImage, icon } = category;

        // Deleting slider images from Cloudinary
        if (sliderImage && sliderImage.length > 0) {
            for (let img of sliderImage) {
                await deleteImageFromCloudinary(img.public_id);
            }
        }

        // Deleting icon image from Cloudinary
        if (icon && icon.public_id) {
            await deleteImageFromCloudinary(icon.public_id);
        }

        // Delete the category from the database
        await Category.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });

    } catch (error) {
        console.log('Error in delete service category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in delete service category',
            error: error.message
        });
    }
};

exports.updateServiceCategory = async (req, res) => {
    const uploadedImages = [];
    try {
        const id = req.params._id;
        const { name, description, mainCategoryId, metaTitle, metaDescription, metaKeyword, metafocus } = req.body;

        // Check for missing fields
        let emptyField = [];
        if (!name) emptyField.push('name');
        if (!description) emptyField.push('description');
        if (!mainCategoryId) emptyField.push('mainCategoryId');
        if (emptyField.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        // Find the existing category
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Update category fields
        existingCategory.name = name;
        existingCategory.description = description;
        existingCategory.mainCategoryId = mainCategoryId;
        existingCategory.metaTitle = metaTitle;
        existingCategory.metaDescription = metaDescription;
        existingCategory.metaKeyword = metaKeyword;
        existingCategory.metafocus = metafocus;

        if (req.files) {
            const { sliderImage, icon, image } = req.files;

            // Handle slider images update
            if (sliderImage && sliderImage.length > 0) {
                // Delete old slider images from Cloudinary
                if (existingCategory.sliderImage) {
                    for (let img of existingCategory.sliderImage) {
                        await deleteImageFromCloudinary(img.public_id);
                    }
                }

                const uploadedSliderImages = [];
                for (let img of sliderImage) {
                    const imgUrl = await uploadImage(img.path); // Upload image
                    uploadedSliderImages.push({
                        url: imgUrl.image,
                        public_id: imgUrl.public_id
                    });
                    uploadedImages.push(imgUrl.public_id); // Store the Cloudinary public_id for cleanup
                    await fs.unlink(img.path); // Delete local file
                }
                existingCategory.sliderImage = uploadedSliderImages;
            }

            // Handle icon update
            if (icon && icon[0]) {
                // Delete old icon from Cloudinary
                if (existingCategory.icon && existingCategory.icon.public_id) {
                    await deleteImageFromCloudinary(existingCategory.icon.public_id);
                }

                const iconUrl = await uploadImage(icon[0]?.path); // Upload icon
                existingCategory.icon = {
                    url: iconUrl.image,
                    public_id: iconUrl.public_id
                };
                uploadedImages.push(iconUrl.public_id); // Store for cleanup if needed
                await fs.unlink(icon[0].path); // Delete local icon file
            }

            // Handle image update
            if (image && image[0]) {
                // Delete old image from Cloudinary
                if (existingCategory.image && existingCategory.image.public_id) {
                    await deleteImageFromCloudinary(existingCategory.image.public_id);
                }

                const imageUrl = await uploadImage(image[0]?.path); // Upload image
                existingCategory.image = {
                    url: imageUrl.image,
                    public_id: imageUrl.public_id
                };
                uploadedImages.push(imageUrl.public_id); // Store for cleanup if needed
                await fs.unlink(image[0].path); // Delete local icon file
            }
        }

        // Save updated category
        const updatedCategory = await existingCategory.save();
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });

    } catch (error) {
        console.log('Error in update service category:', error);

        // Cleanup: Delete uploaded images from Cloudinary if any were uploaded during the process
        for (let public_id of uploadedImages) {
            await deleteImageFromCloudinary(public_id);
        }

        res.status(500).json({
            success: false,
            message: 'Internal Server Error in update service category',
            error: error.message
        });
    }
};

exports.updateIsPopular = async (req, res) => {
    try {
        const id = req.params._id;
        const isPopular = req.body.isPopular;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
                error: 'Category not found'
            });
        }
        category.isPopular = isPopular;
        await category.save();
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        console.log("Internal server error in updateIsPopular service");
        res.status(500).json({
            success: false,
            message: "Internal server error in updateIsPopular service",
            error: error.message
        })
    }
}