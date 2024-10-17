const fs = require('fs');
const Order = require('../Model/Order.Model');
const { deleteVoiceNoteFromCloudinary, uploadVoiceNote } = require('../Utils/Cloudnary');

exports.makeOrder = async (req, res) => {
    try {
        const { userId, serviceId, fullName, email, phoneNumber, serviceType, message, city, pinCode, houseNo, street, nearByLandMark } = req.body; // change to lowercase

        console.log('body', req.body);

        const emptyField = [];
        if (!userId) emptyField.push('User');
        if (!serviceId) emptyField.push('Service');
        if (!fullName) emptyField.push('Full Name');
        if (!email) emptyField.push('Email');
        if (!phoneNumber) emptyField.push('Phone Number');
        if (!serviceType) emptyField.push('Service Type');
        if (!city) emptyField.push('City'); // updated to lowercase
        if (!pinCode) emptyField.push('Pin Code'); // updated to lowercase
        if (!houseNo) emptyField.push('House No'); // updated to lowercase
        if (!street) emptyField.push('Street'); // updated to lowercase
        if (!nearByLandMark) emptyField.push('NearByLandMark'); // updated to lowercase

        // If there are any empty fields, return an error response
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
            console.log("file", req.file);
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
            console.warn('No voice note uploaded, proceeding to create order without it.');
        }

        // Create new order with voice note details if available
        const newOrder = new Order({
            userId,
            serviceId,
            voiceNote: voiceNoteDetails || null, // Allow null if no voice note is provided
            fullName,
            email,
            phoneNumber,
            serviceType,
            message,
            city, // updated to lowercase
            pinCode, // updated to lowercase
            houseNo, // updated to lowercase
            street, // updated to lowercase
            nearByLandMark // updated to lowercase
        });

        console.log('newOrder', newOrder);

        // Save the order to the database
        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: newOrder
        });

    } catch (error) {
        console.error("Internal server error in creating order", error);

        // Handle any necessary cleanup if the order creation fails
        if (voiceNoteDetails && voiceNoteDetails.public_id) {
            await deleteVoiceNoteFromCloudinary(voiceNoteDetails.public_id);
        }

        res.status(500).json({
            success: false,
            message: "Internal server error in creating order",
            error: error.message
        });
    }
};




exports.getAllOrder = async (req,res) => {
    try {
        const orders = await Order.find().populate('userId').populate('serviceId').populate('vendorAlloted')
        if(!orders){
            return res.status(404).json({
                success: false,
                message: 'No orders found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders
        })
    } catch (error) {
        console.log("Internal server in geting all order")
        res.status(500).json({
            success: setFlagsFromString,
            message: "Internal server error in getting all order",
            error: error.message
        })
    }
}