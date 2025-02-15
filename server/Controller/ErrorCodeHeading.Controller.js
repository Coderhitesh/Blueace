const ErrorCodeHeading = require('../Model/ErrorCodeHeading.Model')

exports.createHeading = async (req, res) => {
    try {
        const { title } = req.body
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            })
        }

        const newHeading = new ErrorCodeHeading({
            title
        })

        await newHeading.save()
        res.status(200).json({
            success: true,
            message: "Heading created successfully",
            data: newHeading
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getAllHeading = async (req, res) => {
    try {
        const getAllHeading = await ErrorCodeHeading.find()
        if (!getAllHeading) {
            return res.status(400).json({
                success: false,
                message: "No heading found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Heading fetched successfully",
            data: getAllHeading
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getHeadingById = async (req, res) => {
    try {
        const { id } = req.params
        const getHeadingById = await ErrorCodeHeading.findById(id)
        if (!getHeadingById) {
            return res.status(400).json({
                success: false,
                message: "Heading not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Heading fetched successfully",
            data: getHeadingById
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updateHeading = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const heading = await ErrorCodeHeading.findById(id);
        if (!heading) {
            return res.status(400).json({
                success: false,
                message: 'Heading not founded'
            })
        }
        heading.title = title;
        await heading.save();
        res.status(200).json({
            success: true,
            message: 'Heading updated successfully',
            data: heading
        })

    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteHeading = async (req, res) => {
    try {
        const { id } = req.params;
        const heading = await ErrorCodeHeading.findByIdAndDelete(id);
        if (!heading) {
            return res.status(400).json({
                success: false,
                message: 'Heading not founded'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Heading deleted successfully',
            data: heading
        })

    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}