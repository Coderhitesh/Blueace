const fs = require('fs');
const Order = require('../Model/Order.Model');
const { deleteVoiceNoteFromCloudinary, uploadVoiceNote } = require('../Utils/Cloudnary');

exports.makeOrder = async (req, res) => {
    try {
        const { userId, serviceId, fullName, email, phoneNumber, serviceType, message } = req.body;

        const emptyField = [];
        if (!userId) emptyField.push('User')
        if (!serviceId) emptyField.push('Service')
        if (!fullName) emptyField.push('Full Name')
        if (!email) emptyField.push('Email')
        if (!phoneNumber) emptyField.push('Phone Number')
        if (!serviceType) emptyField.push('Service Type')
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        // Initialize voice note details
        let voiceNoteDetails = null;

        // Check if voice note file exists in the request
        if (req.file) {
            const voiceNoteUpload = await uploadVoiceNote(req.file.path);
            const { url, public_id } = voiceNoteUpload;

            voiceNoteDetails = {
                url: url,
                public_id: public_id
            };

            // Delete the local voice note file after uploading
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting local voice note file:', err);
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please upload a voice note',
            });
        }

        // Create new order with voice note details
        const newOrder = new Order({
            userId,
            serviceId,
            voiceNote: voiceNoteDetails
        });

        // Save the order to the database
        await newOrder.save();

        res.status(200).json({
            success: true,
            message: 'Order created successfully',
            data: newOrder
        });

    } catch (error) {
        console.log("Internal server error in creating order", error);

        // Handle any necessary cleanup if the order creation fails
        if (voiceNoteDetails) {
            await deleteVoiceNoteFromCloudinary(voiceNoteDetails.public_id);
        }

        res.status(500).json({
            success: false,
            message: "Internal server error in creating order",
            error: error.message
        });
    }
};
