const Blog = require('../Model/blog.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../Utils/Cloudnary');
const fs = require('fs').promises;

exports.createBlog = async (req, res) => {
    const uploadedImages = [];
    try {
        const { title, content, metaTitle, metaDescription } = req.body;
        const emptyField = [];
        if (!title) emptyField.push('title');
        if (!content) emptyField.push('content');
        if (!metaTitle) emptyField.push('metaTitle');
        if (!metaDescription) emptyField.push('metaDescription');
        if (emptyField.length > 0) {
            return res.status(400).json({
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            })
        }
        const blog = new Blog({
            title,
            content,
            metaTitle,
            metaDescription,
        })
        if (req.files) {
            const { smallImage, largeImage } = req.files;

            if (smallImage && smallImage[0]) {
                const smallImageUrl = await uploadImage(smallImage[0]?.path);
                blog.smallImage = {
                    url: smallImageUrl.image,
                    public_id: smallImageUrl.public_id
                };
                uploadedImages.push(smallImageUrl.public_id);
                await fs.unlink(smallImage[0].path)
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a small image'
                });
            }

            if (largeImage && largeImage[0]) {
                const largeImageUrl = await uploadImage(largeImage[0]?.path);
                blog.largeImage = {
                    url: largeImageUrl.image,
                    public_id: largeImageUrl.public_id
                };
                uploadedImages.push(largeImageUrl.public_id);
                await fs.unlink(largeImage[0].path)
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a small image'
                });
            }

            const saveBlog = await blog.save();
            if (!saveBlog) {
                for (let public_id of uploadedImages) {
                    await deleteImageFromCloudinary(public_id)
                }
            }

            res.status(200).json({
                success: true,
                message: 'Blog created successfully',
                data: saveBlog
            })

        } else {
            return res.status(400).json({
                status: false,
                message: 'Please upload images'
            });
        }
    } catch (error) {
        console.log('Internal server error in creating blog', error)
        for (let public_id of uploadedImages) {
            await deleteImageFromCloudinary(public_id);
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error in creating blog',
            error: error.message
        })
    }
}

exports.getAllBlog = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find().skip(skip).limit(limit);
        const totalBlogs = await Blog.countDocuments();
        if (!blogs) {
            return res.status(400).json({
                success: false,
                message: 'No blogs found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Blogs retrieved successfully',
            data: blogs,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page
        })
    } catch (error) {
        console.log("internal server error in getting blog", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting blog',
            error: error.message
        })
    }
}

exports.getSingleBlog = async (req, res) => {
    try {
        const id = req.params._id;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(400).json({
                success: false,
                message: 'Blog not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Blog retrieved successfully',
            data: blog
        })
    } catch (error) {
        console.log("internal server error in getting blog", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting blog',
            error: error.message
        })
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params._id;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Delete small image from Cloudinary
        if (blog.smallImage && blog.smallImage.public_id) {
            await deleteImageFromCloudinary(blog.smallImage.public_id);
        }

        // Delete large image from Cloudinary
        if (blog.largeImage && blog.largeImage.public_id) {
            await deleteImageFromCloudinary(blog.largeImage.public_id);
        }

        // After images are deleted, delete the blog from the database
        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Blog and associated images deleted successfully',
        });
    } catch (error) {
        console.log('Internal server error in deleting blog', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in deleting blog',
            error: error.message,
        });
    }
};

exports.updateBlog = async (req, res) => {
    const uploadedImages = [];
    try {
        const id = req.params._id;
        const { title, content, metaTitle, metaDescription,slug } = req.body;

        // Find the existing blog by its ID
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Update basic blog fields
        blog.title = title || blog.title;
        blog.slug = slug || blog.slug;
        blog.content = content || blog.content;
        blog.metaTitle = metaTitle || blog.metaTitle;
        blog.metaDescription = metaDescription || blog.metaDescription;

        // Handle image updates
        if (req.files) {
            const { smallImage, largeImage } = req.files;

            // Update small image
            if (smallImage && smallImage[0]) {
                // Delete the previous small image from Cloudinary
                if (blog.smallImage && blog.smallImage.public_id) {
                    await deleteImageFromCloudinary(blog.smallImage.public_id);
                }

                // Upload the new small image
                const smallImageUrl = await uploadImage(smallImage[0]?.path);
                blog.smallImage = {
                    url: smallImageUrl.image,
                    public_id: smallImageUrl.public_id,
                };
                uploadedImages.push(smallImageUrl.public_id);
                await fs.unlink(smallImage[0].path);
            }

            // Update large image
            if (largeImage && largeImage[0]) {
                // Delete the previous large image from Cloudinary
                if (blog.largeImage && blog.largeImage.public_id) {
                    await deleteImageFromCloudinary(blog.largeImage.public_id);
                }

                // Upload the new large image
                const largeImageUrl = await uploadImage(largeImage[0]?.path);
                blog.largeImage = {
                    url: largeImageUrl.image,
                    public_id: largeImageUrl.public_id,
                };
                uploadedImages.push(largeImageUrl.public_id);
                await fs.unlink(largeImage[0].path);
            }
        }

        // Save the updated blog
        const updatedBlog = await blog.save();
        if (!updatedBlog) {
            // If saving fails, delete newly uploaded images
            for (let public_id of uploadedImages) {
                await deleteImageFromCloudinary(public_id);
            }
            return res.status(500).json({
                success: false,
                message: 'Failed to update blog',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog,
        });
    } catch (error) {
        console.log('Internal server error in updating blog', error);
        // Delete any newly uploaded images if there is an error
        for (let public_id of uploadedImages) {
            await deleteImageFromCloudinary(public_id);
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error in updating blog',
            error: error.message,
        });
    }
};

exports.updateBlogIsTranding = async (req, res) => {
    const { isTranding } = req.body;
    try {
        const blog = await Blog.findById(req.params._id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        blog.isTranding = isTranding; // Update the isTranding value
        await blog.save();
        res.status(200).json({ success: true, message: 'Blog updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Validate the slug parameter
        if (!slug || !slug.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog slug provided',
            });
        }

        // Query the database explicitly by the slug field
        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog found',
            data: blog,
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
