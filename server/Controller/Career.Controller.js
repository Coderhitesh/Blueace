const Career = require('../Model/Career.model');

// Create a Career
exports.createCareer = async (req, res) => {
    try {
        let { title, description, points,noOfVacancy } = req.body; // Use `let` instead of `const`
        // console.log("req.body", req.body);

        if (!title || !description || !points || !noOfVacancy) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
                error: 'All fields are required.'
            });
        }

        // Convert points to an array if it's a string
        if (typeof points === 'string') {
            points = points.split(',').map(point => point.trim());
        }

        const career = new Career({ title, description, points, noOfVacancy});
        await career.save();
        res.status(201).json({
            success: true,
            message: 'Career created successfully',
            career
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating career',
            error: error.message
        });
    }
};


// In your Career controller or route handler
exports.getAllCareers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const careers = await Career.find()
            .skip((page - 1) * limit) // Skip the records of previous pages
            .limit(Number(limit));  // Limit the number of records per page
        
        const totalCareers = await Career.countDocuments(); // Get total number of careers

        res.status(200).json({
            success: true,
            data: careers,
            totalCareers,
            currentPage: page,
            totalPages: Math.ceil(totalCareers / limit),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching careers', error: error.message });
    }
};


// Get a single Career by ID
exports.getCareerById = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career not found',
                error: error.message
            });
        }
        res.status(200).json({
            success: true,
            message: 'Career retrieved successfully',
            data: career
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching careers',
            error: error.message
        });
    }
};

// Update a Career by ID
exports.updateCareer = async (req, res) => {
    try {
        let { title, description, points, noOfVacancy } = req.body; // Use `let` for reassignment if needed

        if (!title || !description || !points || !noOfVacancy) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
                error: 'All fields are required.'
            });
        }

        // Convert points to an array if it's a string
        if (typeof points === 'string') {
            points = points.split(',').map(point => point.trim());
        }

        const career = await Career.findByIdAndUpdate(
            req.params.id,
            { title, description, points, noOfVacancy },
            { new: true, runValidators: true }
        );

        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Career updated successfully',
            data: career
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating career',
            error: error.message
        });
    }
};

// Delete a Career by ID
exports.deleteCareer = async (req, res) => {
    try {
        const career = await Career.findByIdAndDelete(req.params.id);
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career not found',
                error: error.message
            });
        }
        res.status(200).json({
            success: true,
            message: 'Career deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting career',
            error: error.message
        });
    }
};
