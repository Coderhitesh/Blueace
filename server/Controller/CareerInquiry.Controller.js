const CareerInquiry = require('../Model/CareerInquiry.Model');
const { uploadPDF } = require('../Utils/Cloudnary');

exports.createCareerInquiry = async (req, res) => {
    try {
        const { name, email, phone, message, jobID } = req.body;
        // console.log("name, email, phone, message, jobID",name, email, phone, message, jobID)
        if (!name || !email || !phone || !message || !jobID) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume"
            })
        } if (req.file) {
            const imgUrl = await uploadPDF(req.file.path);
            const { pdf, public_id } = imgUrl;
            const newCareerInquiry = new CareerInquiry({
                name,
                email,
                phone,
                message,
                jobID,
                resume: {
                    url: pdf,
                    public_id: public_id
                }
            })
            await newCareerInquiry.save();
            res.status(201).json({
                success: true,
                message: "Career Inquiry created successfully",
                data: newCareerInquiry
            })
        }
    } catch (error) {
        console.log("Internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getAllCareerInquiry = async (req, res) => {
    try {
        const allCareerInquiry = await CareerInquiry.find().populate('jobID');
        if (!allCareerInquiry) {
            return res.status(400).json({
                success: false,
                message: "No Career Inquiry found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Career Inquiry fetched successfully",
            data: allCareerInquiry
        })
    } catch (error) {
        console.log("Internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getSingleCareerInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const singleCareerInquiry = await CareerInquiry.findById(id).populate('jobID');
        if (!singleCareerInquiry) {
            return res.status(400).json({
                success: false,
                message: "No Career Inquiry found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Career Inquiry fetched successfully",
            data: singleCareerInquiry
        })
    } catch (error) {
        console.log("Internal server error", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.deleteCareerInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCareerInquiry = await CareerInquiry.findByIdAndDelete(id);
        if (!deletedCareerInquiry) {
            return res.status(400).json({
                success: false,
                message: "No Career Inquiry found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Career Inquiry deleted successfully",
            data: deletedCareerInquiry
        })
    } catch (error) {
        console.log("Internal server error", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}