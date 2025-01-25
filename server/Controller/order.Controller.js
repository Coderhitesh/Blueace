// const fs = require('fs');
const Order = require('../Model/Order.Model');
const { deleteVoiceNoteFromCloudinary, uploadVoiceNote, deleteImageFromCloudinary, uploadImage, deleteVideoFromCloudinary, uploadVideo } = require('../Utils/Cloudnary');
const fs = require('fs').promises;
const Vendor = require('../Model/vendor.Model')
const User = require('../Model/UserModel');
const { error } = require('console');
const { sendSMS } = require('../Utils/SMSSender');
const ServiceCategory = require('../Model/serviceCategoty.Model');
require("dotenv").config()
const crypto = require('crypto')
const Razorpay = require('razorpay');
const Commission = require('../Model/Commission.Model');
const axios = require('axios')
const merchantId = process.env.PHONEPAY_MERCHANT_ID
const apiKey = process.env.PHONEPAY_API_KEY

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,   // Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Razorpay Secret Key
});

exports.makeOrder = async (req, res) => {
    try {
        // console.log('body', req.body);
        const { userId, serviceId, fullName, email, phoneNumber, serviceType, message, pinCode, address, houseNo, nearByLandMark, RangeWhereYouWantService, orderTime } = req.body;
        const AdminNumber = process.env.ADMIN_NUMBER;

        // Check for missing required fields
        const emptyField = [];
        if (!userId) emptyField.push('User');
        if (!serviceId) emptyField.push('Service');
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

        // Fetch service name using populate
        const service = await ServiceCategory.findById(serviceId); // Find the service by ID
        const serviceName = service ? service.name : 'Service'; // Use the service name or a default value if not found

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
            // city,
            address,
            pinCode,
            houseNo,
            // street,
            nearByLandMark,
            RangeWhereYouWantService: parsedRangeWhereYouWantService, // Use parsed JSON
            orderTime
        });

        // await sendSMS(
        //     phoneNumber,
        //     `Dear ${fullName}, your order for ${serviceName} (${serviceType}) has been successfully placed. Thank you for choosing our service! We will assign a vendor shortly and be in touch to confirm the details.`
        // );

        // Create a message for the admin
        const adminMessage = `
            New Order Placed:
            - User Name: ${fullName}
            - User Email: ${email}
            - User Phone: ${phoneNumber}
            - Service Name: ${serviceName}
            - Service Type: ${serviceType}
            - Message: ${message || 'No message provided'}
            - Address: ${houseNo}, ${address}, ${nearByLandMark ? nearByLandMark + ', ' : ''}${pinCode}
            - Order Time: ${orderTime}
            
            Please assign a vendor to this order.
        `;

        // Send the message to admin
        // await sendSMS(AdminNumber, adminMessage);

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
        const orders = await Order.find()
            .populate('userId EstimatedBill vendorAlloted') // Populating userId, EstimatedBill, and vendorAlloted
            .populate({
                path: 'serviceId',
                populate: {
                    path: 'subCategoryId',
                    model: 'ServiceCategory', // The model name for subCategoryId
                }
            })
            .sort({ createdAt: -1 });

        if (!orders) {
            return res.status(404).json({
                success: false,
                message: 'No orders found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders,
        });
    } catch (error) {
        console.error('Internal server error in getting all orders:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting all orders',
            error: error.message,
        });
    }
};

exports.findOrderById = async (req, res) => {
    try {
        // Extract vendorAlloted and userId from query parameters
        const { vendorAlloted } = req.query;
        // console.log(vendorAlloted)
        // Define a filter object
        const filter = {};

        // Add conditions to filter based on the presence of vendorAlloted and userId in the query
        if (vendorAlloted) {
            filter.vendorAlloted = vendorAlloted;
        }


        // Find orders based on the filter
        const orders = await Order.find({
            $or: [{
                // VendorAllotedStatus: "Accepted",
                vendorAlloted: vendorAlloted
            }]
        })
            .populate('userId EstimatedBill vendorAlloted') // Populating userId, EstimatedBill, and vendorAlloted
            .populate({
                path: 'serviceId',
                populate: {
                    path: 'subCategoryId',
                    model: 'ServiceCategory', // The model name for subCategoryId
                }
            })
            .sort({ createdAt: -1 });
        // console.log(orders)
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        console.error("Internal server error in getting all orders:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting all orders',
            error: error.message
        });
    }
}

exports.findOrderByUserId = async (req, res) => {
    try {
        // Extract vendorAlloted and userId from query parameters
        const { userId } = req.query;
        // console.log(vendorAlloted)
        // Define a filter object
        const filter = {};

        // Add conditions to filter based on the presence of vendorAlloted and userId in the query
        // if (vendorAlloted) {
        //     filter.vendorAlloted = vendorAlloted;
        // }


        // Find orders based on the filter
        const orders = await Order.find({
            $or: [{
                userId: userId
            }]
        })
            .populate('userId EstimatedBill vendorAlloted') // Populating userId, EstimatedBill, and vendorAlloted
            .populate({
                path: 'serviceId',
                populate: {
                    path: 'subCategoryId',
                    model: 'ServiceCategory', // The model name for subCategoryId
                }
            })
            .sort({ createdAt: -1 });
        // console.log(orders)
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        console.error("Internal server error in getting all orders:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting all orders',
            error: error.message
        });
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
        // console.log("userType", userType)

        if (userType === 'Corporate') {
            // console.log("Entered in corporate section");

            const vendorWhichAllotedPast = findOrder.vendorAlloted || "No Vendor In Past";
            // console.log('vendorWhichAllotedPast',vendorWhichAllotedPast)
            const OrderServiceLocation = findOrder.RangeWhereYouWantService[0].location;
            const limit = parseInt(req.query.limit) || 10; // default limit
            const page = parseInt(req.query.page) || 1; // default to first page
            const skip = (page - 1) * limit;

            const locationResults = await Vendor.find({
                'RangeWhereYouWantService.location': {
                    $near: {
                        $geometry: OrderServiceLocation,
                        $maxDistance: 5000
                    }
                }
            })
                .limit(parseInt(limit))
                .skip(skip)
                .populate('workingHour');

            // Fetch only vendors with role 'employ'
            // const employVendors = await Vendor.find({ Role: 'employ' }).skip(skip).limit(limit).populate('workingHour');
            const employVendors = locationResults.filter((item) => item.Role === 'employ')
            const totalEmployVendors = await Vendor.countDocuments({ Role: 'employ' });
            const totalPages = Math.ceil(totalEmployVendors / limit);

            const filterWithActive = employVendors.filter((vendor) => vendor.readyToWork === true);

            return res.status(200).json({
                success: true,
                AlreadyAllottedVendor: vendorWhichAllotedPast,
                currentPage: page,
                limit,
                totalPages,
                preSelectedDay: findOrder.workingDay,
                preSelectedTime: findOrder.workingTime,
                preSelectedDate: findOrder.workingDate,
                data: filterWithActive,
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
            .skip(skip)
            .populate('workingHour');

        const filterWithActive = locationResults.filter((vendor) => vendor.readyToWork == true);
        const filterVendorForUser = filterWithActive.filter((item) => item.Role === 'vendor')

        const totalPages = Math.ceil(filterVendorForUser.length / limit);

        res.status(201).json({
            success: true,
            AlreadyAllottedVendor: venorWhichAllotedPast || "No-Vendor In Past",
            currentPage: parseInt(Page),
            limit: parseInt(limit),
            preSelectedDay: findOrder.workingDay,
            preSelectedTime: findOrder.workingTime,
            preSelectedDate: findOrder.workingDate,
            totalPages,
            data: filterVendorForUser,
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
        const { orderId, Vendorid, type, workingDay, workingTime, workingDate } = req.params;
        // console.log("workingDate",workingDate)
        // Validate required parameters
        if (!orderId || !Vendorid) {
            return res.status(404).json({
                success: false,
                message: "Order ID and Vendor ID are required"
            });
        }

        const findVendor = await Vendor.findById(Vendorid);
        const vendorNumber = findVendor?.ContactNumber;

        // Fetch the specific order by orderId
        const order = await Order.findById(orderId).populate('serviceId');
        const serviceName = order ? order.serviceId.name : 'Service';

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if vendor is already allotted for a new assignment
        if (type === "new-vendor" && order.VendorAllotedStatus === 'Accepted') {
            return res.status(404).json({
                success: false,
                message: "Vendor already allotted"
            });
        }

        // Fetch only active orders for the vendor
        const activeOrders = await Order.find({
            vendorAlloted: Vendorid,
            OrderStatus: { $nin: ['Service Done', 'Cancelled'] }
        });

        // console.log("workingDate", workingDate)

        // Function to normalize the date (remove time)
        const normalizeDate = (dateString) => {
            const date = new Date(dateString);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        // Check if the vendor is busy on the given workingDay, workingTime, and workingDate
        const isVendorBusy = activeOrders.some((activeOrder) => {
            const activeDate = normalizeDate(activeOrder.workingDate);
            const newDate = normalizeDate(workingDate);

            return (
                activeDate.getTime() === newDate.getTime() &&
                activeOrder.workingDay === workingDay &&
                activeOrder.workingTime === workingTime
            );
        });

        // console.log("isVendorBusy", isVendorBusy)

        if (isVendorBusy) {
            return res.status(404).json({
                success: false,
                message: "Vendor already working on this day and time"
            });
        }

        // Get the current IST time
        const currentISTTime = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // Update the order details
        order.vendorAlloted = Vendorid;
        order.OrderStatus = "Vendor Assigned";
        order.VendorAllotedTime = currentISTTime;
        order.VendorAllotedStatus = "Send Request";
        order.workingDay = workingDay;
        order.workingTime = workingTime;
        order.workingDate = workingDate;
        order.VendorAllotedBoolean = true;

        // Construct the full address
        const fullAddress = `${order.houseNo}, ${order.address}, ${order.nearByLandMark ? order.nearByLandMark + ', ' : ''}${order.pinCode}`;

        // Send SMS notification to the vendor
        const vendorMessage = `You have been assigned a new task for ${serviceName}. The service is scheduled for ${workingDay} at ${workingTime}. The address is: ${fullAddress}. Please confirm and accept the task.`;

        // await sendSMS(vendorNumber, vendorMessage); // Send SMS to the vendor's phone number (make sure you have Vendor's contact)
        // console.log("order", order)

        // Save the updated order
        await order.save();

        // Send success response
        res.status(201).json({
            success: true,
            data: order,
            message: type === "change-vendor" ? "Vendor changed successfully" : "Vendor assigned successfully"
        });

    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.AcceptOrderRequest = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { VendorAllotedStatus } = req.body;

        // console.log("orderId",orderId)
        // console.log("VendorAllotedStatus",VendorAllotedStatus)

        const order = await Order.findById(orderId)
            .populate('serviceId')
            .populate('vendorAlloted')
            .populate('userId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
                error: "Order not found"
            });
        }

        const userNumber = order ? order.phoneNumber : '';
        const vendorName = order ? order.vendorAlloted.companyName : '';
        const AdminNumber = process.env.ADMIN_NUMBER;
        const serviceName = order ? order.serviceId.name : 'Service';
        const serviceType = order ? order.serviceType : 'Not specified';
        const fullAddress = `${order.houseNo}, ${order.address}, ${order.nearByLandMark ? order.nearByLandMark + ', ' : ''}${order.pinCode}`;

        if (VendorAllotedStatus === 'Accepted') {
            order.VendorAllotedStatus = VendorAllotedStatus;

            // Save the order with the updated status
            await order.save();

            // Message for the user (optional, if needed)
            // const userMessage = `Your order for ${serviceName} (${serviceType}) has been accepted by vendor ${vendorName}. The service will be carried out at: ${fullAddress}.`;

            // Message for admin
            // const adminMessage = `Order for ${serviceName} (${serviceType}) has been accepted by vendor ${vendorName}. The service will be performed at: ${fullAddress}. Please note the vendor has accepted the task.`;

            // Send the messages (Assuming sendSMS is a function that sends SMS to the respective phone numbers)
            // await sendSMS(userNumber, userMessage); // Sending message to the user
            // await sendSMS(AdminNumber, adminMessage); // Sending message to admin
            // console.log("finish",order)
            return res.status(200).json({
                success: true,
                message: "Order accepted successfully",
                data: order
            });
        }

        if (VendorAllotedStatus === 'Reject') {
            order.VendorAllotedStatus = "Pending";
            order.OrderStatus = 'Pending';
            order.vendorAlloted = null;
            order.VendorAllotedBoolean = false;

            // Save the order with the updated status
            await order.save();

            // Message for the admin (rejection)
            // const adminRejectionMessage = `Order for ${serviceName} (${serviceType}) has been rejected by vendor ${vendorName}. The order is now pending. Please assign another vendor to this order. The address is: ${fullAddress}.`;

            // Send the rejection message to admin
            // await sendSMS(AdminNumber, adminRejectionMessage); // Sending message to admin

            return res.status(200).json({
                success: true,
                message: "Order rejected successfully",
                data: order
            });
        }

    } catch (error) {
        console.log("Internal server error", error);
        res.status(501).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.updateBeforWorkImage = async (req, res) => {
    const uploadedImages = [];
    try {
        const id = req.params._id;
        // console.log("id", id)
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
        // order.OrderStatus = "Service Done"
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

exports.updateBeforeWorkVideo = async (req, res) => {
    const uploadedVideo = [];
    try {
        const id = req.params._id
        const order = await Order.findById(id)
        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Order not found',

            })
        }
        if (req.file) {
            if (order.beforeWorkVideo.public_id) {
                await deleteVideoFromCloudinary(order.beforeWorkVideo.public_id)
            }
            const videoUrl = await uploadVideo(req.file.path)
            const { video, public_id } = videoUrl;
            order.beforeWorkVideo.url = video;
            order.beforeWorkVideo.public_id = public_id;
            uploadedVideo.push = order.beforeWorkVideo.public_id;
            try {
                fs.unlink(req.file.path)
            } catch (error) {
                console.log('Error in deleting video file from local:', error)
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'Please upload a video',
            })
        }
        // order.OrderStatus = "Service Done"
        const updatedOrder = await order.save()

        res.status(200).json({
            success: true,
            message: 'Before work video is uploaded',
            data: updatedOrder
        })
    } catch (error) {
        console.log('Internal server error in uploading before work video')
        res.status(500).json({
            success: false,
            message: "Internal server error in uploading before work video",
            error: error.message
        })
    }
}

exports.updateAfterWorkVideo = async (req, res) => {
    const uploadedVideo = [];
    try {
        const id = req.params._id
        const order = await Order.findById(id)
        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Order not found',

            })
        }
        if (req.file) {
            if (order.afterWorkVideo.public_id) {
                await deleteVideoFromCloudinary(order.afterWorkVideo.public_id)
            }
            const videoUrl = await uploadVideo(req.file.path)
            const { video, public_id } = videoUrl;
            order.afterWorkVideo.url = video;
            order.afterWorkVideo.public_id = public_id;
            uploadedVideo.push = order.afterWorkVideo.public_id;
            try {
                fs.unlink(req.file.path)
            } catch (error) {
                console.log('Error in deleting video file from local:', error)
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'Please upload a video',
            })
        }
        // order.OrderStatus = "Service Done"
        const updatedOrder = await order.save()

        res.status(200).json({
            success: true,
            message: 'Before work video is uploaded',
            data: updatedOrder
        })
    } catch (error) {
        console.log('Internal server error in uploading before work video')
        res.status(500).json({
            success: false,
            message: "Internal server error in uploading before work video",
            error: error.message
        })
    }
}

exports.AllowtVendorMember = async (req, res) => {
    try {
        // console.log("i am hit")
        const id = req.params._id;
        const { AllowtedVendorMember } = req.body;
        const order = await Order.findById(id)
        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Order not found'
            })
        }

        order.AllowtedVendorMember = AllowtedVendorMember
        await order.save()
        res.status(200).json({
            success: true,
            message: 'Allowt Vendor Member is updated',
            data: order
        })
    } catch (error) {
        console.log('Internal server error in allowing vendor member', error)
        res.status(500).json({
            success: false,
            message: "Internal server error in allowing vendor member",
            error: error.message
        })
    }
}

exports.makeOrderPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { totalAmount } = req.body;
        // console.log("orderId",orderId)
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Order not found'
            })
        }
        if (!totalAmount) {
            res.status(400).json({
                success: false,
                message: 'Total amount is required',
                error: 'Total amount is required'
            })
        }

        if (totalAmount === 0 || totalAmount === null) {
            res.status(400).json({
                success: false,
                message: 'Total amount is required',
                error: 'Total amount is required'
            })
        }

        // Ensure amount is converted to an integer (in paise)
        const integerAmount = Math.floor(totalAmount);

        const transactionId = crypto.randomBytes(9).toString('hex');
        const merchantUserId = crypto.randomBytes(12).toString('hex');

        const data = {
            merchantId: merchantId,
            merchantTransactionId: transactionId,
            merchantUserId,
            name: "User",
            amount: integerAmount * 100,
            callbackUrl: `https://www.blueaceindia.com/failed-payment`,
            redirectUrl: `https://www.api.blueaceindia.com/api/v1/status-payment/${transactionId}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + apiKey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
        // const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        const response = await axios.request(options);
        // console.log("i am response id ", response?.data?.data?.merchantTransactionId);
        const updateOrder = await Order.findById(orderId)
        if (updateOrder) {
            updateOrder.razorpayOrderId = response?.data?.data?.merchantTransactionId
            await updateOrder.save()
        }
        res.status(201).json({
            success: true,
            url: response.data.data.instrumentResponse.redirectInfo.url
        })



    } catch (error) {
        console.log('Internal server error', error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.verifyOrderPayment = async (req, res) => {
    const { merchantTransactionId } = req.params;
    // console.log("i am hit",merchantTransactionId)

    if (!merchantTransactionId) {
        return res.status(400).json({ success: false, message: "Merchant transaction ID not provided" });
    }

    try {
        const merchantIdD = merchantId; // Ensure merchantId is defined
        const keyIndex = 1;
        const string = `/pg/v1/status/${merchantIdD}/${merchantTransactionId}` + apiKey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + "###" + keyIndex;
        const testUrlCheck = "https://api.phonepe.com/apis/hermes/pg/v1";
        // const testUrlCheck = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1";

        const options = {
            method: 'GET',
            url: `${testUrlCheck}/status/${merchantId}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': `${merchantId}`
            }
        };

        const { data } = await axios.request(options);

        // console.log("out data", data);

        if (data.success === true) {
            // console.log("i am in",data)
            // Fetch payment details
            const amount = data?.data?.amount;

            const findOrder = await Order.findOne({ razorpayOrderId: merchantTransactionId });
            if (!findOrder) {
                return res.status(400).json({
                    success: false,
                    message: 'Order not found.',
                });
            }

            const vendorId = findOrder?.vendorAlloted?._id;
            const vendor = await Vendor.findById(vendorId);
            const vendorRole = vendor?.Role;
            // console.log("vendor role",vendorRole)

            // Fetch commission details
            const allCommission = await Commission.find();
            const employeeCommission = allCommission.find((item) => item.name === 'Employee');
            const vendorCommission = allCommission.find((item) => item.name === 'Vendor');

            // console.log("commission",employeeCommission,vendorCommission)

            let commissionPercent = 0;
            if (vendorRole === 'vendor') {
                commissionPercent = vendorCommission ? parseFloat(vendorCommission.percent) : 0;
            } else if (vendorRole === 'employ') {
                commissionPercent = employeeCommission ? parseFloat(employeeCommission.percent) : 0;
            }

            // Calculate commission amounts
            const totalAmount = amount / 100; // Convert to actual amount from paise
            const vendorCommissionAmount = (commissionPercent / 100) * totalAmount;
            const adminCommissionAmount = totalAmount - vendorCommissionAmount;

            // console.log("vendorCommissionAmount",vendorCommissionAmount)
            // console.log("adminCommissionAmount",adminCommissionAmount)

            // Update the order
            findOrder.totalAmount = totalAmount;
            findOrder.commissionPercent = commissionPercent;
            findOrder.vendorCommissionAmount = vendorCommissionAmount;
            findOrder.adminCommissionAmount = adminCommissionAmount;
            // findOrder.transactionId = transactionId;
            findOrder.transactionId = data?.data?.merchantTransactionId;
            findOrder.PaymentStatus = 'paid';
            // findOrder.paymentMethod = method;
            findOrder.OrderStatus = "Service Done";
            vendor.walletAmount = vendorCommissionAmount;

            await vendor.save();
            await findOrder.save();

            const successRedirect = `https://www.blueaceindia.com/successfull-payment`;
            return res.redirect(successRedirect);
        } else {
            const failureRedirect = `https://www.blueaceindia.com/failed-payment`;
            return res.redirect(failureRedirect);
        }

    } catch (error) {
        console.error('Internal server error', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};