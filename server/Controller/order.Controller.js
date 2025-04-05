// const fs = require('fs');
const Order = require('../Model/Order.Model');
const { deleteVoiceNoteFromCloudinary, uploadVoiceNote, deleteImageFromCloudinary, uploadImage, deleteVideoFromCloudinary, uploadVideo } = require('../Utils/Cloudnary');
const fs = require('fs').promises;
const Vendor = require('../Model/vendor.Model')
const mongoose = require('mongoose');
const { Types } = mongoose;
const ServiceCategory = require('../Model/serviceCategoty.Model');
require("dotenv").config()
const crypto = require('crypto')
const Razorpay = require('razorpay');
const Commission = require('../Model/Commission.Model');
const axios = require('axios');
const User = require('../Model/UserModel');
const { SendWhatsapp } = require('../Utils/SendWhatsapp');
const merchantId = process.env.PHONEPAY_MERCHANT_ID
const apiKey = process.env.PHONEPAY_API_KEY

const isProd = process.env.NODE_ENV === "production"

const BASE_URL = isProd
    ? "https://api.phonepe.com/apis/hermes/pg/v1"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1"

const REDIRECT_BASE_URL = isProd ? "https://www.blueaceindia.com" : "https://api.blueaceindia.com"

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
            orderTime: orderTime || new Date()
        });

        // Save the order to the database
        await newOrder.save();

        var newOrderTime = orderTime ? new Date(orderTime) : orderTime || new Date();
        newOrderTime = newOrderTime.toISOString().replace('T', ' ').replace('Z', '');
        const longaddress = address.replace(/,/g, '');

        const Param = [fullName, email, phoneNumber, serviceName, serviceType, message, houseNo, longaddress, pinCode]

        await SendWhatsapp(AdminNumber, 'order_detail_to_admin', Param)

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

exports.makeOrderFromApp = async (req, res) => {
    try {

        console.log('body', req.files);
        console.log('body', req.file);

        const { userId, serviceId, fullName, email, phoneNumber, serviceType, message, pinCode, address, houseNo, nearByLandMark, RangeWhereYouWantService, orderTime } = req.body;


        const emptyField = [];
        if (!userId) emptyField.push('User');
        if (!serviceId) emptyField.push('Service');
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }


        console.log("Without", RangeWhereYouWantService)

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


        console.log("parsedRangeWhereYouWantService", parsedRangeWhereYouWantService)

        let voiceNoteDetails = null;


        if (req.files) {
            const voiceNoteUpload = await uploadVoiceNote(req.files[0].path);
            const { url, public_id } = voiceNoteUpload;

            voiceNoteDetails = {
                url: url,
                public_id: public_id
            };


            fs.unlink(req.files[0].path, (err) => {
                if (err) {
                    console.error('Error deleting local voice note file:', err);
                }
            });
        } else {
            console.warn('No voice note uploaded, proceeding to create order without it.');
        }


        const newOrder = new Order({
            userId,
            serviceId,
            voiceNote: voiceNoteDetails || null,
            fullName,
            email,
            orderFrom: "App",
            phoneNumber,
            serviceType,
            message,

            address,
            pinCode,
            houseNo,

            nearByLandMark,
            RangeWhereYouWantService: parsedRangeWhereYouWantService,

        });

        const service = await ServiceCategory.findById(serviceId); // Find the service by ID
        const serviceName = service ? service.name : 'Service';

        await newOrder.save();
        const longaddress = address.replace(/,/g, '');
        const Param = [fullName, email, phoneNumber, serviceName, serviceType, message, houseNo, longaddress, pinCode]

        await SendWhatsapp(AdminNumber, 'order_detail_to_admin', Param)
        console.log(newOrder)
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: newOrder
        });

    } catch (error) {
        // console.error("Internal server error in creating order", error);

        // Handle any necessary cleanup if the order creation fails
        // if (voiceNoteDetails && voiceNoteDetails.public_id) {
        //     await deleteVoiceNoteFromCloudinary(voiceNoteDetails.public_id);
        // }

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
        console.log(vendorAlloted)

        const filter = {};


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

exports.findOrderByIdApp = async (req, res) => {
    try {
        const { orderid } = req.query;

        console.log(orderid)

        const orders = await Order.findById(orderid)
            .populate('userId EstimatedBill vendorAlloted')
            .populate({
                path: 'serviceId',
                populate: {
                    path: 'subCategoryId',
                    model: 'ServiceCategory',
                }
            })
            .sort({ createdAt: -1 });

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
};

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
            .populate('userId EstimatedBill vendorAlloted errorCode') // Populating userId, EstimatedBill, and vendorAlloted
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
        const order = await Order.findById(orderId).populate('userId');
        const userNumber = order?.userId?.ContactNumber
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }
        order.OrderStatus = OrderStatus
        await order.save();
        if (OrderStatus === "Cancelled") {
            const AdminNumber = process.env.ADMIN_NUMBER;
            await SendWhatsapp(userNumber, 'order_cancel_update_user');
            await SendWhatsapp(AdminNumber, 'order_cancel_update_admin');
            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                data: order
            });
        }


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
                // .limit(parseInt(limit))
                // .skip(skip)
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
        const allVendor = await Vendor.find()
        const filterEmployee = allVendor.filter((item) => item.Role === 'employ')
        const activeAllEmployee = filterEmployee.filter((item) => item.readyToWork === true)

        const locationResults = await Vendor.find({
            'RangeWhereYouWantService.location': {
                $near: {
                    $geometry: OrderServiceLocation,
                    $maxDistance: 5000
                }
            }
        })
            // .limit(parseInt(limit))
            // .skip(skip)
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
            allEmployee: activeAllEmployee,
            message: 'Vendors fetched successfully',
        });

    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.fetchOnlyEmployee = async (req, res) => {
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

        const vendorWhichAllotedPast = findOrder.vendorAlloted || "No Vendor In Past";
        const skip = (Page - 1) * limit;
        const allVendor = await Vendor.find()
            .populate('workingHour');
        const filterEmployee = allVendor.filter((item) => item.Role === 'employ')
        // console.log("filterEmployee".filterEmployee)
        const activeAllEmployee = filterEmployee.filter((item) => item.readyToWork === true)
        // console.log("activeAllEmployee",activeAllEmployee)

        const totalPages = Math.ceil(activeAllEmployee.length / limit);

        res.status(201).json({
            success: true,
            AlreadyAllottedVendor: vendorWhichAllotedPast || "No-Vendor In Past",
            currentPage: parseInt(Page),
            limit: parseInt(limit),
            preSelectedDay: findOrder.workingDay,
            preSelectedTime: findOrder.workingTime,
            preSelectedDate: findOrder.workingDate,
            totalPages,
            data: activeAllEmployee,
            message: 'Vendors fetched successfully',
        });

    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

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
        const vendorName = findVendor?.ownerName;

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
        const fullAddress = `${order.houseNo} ${order.address.replace(/,/g, '')} ${order.pinCode}`;

        // Send SMS notification to the vendor
        // const vendorMessage = `Hello ${vendorName}, You have been assigned a new task for ${serviceName}. The service is scheduled for ${workingDay} at ${workingTime}. The address is: ${fullAddress}. Please confirm and accept the task.`;
        const Param = [vendorName, serviceName, workingDay, workingTime, fullAddress]

        await SendWhatsapp(vendorNumber, 'update_vendor_for_new_order', Param);
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
        const fullAddress = `${order.houseNo}, ${order.address.replace(/,/g, '')}, ${order.nearByLandMark ? order.nearByLandMark + ', ' : ''}${order.pinCode}`;

        if (VendorAllotedStatus === 'Accepted') {
            order.VendorAllotedStatus = VendorAllotedStatus;

            // Save the order with the updated status
            await order.save();

            // Message for the user (optional, if needed)
            // const userMessage = `Your order for ${serviceName} (${serviceType}) has been accepted by vendor ${vendorName}. The service will be carried out at: ${fullAddress}.`;

            // Message for admin
            // const adminMessage = `Order for ${serviceName} (${serviceType}) has been accepted by vendor ${vendorName}. The service will be performed at: ${fullAddress}. Please note the vendor has accepted the task.`;

            // Send the messages (Assuming sendSMS is a function that sends SMS to the respective phone numbers)
            await SendWhatsapp(userNumber, 'order_accept_reject_status_to_user', [serviceName, serviceType, vendorName, fullAddress]);
            await SendWhatsapp(AdminNumber, 'order_accept_reject_status_to_admin', [serviceName, serviceType, vendorName, fullAddress]);
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

            // Send the rejection message to admin order_reject_by_vendor_send_to_admin
            await SendWhatsapp(AdminNumber, 'order_reject_by_vendor_send_to_admin', [serviceName, serviceType, vendorName, fullAddress]);

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
        const order = await Order.findById(id).populate('userId');
        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Order not found'
            })
        }
        const userNumber = order ? order.userId.ContactNumber : '';
        const userName = order ? order.userId.FullName : '';
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

        const Param = [userName]

        await SendWhatsapp(userNumber, 'before_work_video', Param)

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
        const order = await Order.findById(id).populate('userId');
        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Order not found'
            })
        }

        const userNumber = order ? order.userId.ContactNumber : '';
        const userName = order ? order.userId.FullName : '';
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
        const userDetail = await User.findById(order.userId)
        const userNumber = userDetail ? userDetail.ContactNumber : '';
        const userName = userDetail ? userDetail.FullName : '';
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

        const Param = [userName]

        await SendWhatsapp(userNumber, 'before_work_video', Param)

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
        const userDetail = await User.findById(order.userId)
        const userNumber = userDetail ? userDetail.ContactNumber : '';
        const userName = userDetail ? userDetail.FullName : '';
        if (!userDetail) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
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

        if (userDetail.isAMCUser === true) {
            order.OrderStatus = "Service Done"
            order.PaymentStatus = "paid"
            await order.save()

            const Param = [userName]
            await SendWhatsapp(userNumber, 'amc_user_order_done', Param)
            return res.status(200).json({
                success: true,
                message: 'After work video is uploaded',
                data: order
            })
        }


        const updatedOrder = await order.save()

        const Param = [userName]

        await SendWhatsapp(userNumber, 'after_work_video', Param)

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
            redirectUrl: `http://localhost:7987/api/v1/status-payment/${transactionId}`,
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

            const findOrder = await Order.findOne({ razorpayOrderId: merchantTransactionId }).populate('userId');
            if (!findOrder) {
                return res.status(400).json({
                    success: false,
                    message: 'Order not found.',
                });
            }

            const vendorId = findOrder?.vendorAlloted?._id;
            const vendor = await Vendor.findById(vendorId);
            const vendorRole = vendor?.Role;
            const userNumber = findOrder?.userId?.ContactNumber
            const vendorNumber = vendor?.ContactNumber
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
            const adminNumber = process.env.ADMIN_NUMBER
            await SendWhatsapp(userNumber,'payment_done_by_user_to_user',[totalAmount])
            await SendWhatsapp(vendorNumber,'payment_done_by_user_to_vendor')

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

exports.makeOrderPaymentApp = async (req, res) => {

    try {
        const { orderId } = req.params
        const { totalAmount } = req.body

        console.log(totalAmount)
        const order = await Order.findById(orderId)

        if (!order) {
            console.log("Order not found", { orderId })
            return res.status(400).json({
                success: false,
                message: "Order not found",
            })
        }

        if (!totalAmount || totalAmount <= 0) {
            console.log("Invalid total amount", { totalAmount })
            return res.status(400).json({
                success: false,
                message: "Valid total amount is required",
                error: "Total amount must be greater than 0",
            })
        }

        const integerAmount = Math.floor(totalAmount)
        const transactionId = crypto.randomBytes(9).toString("hex")
        const merchantUserId = crypto.randomBytes(12).toString("hex")

        const data = {
            merchantId: "TESTPGPAYCREDUAT",
            merchantTransactionId: transactionId,
            merchantUserId,
            amount: integerAmount * 100,
            redirectUrl: `${REDIRECT_BASE_URL}/api/v1/status-payment-app/${transactionId}`,
            redirectMode: "POST",
            callbackUrl: `${REDIRECT_BASE_URL}/api/v1/status-payment-app/${transactionId}`,
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        }



        const payload = JSON.stringify(data)
        const payloadMain = Buffer.from(payload).toString("base64")
        const keyIndex = 1
        const string = payloadMain + "/pg/v1/pay" + "14d6df8a-75bf-4873-9adf-43bc1545094f"
        const sha256 = crypto.createHash("sha256").update(string).digest("hex")
        const checksum = sha256 + "###" + keyIndex

        const options = {
            method: "POST",
            url: `${BASE_URL}/pay`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
            },
            data: {
                request: payloadMain,
            },
        }

        const response = await axios.request(options)
        console.log("Received response from PhonePe", {
            status: response.status,
            data: response.data,
        })

        if (response.data.success) {
            const updateOrder = await Order.findByIdAndUpdate(
                orderId,
                { razorpayOrderId: response.data.data.merchantTransactionId },
                { new: true },
            )
            console.log("Updated order with transaction ID", {
                orderId,
                transactionId: updateOrder.razorpayOrderId,
            })

            return res.status(201).json({
                success: true,
                url: response.data.data.instrumentResponse.redirectInfo.url,
            })
        } else {
            console.log("Payment initiation failed", response.data)
            return res.status(400).json({
                success: false,
                message: "Payment initiation failed",
                error: response.data.message,
            })
        }
    } catch (error) {
        console.error("Internal server error in makeOrderPayment", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

exports.verifyOrderPaymentApp = async (req, res) => {
    console.log("verifyOrderPayment called", {
        params: req.params,
        body: req.body,
        query: req.query,
    })

    const { merchantTransactionId } = req.params

    if (!merchantTransactionId) {
        console.log("Merchant transaction ID not provided")
        return res.status(400).json({
            success: false,
            message: "Merchant transaction ID not provided",
        })
    }

    try {
        const keyIndex = 1
        const string = `/pg/v1/status/TESTPGPAYCREDUAT/${merchantTransactionId}` + "14d6df8a-75bf-4873-9adf-43bc1545094f"
        const sha256 = crypto.createHash("sha256").update(string).digest("hex")
        const checksum = sha256 + "###" + keyIndex

        const options = {
            method: "GET",
            url: `${BASE_URL}/status/TESTPGPAYCREDUAT/${merchantTransactionId}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "X-MERCHANT-ID": `${merchantId}`,
            },
        }

        console.log("Sending status check request to PhonePe", { url: options.url })
        const { data } = await axios.request(options)
        console.log("Received status check response from PhonePe", data)

        if (data.success === true) {
            const amount = data.data.amount
            console.log("Payment successful", { amount })

            const findOrder = await Order.findOne({ razorpayOrderId: merchantTransactionId }).populate('userId');
            if (!findOrder) {
                console.log("Order not found for transaction", { merchantTransactionId })
                return res.status(400).json({
                    success: false,
                    message: "Order not found.",
                })
            }

            const vendorId = findOrder.vendorAlloted._id
            const vendor = await Vendor.findById(vendorId)
            const vendorRole = vendor.Role
            const userNumber = findOrder?.userId?.ContactNumber
            const vendorNumber = vendor?.ContactNumber
            console.log("Vendor details", { vendorId, vendorRole })

            const allCommission = await Commission.find()
            const employeeCommission = allCommission.find((item) => item.name === "Employee")
            const vendorCommission = allCommission.find((item) => item.name === "Vendor")

            let commissionPercent = 0
            if (vendorRole === "vendor") {
                commissionPercent = vendorCommission ? Number.parseFloat(vendorCommission.percent) : 0
            } else if (vendorRole === "employ") {
                commissionPercent = employeeCommission ? Number.parseFloat(employeeCommission.percent) : 0
            }

            const totalAmount = amount / 100 // Convert to actual amount from paise
            const vendorCommissionAmount = (commissionPercent / 100) * totalAmount
            const adminCommissionAmount = totalAmount - vendorCommissionAmount

            console.log("Commission calculation", {
                totalAmount,
                commissionPercent,
                vendorCommissionAmount,
                adminCommissionAmount,
            })

            findOrder.totalAmount = totalAmount
            findOrder.commissionPercent = commissionPercent
            findOrder.vendorCommissionAmount = vendorCommissionAmount
            findOrder.adminCommissionAmount = adminCommissionAmount
            findOrder.transactionId = data.data.merchantTransactionId
            findOrder.PaymentStatus = "paid"
            findOrder.OrderStatus = "Service Done"
            vendor.walletAmount += vendorCommissionAmount

            await vendor.save()
            await findOrder.save()
            await SendWhatsapp(userNumber,'payment_done_by_user_to_user',[totalAmount])
            await SendWhatsapp(vendorNumber,'payment_done_by_user_to_vendor')

            console.log("Order and vendor updated successfully")

            const successRedirect = `${REDIRECT_BASE_URL}/successfull-payment-app?orderId=${findOrder._id}`
            console.log("Redirecting to success page", { successRedirect })
            return res.redirect(successRedirect)
        } else {
            console.log("Payment verification failed", data)
            const failureRedirect = `${REDIRECT_BASE_URL}/failed-payment`
            console.log("Redirecting to failure page", { failureRedirect })
            return res.redirect(failureRedirect)
        }
    } catch (error) {
        console.error("Internal server error in verifyOrderPayment", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

exports.updateErrorCodeInOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { errorCode } = req.body; // This could be a single ObjectId or an array of ObjectIds

        const order = await Order.findById(id);

        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found",
            });
        }

        // Ensure errorCode is always an array
        if (!Array.isArray(errorCode)) {
            return res.status(400).json({
                success: false,
                message: "errorCode must be an array",
            });
        }

        // Update the errorCode array
        order.errorCode = [...new Set([...order.errorCode, ...errorCode])];  // Avoid duplicates

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Error code(s) updated successfully",
            data: order
        });

    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

exports.getSingleOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
            .populate({
                path: 'errorCode',
                populate: {
                    path: 'Heading', // assuming 'heading' is a reference to another model
                    model: 'ErrorCodeHeading' // replace with the actual model name if necessary
                }
            });

        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order
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



exports.getAllDataOfVendor = async (req, res) => {
    try {
        const { vendorId } = req.query || {}
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: "Vendor ID is required"
            })
        }

        const foundInOrders = await Order.find({
            vendorAlloted: vendorId,
            OrderStatus: "Service Done"
        }).populate('errorCode EstimatedBill serviceId')

        if (foundInOrders.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No data found",
                data: []
            })
        }

        const calculateEarning = foundInOrders.reduce((acc, item) => (
            acc + item.adminCommissionAmount
        ), 0)

        const calculateTotalOrders = foundInOrders.length

        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            data: {
                earning: calculateEarning,
                totalOrders: calculateTotalOrders,
                orders: foundInOrders
            }
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

exports.serviceDoneOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('userId');
        const userNumber = order ? order.userId.ContactNumber : '';
        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found",
            });
        }
        order.OrderStatus = "Service Done";
        order.PaymentStatus = "paid"
        await SendWhatsapp(userNumber,'order_done_to_user');
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order,
        });
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}