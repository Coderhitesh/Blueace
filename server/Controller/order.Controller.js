// const fs = require('fs');
const Order = require('../Model/Order.Model');
const { deleteVoiceNoteFromCloudinary, uploadVoiceNote, deleteImageFromCloudinary, uploadImage } = require('../Utils/Cloudnary');
const fs = require('fs').promises;
const Vendor = require('../Model/vendor.Model')
require("dotenv").config()
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
        const orders = await Order.find().populate('userId EstimatedBill serviceId vendorAlloted').sort({ 'createdAt': -1 })
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
            success: false,
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
        // if (OrderStatus === "Cancelled") {
        //     const AdminEmail = process.env.ADMIN_MAIL;
        //     const emailOptions = {
        //         email: AdminEmail,
        //         subject: 'Order Cancellation Notice - Reassign New Vendor',
        //         message: `
        //             <html>
        //             <head>
        //                 <style>
        //                     body {
        //                         font-family: Arial, sans-serif;
        //                         line-height: 1.6;
        //                         background-color: #f5f5f5;
        //                         padding: 20px;
        //                     }
        //                     .container {
        //                         max-width: 600px;
        //                         margin: 0 auto;
        //                         background-color: #fff;
        //                         padding: 20px;
        //                         border-radius: 8px;
        //                         box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        //                     }
        //                     .header {
        //                         background-color: #d9534f;
        //                         color: #fff;
        //                         padding: 10px;
        //                         text-align: center;
        //                         border-top-left-radius: 8px;
        //                         border-top-right-radius: 8px;
        //                     }
        //                     .content {
        //                         padding: 20px;
        //                     }
        //                     .content p {
        //                         margin-bottom: 10px;
        //                     }
        //                     .footer {
        //                         text-align: center;
        //                         margin-top: 20px;
        //                         color: #666;
        //                     }
        //                 </style>
        //             </head>
        //             <body>
        //                 <div class="container">
        //                     <div class="header">
        //                         <h1>Order Cancellation Notice</h1>
        //                     </div>
        //                     <div class="content">
        //                         <p>Dear Admin,</p>
        //                         <p>We want to inform you that the order was canceled as the assigned vendor could not accept it.</p>
        //                         <p>Please review this order and consider assigning a new vendor.</p>
        //                     </div>
        //                     <div class="footer">
        //                         <p>Best regards,</p>
        //                         <p>Blueace Team</p>
        //                     </div>
        //                 </div>
        //             </body>
        //             </html>
        //         `
        //     };
        
        //     await sendEmail(emailOptions);
        //     res.status(200).json({
        //         success: true,
        //         message: 'Order status updated successfully',
        //         data: order
        //     });
        // }
        
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
        console.log(id);

        // Find the order by ID
        const order = await Order.findById(id);
        console.log(order);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Delete the order by ID
        await Order.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
            data: order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in deleting order',
        });
    }
};


exports.fetchVendorByLocation = async (req, res) => {
    try {
        const { orderId, limit = 10, Page = 1 } = req.query;

        if (!orderId) {
            return res.status(402).json({
                success: false,
                message: 'Order id is required',
            });
        }

        const findOrder = await Order.findById(orderId).populate('userId'); // Populate the userId field

        if (!findOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        const userType = findOrder.userId?.UserType; // Optional chaining to avoid undefined errors

        if (userType === 'Corporate') {
            // console.log("Entered in corporate section");

            const vendorWhichAllotedPast = findOrder.vendorAlloted || "No Vendor In Past";
            // console.log('vendorWhichAllotedPast',vendorWhichAllotedPast)

            const limit = parseInt(req.query.limit) || 10; // default limit
            const page = parseInt(req.query.page) || 1; // default to first page
            const skip = (page - 1) * limit;

            // Fetch only vendors with role 'employ'
            const employVendors = await Vendor.find({ Role: 'employ' }).skip(skip).limit(limit);
            const totalEmployVendors = await Vendor.countDocuments({ Role: 'employ' });
            const totalPages = Math.ceil(totalEmployVendors / limit);

            return res.status(200).json({
                success: true,
                AlreadyAllottedVendor: vendorWhichAllotedPast,
                currentPage: page,
                limit,
                totalPages,
                data: employVendors,
                message: 'Vendors fetched successfully',
            });
        }


        const venorWhichAllotedPast = findOrder.vendorAlloted

        const OrderServiceLocation = findOrder.RangeWhereYouWantService[0].location;
        const skip = (Page - 1) * limit;

        const locationResults = await Vendor.find({
            'RangeWhereYouWantService.location': {
                $near: {
                    $geometry: OrderServiceLocation,
                    $maxDistance: 5000
                }
            }
        })
            .limit(parseInt(limit))
            .skip(skip);


        const totalPages = Math.ceil(locationResults.length / limit);

        res.status(201).json({
            success: true,
            AlreadyAllottedVendor: venorWhichAllotedPast || "No-Vendor In Past",
            currentPage: parseInt(Page),
            limit: parseInt(limit),
            totalPages,
            data: locationResults,
            message: 'Vendors fetched successfully',
        });

    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.AssignVendor = async (req, res) => {
    try {
        const { orderId, Vendorid, type } = req.params;

        if (!orderId || !Vendorid) {
            return res.status(404).json({
                success: false,
                message: "Order and Vendor ID are required"
            });
        }

        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (type === "new-vendor" && order.VendorAllotedStatus) {
            return res.status(404).json({
                success: false,
                message: "Vendor already allotted"
            });
        }

        const currentISTTime = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        console.log(currentISTTime);

        order.vendorAlloted = Vendorid;
        order.OrderStatus = "Vendor Assigned";
        order.VendorAllotedTime = currentISTTime;
        order.VendorAllotedStatus = true;

        await order.save();

        res.status(201).json({
            success: true,
            data: order,
            message: type === "change-vendor" ? "Vendor changed successfully" : "Vendor assigned successfully"
        });

    } catch (error) {
        res.status(501).json({

            success: false,
            message: error.message
        });
    }
};

exports.updateBeforWorkImage = async (req, res) => {
    const uploadedImages = [];
    try {
        const id = req.params._id;
        console.log("id", id)
        const order = await Order.findById(id)
        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Order not found'
            })
        }
        if (req.file) {
            if (order.beforeWorkImage.public_id) {
                await deleteImageFromCloudinary(order.beforeWorkImage.public_id)
            }
            const imgUrl = await uploadImage(req.file.path)
            const { image, public_id } = imgUrl
            order.beforeWorkImage.url = image;
            order.beforeWorkImage.public_id = public_id;
            uploadedImages.push = order.beforeWorkImage.public_id;
            try {
                fs.unlink(req.file.path)
            } catch (error) {
                console.log('Error in deleting file from local', error)
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'No image uploaded'
            })
        }
        const updatedOrder = await order.save()

        res.status(200).json({
            success: true,
            message: 'Before work image is uploaded',
            data: updatedOrder
        })

    } catch (error) {
        console.log("Internal server error in updating the before image", error)
        res.status(500).json({
            success: false,
            message: "Internal server error in updating the before work image",
            error: error.message

        })
    }
}

exports.updateAfterWorkImage = async (req, res) => {
    const uploadedImages = [];
    try {
        const id = req.params._id;
        const order = await Order.findById(id)
        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Order not found'
            })
        }
        if (req.file) {
            if (order.afterWorkImage.public_id) {
                await deleteImageFromCloudinary(order.afterWorkImage.public_id)
            }
            const imgUrl = await uploadImage(req.file.path)
            const { image, public_id } = imgUrl
            order.afterWorkImage.url = image;
            order.afterWorkImage.public_id = public_id;
            uploadedImages.push = order.afterWorkImage.public_id;
            try {
                fs.unlink(req.file.path)
            } catch (error) {
                console.log('Error in deleting file from local', error)
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'No image uploaded'
            })
        }
        order.OrderStatus = "Service Done"
        const updatedOrder = await order.save()

        res.status(200).json({
            success: true,
            message: 'Before work image is uploaded',
            data: updatedOrder
        })

    } catch (error) {
        console.log("Internal server error in updating the before image", error)
        if (uploadedImages) {
            deleteImageFromCloudinary(uploadedImages)
        }
        res.status(500).json({
            success: false,
            message: "Internal server error in updating the before work image",
            error: error.message

        })
    }
}