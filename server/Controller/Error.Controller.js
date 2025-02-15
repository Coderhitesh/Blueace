const ErrorCode = require('../Model/ErrorCode.Model')

exports.createErrorCode = async (req, res) => {
    try {
        const { Heading, code, description, note } = req.body;

        // Array to track missing fields
        const emptyField = [];

        // Check for missing required fields
        if (!Heading) emptyField.push('Heading');
        if (!code) emptyField.push('Code');
        if (!description) emptyField.push('Description');

        // Return a message if there are missing fields
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        // If note is provided as a string, convert it into an array
        const formattedNote = note ? note.split(',').map(item => item.trim()) : [];

        // Create a new ErrorCode object
        const newErrorCode = new ErrorCode({
            Heading,
            code,
            description,
            note: formattedNote  // Save note as an array
        });

        // Save the new error code in the database
        await newErrorCode.save();

        // Send success response
        res.status(200).json({
            success: true,
            message: "Error code created successfully",
            data: newErrorCode
        });
    } catch (error) {
        console.log("Internal server error in creating error code:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error in creating error code",
            error: error.message
        });
    }
};

exports.getAllErrorCode = async (req, res) => {
    try {
        const errorCodes = await ErrorCode.find().populate('Heading');
        res.status(200).json({
            success: true,
            message: "Error codes fetched successfully",
            data: errorCodes
        })
    } catch (error) {
        console.log("Internal server error in getting all error codes", error)
        res.status(500).json({
            success: false,
            message: "Internal server error in getting all error codes",
            error: error.message
        })
    }
}

exports.getErrorCodeById = async (req, res) => {
    try {
        const { id } = req.params;
        const errorCode = await ErrorCode.findById(id).populate('Heading');
        if (!errorCode) {
            return res.status(404).json({
                success: false,
                message: "Error code not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Error code fetched successfully",
            data: errorCode
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

exports.deleteErrorCode = async (req, res) => {
    try {
        const { id } = req.params;
        const errorCode = await ErrorCode.findByIdAndDelete(id);
        if (!errorCode) {
            return res.status(404).json({
                success: false,
                message: "Error code not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Error code deleted successfully",
            data: errorCode
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }}


    exports.updateErrorCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { Heading, code, description, note } = req.body;

        // Check if the error code exists
        const errorCode = await ErrorCode.findById(id);
        if (!errorCode) {
            return res.status(404).json({
                success: false,
                message: "Error code not found"
            });
        }

        // Handle the note field
        let formattedNote = [];
        if (Array.isArray(note)) {
            formattedNote = note; // If it's already an array, use it as is
        } else if (typeof note === 'string') {
            formattedNote = note.split(',').map(item => item.trim()); // If it's a string, split it
        }

        // Update the error code fields
        errorCode.Heading = Heading;
        errorCode.code = code;
        errorCode.description = description;
        errorCode.note = formattedNote;

        // Save the updated error code
        await errorCode.save();

        // Send success response
        res.status(200).json({
            success: true,
            message: "Error code updated successfully",
            data: errorCode
        });
    } catch (error) {
        console.log("Internal server error in updating error code:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error in updating error code",
            error: error.message
        });
    }
};
