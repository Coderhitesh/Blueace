const Vendor = require('../Model/vendor.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../Utils/Cloudnary');
const sendEmail = require('../Utils/SendEmail');
const sendToken = require('../Utils/SendToken');
const fs = require('fs').promises;
const axios = require('axios')


const crypto = require('crypto')
const MembershipPlan = require('../Model/memberShip.Model')
const Razorpay = require('razorpay');
const User = require('../Model/UserModel');
require('dotenv').config()
// Initialize Razorpay instance with your key and secret
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,   // Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Razorpay Secret Key
});

exports.registerVendor = async (req, res) => {
    const uploadedImages = [];
    try {
        console.log('data', req.body);
        const {
            companyName,
            yearOfRegistration,
            registerAddress,
            Email,
            ownerName,
            ContactNumber,
            panNo,
            gstNo,
            adharNo,
            Password,
            RangeWhereYouWantService
        } = req.body;

        const emptyField = [];
        if (!companyName) emptyField.push('Company Name');
        if (!yearOfRegistration) emptyField.push('Year Of Registration');
        if (!registerAddress) emptyField.push('Register Address');
        if (!Email) emptyField.push('Email');  // Updated field name to 'Email'
        if (!ownerName) emptyField.push('Owner Name');
        if (!ContactNumber) emptyField.push('Contact Number');
        if (!panNo) emptyField.push('Pan No');
        if (!gstNo) emptyField.push('GST No');
        if (!adharNo) emptyField.push('Adhar No');
        if (!Password) emptyField.push('Password');
        if (!RangeWhereYouWantService) emptyField.push('Range Where You Want Service');

        if (emptyField.length > 0) {
            return res.status(400).json({ message: `Please fill all the fields ${emptyField.join(', ')}` });
        }

        // Check for existing vendor email
        const existingVendorEmail = await Vendor.findOne({ Email });
        console.log("existingVendorEmail", existingVendorEmail);
        if (existingVendorEmail) {
            return res.status(403).json({
                success: false,
                message: "Email already exists as a Vendor"
            });
        }

        // Check for existing vendor number
        const existingVendorNumber = await Vendor.findOne({ ContactNumber });
        if (existingVendorNumber) {
            return res.status(403).json({
                success: false,
                message: "Number already exists as a Vendor"
            });
        }

        // Check for existing user email
        const existingUserEmail = await User.findOne({ Email });
        if (existingUserEmail) {
            return res.status(403).json({
                success: false,
                message: "Email already exists as a Customer"
            });
        }

        // Check for existing user number
        const existingUserNumber = await User.findOne({ ContactNumber });
        if (existingUserNumber) {
            return res.status(403).json({
                success: false,
                message: "Number already exists as a User"
            });
        }

        // Password length validation
        if (Password.length <= 6) {
            return res.status(403).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const newVendor = new Vendor({
            companyName,
            yearOfRegistration,
            registerAddress,
            Email,
            ownerName,
            ContactNumber,
            panNo,
            gstNo,
            adharNo,
            Password,
            RangeWhereYouWantService
        });

        // Handle main vendor images
        if (req.files) {
            const { panImage, adharImage, gstImage, vendorImage } = req.files;

            // Upload Pan Image
            if (panImage && panImage[0]) {
                const imgUrl = await uploadImage(panImage[0]?.path);
                newVendor.panImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                await fs.unlink(panImage[0].path);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Please upload Pan Image"
                });
            }

            // Upload Adhar Image
            if (adharImage && adharImage[0]) {
                const imgUrl = await uploadImage(adharImage[0]?.path);
                newVendor.adharImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                await fs.unlink(adharImage[0].path);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Please upload Adhar Image"
                });
            }

            // Upload GST Image
            if (gstImage && gstImage[0]) {
                const imgUrl = await uploadImage(gstImage[0]?.path);
                newVendor.gstImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                await fs.unlink(gstImage[0].path);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Please upload GST Image"
                });
            }
        }

        // Save the new vendor
        const newVendorSave = await newVendor.save();

        // Check if save was successful
        if (!newVendorSave) {
            for (let public_id of uploadedImages) {
                await deleteImageFromCloudinary(public_id);
            }
            return res.status(400).json({
                success: false,
                message: "Failed to save vendor and delete uploaded images"
            });
        }

        // Send welcome email
        const emailOptions = {
            email: Email,
            subject: 'Welcome to Blueace!',
            message: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            background-color: #f5f5f5;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .header {
                            background-color: #007bff;
                            color: #fff;
                            padding: 10px;
                            text-align: center;
                            border-top-left-radius: 8px;
                            border-top-right-radius: 8px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content p {
                            margin-bottom: 10px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Blueace!</h1>
                        </div>
                        <div class="content">
                            <p>Dear ${ownerName},</p>
                            <p>Thank you for registering with Blueace. We are delighted to have you as a part of our community.</p>
                            <p>If you have any questions or need assistance, please feel free to contact us.</p>
                        </div>
                        <div class="footer">
                            <p>Best regards,</p>
                            <p>Blueace Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await sendEmail(emailOptions);
        await sendToken(newVendorSave, res, 201);

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `${duplicateField} already exists`
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error in registering vendor',
            error: error.message
        });
    }
};


exports.addVendorMember = async (req, res) => {
    try {

        const { vendorId } = req.params;
        const { members } = req.body;


        // Handle uploaded files correctly
        const memberAdharImages = req.files['memberAdharImage']; // Array of uploaded files

        // Check if members exist
        if (!vendorId || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vendor ID and members array are required.'
            });
        }

        // Find vendor by ID
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found.'
            });
        }

        const addedMembers = []; // Store newly added members

        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            const { name } = member;

            // Get the corresponding Aadhar image for this member
            const memberAdharImage = memberAdharImages[i];

            // if (!name || !memberAdharImage) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Name and Aadhar image are required for each member.'
            //     });
            // }

            // Upload the member Aadhar image to Cloudinary or your image hosting service
            const imgUrl = await uploadImage(memberAdharImage.path);
            const memberData = {
                name,
                memberAdharImage: {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id,
                },
            };

            vendor.member.push(memberData); // Add to vendor's members array
            addedMembers.push(memberData);

            // Cleanup the uploaded file
            await fs.unlink(memberAdharImage.path);
        }

        // Save the vendor with the new members
        await vendor.save();

        return res.status(201).json({
            success: true,
            message: 'Members added successfully.',
            members: addedMembers,
        });

    } catch (error) {
        console.error(error);
        // Handle any errors that occurred during the process
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error while adding members.',
            error: error.message
        });
    }
};


exports.memberShipPlanGateWay = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { memberShipPlan } = req.body;

        // Find vendor by ID
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found.',
            });
        }

        // Check if the vendor already has a membership plan
        // if (vendor.memberShipPlan) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Vendor already has a membership plan.',
        //     });
        // }

        // Find membership plan by ID
        const foundMembershipPlan = await MembershipPlan.findById(memberShipPlan);
        if (!foundMembershipPlan) {
            return res.status(404).json({
                success: false,
                message: 'Membership plan not found.',
            });
        }
        console.log(foundMembershipPlan)
        // Update vendor's membership plan
        vendor.memberShipPlan = memberShipPlan;

        if (foundMembershipPlan.price === 0 || foundMembershipPlan.name === 'Free' || foundMembershipPlan.name === 'free') {
            vendor.PaymentStatus = 'paid'
            await vendor.save();
            console.log("I am Done with free")
            return res.status(200).json({
                success: true,
                message: 'Membership plan updated successfully with free plan.',
                data: vendor
            });
        }

        const planPrice = foundMembershipPlan.price;
        console.log("Plane", planPrice)
        if (!planPrice && planPrice !== 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price.',
            });
        }

        if (planPrice) {
            const razorpayOptions = {
                amount: planPrice * 100 || 5000000,
                currency: 'INR',
                payment_capture: 1,
            };

            const razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);

            if (!razorpayOrder) {
                return res.status(500).json({
                    success: false,
                    message: 'Error in creating Razorpay order',
                });
            }

            // Update the vendor's membership price and orderId (for tracking)
            vendor.memberShipPrice = planPrice;
            vendor.razorpayOrderId = razorpayOrder.id; // Store Razorpay orderId for later tracking
            await vendor.save();

            // Send the Razorpay order information to the frontend
            return res.status(200).json({
                success: true,
                message: 'Razorpay order created successfully',
                data: {
                    vendor,
                    razorpayOrder,
                }
            });
        }

    } catch (error) {
        console.log("Internal server error in membership plan gateway", error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error in membership plan gateway',
            error: error.message
        });
    }
};


exports.PaymentVerify = async (req, res) => {
    try {

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
        console.log(req.body)

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request',
            })
        }

        const genreaterSignature = crypto.createHash('SHA256', {
            razorpay_payment_id,
            razorpay_order_id,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        }).update(process.env.RAZORPAY_KEY_SECRET).digest('hex')

        // console.log(genreaterSignature)

        if (!genreaterSignature === razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid signature',
            })
        }

        const paymentDetails = await axios.get(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
            auth: {
                username: process.env.RAZORPAY_KEY_ID,
                password: process.env.RAZORPAY_KEY_SECRET,
            }
        });

     
        const { method, status, bank, wallet, card_id } = paymentDetails.data;

        // If payment is not successful, handle failure
        if (status !== 'captured') {
            return res.redirect(`http://localhost:5174/vendors/payment-failure?error=Payment failed via ${method || 'unknown method'}`);
        }

        // Find the order in the database
        const findOrder = await Vendor.findOne({ razorpayOrderId: razorpay_order_id });
        if (!findOrder) {
            return res.status(400).json({
                success: false,
                message: 'Order not found.',
            });
        }

        // Update order details with payment status and method
        findOrder.transactionId = razorpay_payment_id;
        findOrder.PaymentStatus = 'paid';
        findOrder.paymentMethod = method; 
        
        await findOrder.save();


        res.redirect('http://localhost:5174/successfull-payment')
    } catch (error) {
        console.log(error)
        res.redirect(`http://localhost:5174/failed-payment?error=${error?.message || "Internal server Error"}`)

        // res.status(501).json({
        //     success: false,
        //     message: 'Payment verified failed',
        // })
    }
}


exports.vendorLogin = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const availablevendor = await Vendor.findOne({ Email })

        if (!availablevendor) {
            return res.staus(400).json({
                success: false,
                message: 'Vendor not found'
            })
        }

        const isMatch = await availablevendor.comparePassword(Password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            })
        }

        await sendToken(availablevendor, res, 201)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in vendor login',
        })
    }
}

exports.vendorLogout = async (req, res) => {
    try {
        res.clearCookie('token')
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in vendor logout',
        })
    }
}

exports.vendorPasswordChangeRequest = async (req, res) => {
    try {
        const { Email, NewPassword } = req.body;
        if (NewPassword.length <= 6) {
            return res.status(404).json({
                success: false,
                message: 'Password must be at least 7 characters long'
            })
        }

        const existingVendor = await Vendor.findOne({ Email });
        if (!existingVendor) {
            return res.staus(404).json({
                success: false,
                message: 'Vendor not found'
            })
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10);

        await Vendor.findOneAndUpdate(
            { Email },
            {
                $set: {
                    PasswordChangeOtp: OTP,
                    OtpExpiredTime: OTPExpires,
                    NewPassword: NewPassword
                }
            },
            { new: true }
        )

        const emailOptions = {
            email: Email,
            subject: 'Password Reset OTP',
            message: `
                <html>
                <head>
                </head>
                <body>
                    <p>Your OTP for password reset is: <strong>${OTP}</strong></p>
                    <p>Please use this OTP within 10 minutes to reset your password.</p>
                </body>
                </html>
            `
        };

        await sendEmail(emailOptions);

        res.status(200).json({
            success: true,
            message: 'Password reset OTP sent to your email'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in vendor password change request',
        })
    }
}

exports.VendorVerifyOtpAndChangePassword = async (req, res) => {
    try {
        const { Email, PasswordChangeOtp, NewPassword } = req.body;
        const vendor = await Vendor.findOne({
            Email,
            PasswordChangeOtp: PasswordChangeOtp,
            OtpExpiredTime: { $gt: Date.now() }
        });

        if (!vendor) {
            return res.staus(400).json({
                success: false,
                message: 'Invalid OTP or OTP has expired',
            })
        }

        vendor.Password = NewPassword;
        vendor.PasswordChangeOtp = undefined;
        vendor.OtpExpiredTime = undefined;
        vendor.NewPassword = undefined;

        await vendor.save();

        const successEmailOptions = {
            email: Email,
            subject: 'Password Changed Successfully',
            message: `
                <html>
                <head>
                   
                </head>
                <body>
                    <p>Your password has been successfully changed.</p>
                    <p>If you did not perform this action, please contact us immediately.</p>
                </body>
                </html>
            `
        }

        await sendEmail(successEmailOptions)

        res.staus(200).json({
            success: true,
            message: 'Password changed successfully',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

exports.vendorResendOTP = async (req, res) => {
    try {
        const { Email } = req.body;
        const vendor = await Vendor.findOne({ Email });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor is not found'
            })
        }

        const OTP = Math.floor(100000 + Math.random() * 900000)
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10);

        vendor.PasswordChangeOtp = OTP;
        vendor.OtpExpiredTime = OTPExpires;
        await vendor.save();

        const emailOptions = {
            email: Email,
            subject: 'Password Reset OTP',
            message: `
                <html>
                <head>
                
                </head>
                <body>
                    <p>Your new OTP for password reset is: <strong>${OTP}</strong></p>
                    <p>Please use this OTP within 10 minutes to reset your password.</p>
                </body>
                </html>
            `
        }

        await sendEmail(emailOptions);

        res.staus(200).json({
            success: true,
            message: 'New OTP sent successfully. Check your email.'
        })

    } catch (error) {
        console.log("Internal server error in resendOTP", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        })
    }
}

exports.getAllVendor = async (req, res) => {
    try {
        const allVendor = await Vendor.find()
        if (!allVendor) {
            return res.status(404).json({
                success: false,
                message: 'No vendor found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Vendor Founded',
            data: allVendor
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            message: error.message
        })
    }
}

exports.updateDeactive = async (req, res) => {
    try {
        const id = req.params._id;
        const { isDeactive } = req.body;
        const vendor = await Vendor.findById(id)
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor is not found'
            })
        }
        vendor.isDeactive = isDeactive;
        await vendor.save();

        res.status(200).json({
            success: true,
            message: 'Vendor updated successfully',
        })

    } catch (error) {
        console.log("Internal server error in updating deactive status", error)
        res.status(500).json({
            success: false,
            message: ' Internal Server Error',
        })
    }
}

exports.deleteVendor = async (req, res) => {
    try {
        const id = req.params._id;
        const vendor = await Vendor.findById(id)
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: 'Vendor not found'
            })
        }
        const deleteVendor = await Vendor.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Vendor deleted successfully',
            data: deleteVendor
        })
    } catch (error) {
        console.log("Internal server error in deleting the vendor", error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in deleting vendor',
        })
    }
}