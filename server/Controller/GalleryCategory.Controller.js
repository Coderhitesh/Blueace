const GalleryCategory = require('../Model/GalleryCategory.Model')

exports.createGalleryCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Please enter name' })
        }
        // const imageCategory = await ImageCategory.create({name})
        const category = new GalleryCategory({ name })
        await category.save()
        res.status(201).json({
            success: true,
            message: 'Gallery Category created successfully',
            data: category
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to create Gallery category"
        })
    }
}

exports.getAllImageCategory = async (req, res) => {
    try {
        const allGalleryCategory = await GalleryCategory.find();
        if (!allGalleryCategory) {
            return res.status(404).json({
                success: false,
                message: 'No Gallery Category found'

            })
        }
        res.status(200).json({
            success: true,
            message: 'Gallery category founded',
            data: allGalleryCategory
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to get all Gallery categories"
        })
    }
}

exports.singleGalleryCategory = async (req, res) => {
    try {
        const id = req.params._id
        const singleGalleryCategoryname = await GalleryCategory.findById(id)
        if (!singleGalleryCategoryname) {
            return res.status(404).json({
                success: false,
                message: 'Gallery Category not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Gallery category founded',
            data: singleGalleryCategoryname
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to get single Gallery category"
        })
    }
}

exports.deleteGalleryCategory = async (req, res) => {
    try {
        const id = req.params._id
        const deleteGalleryCategory = await GalleryCategory.findByIdAndDelete(id)
        if (!deleteGalleryCategory) {
            return res.status(404).json({
                success: false,
                message: 'Gallery Category not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Gallery category deleted',
            data: deleteGalleryCategory
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'facing internal server error in deleting gallery category'
        })
    }
}

exports.updateGalleryCategory = async (req, res) => {
    try {
        const id = req.params._id;
        const { name } = req.body;

        // Check if ID and name are provided
        if (!id || !name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both category ID and name'
            });
        }

        // Find the category by ID and update
        const category = await GalleryCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Update the name
        category.name = name;
        await category.save();

        res.status(200).json({
            success: true,
            message: 'Gallery Category updated successfully',
            data: category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update Gallery category"
        });
    }
}
