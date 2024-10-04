const MainCategory = require('../Model/mainServiceCategory.Model')

exports.createServiceMainCategory = async (req, res) => {
    try {
        const { name } = req.body;
        // console.log('name',name)
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please enter category name'
            })
        }
        const category = await MainCategory.findOne({ name })
        if (category) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            })
        }
        const newCategory = new MainCategory({ name })
        await newCategory.save()
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: newCategory
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error while creating service category',
            error: error.message
        })
    }
}

exports.getAllServiceMainCategory = async (req, res) => {
    try {
        const categories = await MainCategory.find();
        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching service categories',
            error: error.message
        });
    }
}

exports.getSingleServiceMainCategory = async (req, res) => {
    try {
        const id = req.params._id
        const category = await MainCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Category fetched successfully',
            data: category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching service category',
            error: error.message
        });
    }
}

exports.updateServiceMainCategory = async (req, res) => {
    // console.log('i am hit')
    try {
        const id = req.params._id;
        const { name } = req.body;
        console.log('name',name)

        // Validate the input
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid category name',
            });
        }

        // Find the category by ID
        const category = await MainCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Update the category name
        category.name = name.trim(); // Trim whitespace from name

        // Save the updated category
        await category.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while updating service category',
            error: error.message,
        });
    }
};


exports.deleteServiceMainCategory = async (req, res) => {
    try {
        const id = req.params._id
        const category = await MainCategory.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while deleting service category',
            error: error.message
        });
    }
}