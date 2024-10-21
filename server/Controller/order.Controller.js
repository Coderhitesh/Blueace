const fs = require('fs');
const Order = require('../Model/Order.Model');
const { deleteVoiceNoteFromCloudinary, uploadVoiceNote } = require('../Utils/Cloudnary');

exports.makeOrder = async (req, res) => {
    try {
        console.log('body', req.body);
        const { userId, serviceId, fullName, email, phoneNumber, serviceType, message, city, pinCode, houseNo, street, nearByLandMark, RangeWhereYouWantService } = req.body;

        // Check for missing required fields
        const emptyField = [];
        if (!userId) emptyField.push('User');
        if (!serviceId) emptyField.push('Service');
        if (!fullName) emptyField.push('Full Name');
        if (!email) emptyField.push('Email');
        if (!phoneNumber) emptyField.push('Phone Number');
        if (!serviceType) emptyField.push('Service Type');
        if (!city) emptyField.push('City');
        if (!pinCode) emptyField.push('Pin Code');
        if (!houseNo) emptyField.push('House No');
        if (!street) emptyField.push('Street');
        if (!nearByLandMark) emptyField.push('NearByLandMark');

        // If there are any empty fields, return an error response
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        // Parse RangeWhereYouWantService if it exists
        let parsedRangeWhereYouWantService = null;
        if (RangeWhereYouWantService) {
            try {
                parsedRangeWhereYouWantService = JSON.parse(RangeWhereYouWantService);
            } catch (parseError) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid format for RangeWhereYouWantService. It must be a valid JSON.'
                });
            }
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
            console.warn('No voice note uploaded, proceeding to create order without it.');
        }

        // Create new order with voice note details if available
        const newOrder = new Order({
            userId,
            serviceId,
            voiceNote: voiceNoteDetails || null,
            fullName,
            email,
            phoneNumber,
            serviceType,
            message,
            city,
            pinCode,
            houseNo,
            street,
            nearByLandMark,
            RangeWhereYouWantService: parsedRangeWhereYouWantService // Use parsed JSON
        });

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


exports.getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('serviceId').populate('vendorAlloted')
        if (!orders) {
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

exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params._id;
        const { OrderStatus } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }
        order.OrderStatus = OrderStatus
        await order.save();
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        })
    } catch (error) {
        console.log('Internal server error in updating order status', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in updating order status',
            error: error.message
        })
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const id = req.params._id;
        const order = Order.findById(id)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'order is not found'
            })
        }
        await Order.findOneAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Order is deleted successfully',
            data: order
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in deleting order',
        })
    }
}