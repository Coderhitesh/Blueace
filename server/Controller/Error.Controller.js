const ErrorCode = require('../Model/ErrorCode.Model')

exports.createErrorCode = async (req, res) => {
    try {
        const { Heading, code, description, note } = req.body;
        const emptyField = [];
        if (!Heading) emptyField.push('Heading');
        if (!code) emptyField.push('code');
        if (!description) emptyField.push('description');
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        const newErrorCode = new ErrorCode({
            Heading,
            code,
            description,
            note
        });
        await newErrorCode.save();
        res.status(200).json({
            success: true,
            message: "Error code created successfully",
            data: newErrorCode
        })
    } catch (error) {
        console.log("Internal server error in creating error code", error)
        res.status(500).json({
            success: false,
            message: "Internal server error in creating error code",
            error: error.message
        })
    }
}

exports.getAllErrorCode = async (req, res) => {
    try {
        const errorCodes = await ErrorCode.find();
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

exports.getErrorCodeById = async () => {
    try {
        const {id} = req.params;
        const errorCode = await ErrorCode.findById(id);
        if(!errorCode){
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
        console.log("Internal server error",error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteErrorCode = async (req, res) => {
    try {
        const {id} = req.params;
        const errorCode = await ErrorCode.findByIdAndDelete(id);
        if(!errorCode){
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
        console.log("Internal server error",error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updateErrorCode = async (req,res) => {
    try {
        const {id} = req.params;
        const {Heading, code, description, note} = req.body;
        const errorCode = await ErrorCode.findById(id);
        if(!errorCode){
            return res.status(404).json({
                success: false,
                message: "Error code not found"
            })
        }
        errorCode.Heading = Heading;
        errorCode.code = code;
        errorCode.description = description;
        errorCode.note = note;
        await errorCode.save();
        res.status(200).json({
            success: true,
            message: "Error code updated successfully",
            data: errorCode
        })
    } catch (error) {
        console.log("Internal server error",error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// exports.findErrorCodebyHeading = async(req,res) => {
//     try {
//         const {} = req.params;
//     } catch (error) {
//         console.log("Internal server error",error)
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message
//         })
//     }
// }