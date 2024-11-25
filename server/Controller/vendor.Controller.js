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
            address,
            Email,
            ownerName,
            ContactNumber,
            panNo,
            gstNo,
            adharNo,
            Password,
            RangeWhereYouWantService,
            Role,
            HouseNo,
            PinCode
        } = req.body;

        const emptyField = [];
        if (!companyName) emptyField.push('Company Name');
        if (!yearOfRegistration) emptyField.push('Year Of Registration');
        if (!address) emptyField.push('Register Address');
        if (!HouseNo) emptyField.push('House no');
        if (!PinCode) emptyField.push('Pincode');
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
        // console.log("existingVendorEmail tt", existingVendorEmail);
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
            address,
            Email,
            ownerName,
            ContactNumber,
            panNo,
            gstNo,
            adharNo,
            Password,
            RangeWhereYouWantService,
            Role,
            HouseNo,
            PinCode
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
                if (await fs.access(panImage[0].path).then(() => true).catch(() => false)) {
                    await fs.unlink(panImage[0].path);
                    console.log("unlink panimage")
                } else {
                    console.warn("File not found, skipping unlink:", panImage[0].path);
                }
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
                if (await fs.access(adharImage[0].path).then(() => true).catch(() => false)) {
                    await fs.unlink(adharImage[0].path);
                    console.log("unlink adharImage")
                } else {
                    console.warn("File not found, skipping unlink:", adharImage[0].path);
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Please upload Adhar Image"
                });
            }



            if (gstImage && gstImage[0]) {
                const imgUrl = await uploadImage(gstImage[0].path);
                newVendor.gstImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);

                // Unlink after successful upload
                if (await fs.access(gstImage[0].path).then(() => true).catch(() => false)) {
                    await fs.unlink(gstImage[0].path);
                    console.log("File unlinked successfully");
                }
                else {
                    console.warn("File not found, skipping unlink:", gstImage[0].path);
                }
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

exports.updateReadyToWork = async (req, res) => {
    try {
        const id = req.params._id;
        console.log("i am hit")
        const { readyToWork } = req.body;
        const existingVendor = await Vendor.findById(id)
        console.log("existingVendor",existingVendor)

        if (!existingVendor) {
            return res.status(400).json({
                success: false,
                message: 'Vendor is not founded'
            })
        }

        existingVendor.readyToWork = readyToWork;
        await existingVendor.save()

        res.status(200).json({
            success: true,
            message: 'Vendor updated successfully',
            data: existingVendor
        })

    } catch (error) {
        console.log("Internal server error in updating ready to work", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in updating ready to work',
            error: error.message
        })
    }
}

exports.addVendorMember = async (req, res) => {
    try {
        // console.log('i am hit')
        const { vendorId } = req.params;
        // console.log(req.params)
        const { members } = req.body;

        const memberAdharImages = req.files['memberAdharImage']; // Array of uploaded files


        if (!vendorId || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vendor ID and members array are required.'
            });
        }


        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found.'
            });
        }

        const addedMembers = [];

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
            // console.log("vendor image",memberAdharImage.path)
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
            // await fs.unlink(memberAdharImage.path);
            if (await fs.access(memberAdharImage.path).then(() => true).catch(() => false)) {
                await fs.unlink(memberAdharImage.path);
            } else {
                console.warn("File not found, skipping unlink:", memberAdharImage.path);
            }
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

exports.deleteVendorMember = async (req, res) => {
    const { userId, memberId } = req.params;

    try {
        // Find the vendor by userId
        const vendor = await Vendor.findOne({ _id: userId });
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        // Find the member in the vendor's member array
        const member = vendor.member.find(m => m._id.toString() === memberId);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        // Check if the member has an Aadhar image to delete
        if (member.memberAdharImage && member.memberAdharImage.public_id) {
            // Delete the image from Cloudinary
            await deleteImageFromCloudinary(member.memberAdharImage.public_id);
        }

        // Filter out the member to delete
        vendor.member = vendor.member.filter(m => m._id.toString() !== memberId);

        // Save the updated vendor document
        await vendor.save();

        res.status(200).json({ success: true, message: 'Vendor member deleted successfully' });
    } catch (error) {
        console.error('Error deleting vendor member:', error);
        res.status(500).json({ success: false, message: 'Failed to delete vendor member' });
    }
};

exports.addNewVendorMember = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { name } = req.body;
        const memberAdharImage = req.file; // Assuming single file upload for Aadhar image

        // Check if vendorId is provided
        if (!vendorId || !name) {
            return res.status(400).json({
                success: false,
                message: 'Vendor ID and member name are required.'
            });
        }

        // Find the vendor by ID
        const vendor = await Vendor.findById(vendorId);

        // Check if the vendor exists
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found.'
            });
        }

        // Handle the uploaded Aadhar image (if provided)
        let memberAdharImageData = null;
        if (memberAdharImage) {
            // Assuming you have an uploadImage function to handle Cloudinary or similar services
            const imgUrl = await uploadImage(memberAdharImage.path);
            memberAdharImageData = {
                url: imgUrl.image,
                public_id: imgUrl.public_id
            };

            // Cleanup the uploaded file
            // await fs.unlink(memberAdharImage.path);
            if (await fs.access(memberAdharImage.path).then(() => true).catch(() => false)) {
                await fs.unlink(memberAdharImage.path);
            } else {
                console.warn("File not found, skipping unlink:", memberAdharImage.path);
            }
        }

        // Add new member to the vendor's members array
        const newMember = {
            name: name,
            memberAdharImage: memberAdharImageData
        };
        vendor.member.push(newMember);

        // Save the updated vendor document
        await vendor.save();

        return res.status(200).json({
            success: true,
            message: 'Member added successfully.',
            member: newMember
        });

    } catch (error) {
        console.error(error);
        // Handle any errors that occurred during the process
        res.status(500).json({
            success: false,
            message: 'Internal server error while adding member.',
            error: error.message
        });
    }
};


exports.getMembersByVendorId = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Check if vendorId is provided
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: 'Vendor ID is required.'
            });
        }

        // Find the vendor by ID and return only the members array
        const vendor = await Vendor.findById(vendorId).select('member');

        // Check if the vendor exists
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found.'
            });
        }

        // Return the members array
        return res.status(200).json({
            success: true,
            data: vendor.member
        });
    } catch (error) {
        console.error(error);
        // Handle any errors that occurred during the process
        res.status(500).json({
            success: false,
            message: 'Internal server error while retrieving members.',
            error: error.message
        });
    }
};

exports.updateMember = async (req, res) => {
    try {
        const { vendorId, memberId } = req.params;

        const { name } = req.body;
        const memberAdharImage = req.file;

        if (!vendorId || !memberId) {
            return res.status(400).json({
                success: false,
                message: 'Vendor ID and Member ID are required.'
            });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found.'
            });
        }

        const memberIndex = vendor.member.findIndex(m => m._id.toString() === memberId);
        if (memberIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Member not found.'
            });
        }

        if (name) {
            vendor.member[memberIndex].name = name;
        }

        // If an Aadhar image is uploaded, update it
        if (memberAdharImage) {
            if (vendor.member[memberIndex].memberAdharImage) {
                await deleteImageFromCloudinary(vendor.member[memberIndex].memberAdharImage.public_id); // Pass the old public ID
            }
            const imgUrl = await uploadImage(memberAdharImage.path);
            vendor.member[memberIndex].memberAdharImage = {
                url: imgUrl.image,
                public_id: imgUrl.public_id
            };

            // await fs.unlink(memberAdharImage.path);
            if (await fs.access(memberAdharImage.path).then(() => true).catch(() => false)) {
                await fs.unlink(memberAdharImage.path);
            } else {
                console.warn("File not found, skipping unlink:", memberAdharImage.path);
            }
        }

        await vendor.save();

        return res.status(200).json({
            success: true,
            message: 'Member updated successfully.',
            member: vendor.member[memberIndex]
        });

    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating member.',
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
            // res.redirect('http://localhost:5174/successfull-payment')
            res.status(200).json({
                success: true,
                data: vendor
            })
        }

        const planPrice = foundMembershipPlan.price;
        console.log("Plan", planPrice)
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
        // res.redirect('http://localhost:5174/successfull-payment')
        res.status(400).json({
            success: true,
            message: 'Payment successful',
        })
    } catch (error) {
        console.log(error)
        // res.redirect(`http://localhost:5174/failed-payment?error=${error?.message || "Internal server Error"}`)

        res.status(501).json({
            success: false,
            message: 'Payment verified failed',
        })
    }
}


exports.vendorLogin = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const availablevendor = await Vendor.findOne({ Email })

        if (!availablevendor) {
            return res.status(400).json({
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

exports.ChangeOldVendorPassword = async (req, res) => {
    try {
        const vendorId = req.params._id;
        const { Password, NewPassword } = req.body;

        if (!Password) {
            return res.status(400).json({
                success: false,
                message: 'Old Password is required'
            });
        }

        if (!NewPassword) {
            return res.status(400).json({
                success: false,
                message: 'New Password is required'
            });
        }

        console.log('vendorid', vendorId)

        const user = await Vendor.findById(vendorId);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        const isMatch = await user.comparePassword(Password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Enter Correct Old Password'
            });
        }

        user.Password = NewPassword;

        await user.save();
        res.status(200).json({
            success: true,
            msg: 'Password changed successfully'
        });

    } catch (error) {
        console.log("Internal server error in changing password")
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
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
            return res.status(404).json({
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

        console.log("vendor", vendor)
        console.log("Email", Email)

        if (!vendor) {
            return res.status(400).json({
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

        res.status(200).json({
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

        res.status(200).json({
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
        const allVendor = await Vendor.find().populate('memberShipPlan workingHour')
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

exports.updateVendor = async (req, res) => {
    const uploadedImages = [];
    try {
        const vendorId = req.params._id;
   
        const {
            companyName,
            yearOfRegistration,
            address,
            HouseNo,
            PinCode,
            Email,
            ownerName,
            ContactNumber,
            panNo,
            gstNo,
            adharNo,
            RangeWhereYouWantService
        } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        if (Email && Email !== vendor.Email) {
            const existingVendorEmail = await Vendor.findOne({ Email });
            if (existingVendorEmail) {
                return res.status(403).json({
                    success: false,
                    message: "Email already exists as a Vendor"
                });
            }
        }

        if (ContactNumber && ContactNumber !== vendor.ContactNumber) {
            const existingVendorNumber = await Vendor.findOne({ ContactNumber });
            if (existingVendorNumber) {
                return res.status(403).json({
                    success: false,
                    message: "Contact number already exists as a Vendor"
                });
            }
        }

        vendor.companyName = companyName || vendor.companyName;
        vendor.yearOfRegistration = yearOfRegistration || vendor.yearOfRegistration;
        vendor.address = address || vendor.address;
        vendor.HouseNo = HouseNo || vendor.HouseNo;
        vendor.PinCode = PinCode || vendor.PinCode;
        vendor.Email = Email || vendor.Email;
        vendor.ownerName = ownerName || vendor.ownerName;
        vendor.ContactNumber = ContactNumber || vendor.ContactNumber;
        vendor.panNo = panNo || vendor.panNo;
        vendor.gstNo = gstNo || vendor.gstNo;
        vendor.adharNo = adharNo || vendor.adharNo;
        if (RangeWhereYouWantService) {
            // console.log("New RangeWhereYouWantService:", RangeWhereYouWantService);
        
            // Validate the new RangeWhereYouWantService
            const isValidRange = RangeWhereYouWantService.every((service, index) => {
                console.log(`Checking service at index ${index}:`, service);
        
                const location = service?.location;
                console.log(`Location:`, location);
        
                const type = location?.type;
                console.log(`Type:`, type);
        
                const coordinates = location?.coordinates;
                console.log(`Coordinates:`, coordinates);
        
                const isTypeValid = type === "Point";
                const areCoordinatesArray = Array.isArray(coordinates);
                const hasTwoCoordinates = areCoordinatesArray && coordinates.length === 2;
                const areCoordinatesValid = hasTwoCoordinates && coordinates.every(coord => coord !== "" && coord !== null && coord !== undefined);
        
                // console.log(`isTypeValid:`, isTypeValid);
                // console.log(`areCoordinatesArray:`, areCoordinatesArray);
                // console.log(`hasTwoCoordinates:`, hasTwoCoordinates);
                // console.log(`areCoordinatesValid:`, areCoordinatesValid);
        
                return isTypeValid && areCoordinatesArray && hasTwoCoordinates && areCoordinatesValid;
            });
        
            if (isValidRange) {
                const isDifferent = JSON.stringify(RangeWhereYouWantService) !== JSON.stringify(vendor.RangeWhereYouWantService);
        
                if (isDifferent) {
                    vendor.RangeWhereYouWantService = RangeWhereYouWantService;
                    console.log("RangeWhereYouWantService updated.");
                } else {
                    console.log("No change detected in RangeWhereYouWantService.");
                }
            } else {
                console.warn("Invalid RangeWhereYouWantService format provided. Skipping update.");
            }
        }
        

        if (req.files) {
            const { panImage, adharImage, gstImage, vendorImage } = req.files;

            // Upload and update Pan Image
            if (panImage && panImage[0]) {
                if (vendor.panImage?.public_id) {
                    await deleteImageFromCloudinary(vendor.panImage.public_id);
                }
                const imgUrl = await uploadImage(panImage[0]?.path);
                vendor.panImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                // await fs.unlink(panImage[0].path);
                if (await fs.access(panImage[0].path).then(() => true).catch(() => false)) {
                    await fs.unlink(panImage[0].path);
                } else {
                    console.warn("File not found, skipping unlink:", panImage[0].path);
                }
            }

            // Upload and update Adhar Image
            if (adharImage && adharImage[0]) {
                if (vendor.adharImage?.public_id) {
                    await deleteImageFromCloudinary(vendor.adharImage.public_id);
                }
                const imgUrl = await uploadImage(adharImage[0]?.path);
                vendor.adharImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                // await fs.unlink(adharImage[0].path);
                if (await fs.access(adharImage[0].path).then(() => true).catch(() => false)) {
                    await fs.unlink(adharImage[0].path);
                } else {
                    console.warn("File not found, skipping unlink:", adharImage[0].path);
                }
            }

            // Upload and update GST Image
            if (gstImage && gstImage[0]) {
                if (vendor.gstImage?.public_id) {
                    await deleteImageFromCloudinary(vendor.gstImage.public_id);
                }
                const imgUrl = await uploadImage(gstImage[0]?.path);
                vendor.gstImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                // await fs.unlink(gstImage[0].path);
                if (await fs.access(gstImage[0].path).then(() => true).catch(() => false)) {
                    await fs.unlink(gstImage[0].path);
                } else {
                    console.warn("File not found, skipping unlink:", gstImage[0].path);
                }
            }

            // Upload and update GST Image
            if (vendorImage && vendorImage[0]) {
                if (vendor.vendorImage?.public_id) {
                    await deleteImageFromCloudinary(vendor.vendorImage.public_id);
                }
                const imgUrl = await uploadImage(vendorImage[0]?.path);
                vendor.vendorImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                if (await fs.access(vendorImage[0].path).then(() => true).catch(() => false)) {
                    await fs.unlink(vendorImage[0].path);
                } else {
                    console.warn("File not found, skipping unlink:", vendorImage[0].path);
                }
            }
        }

        const updatedVendor = await vendor.save();

        res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
            data: updatedVendor
        });
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
            message: 'Internal server error in updating vendor',
            error: error.message
        });
    }
};

exports.getSingleVendor = async (req, res) => {
    try {
        const vendorId = req.params._id;
        const vendor = await Vendor.findById(vendorId).populate('memberShipPlan workingHour');
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Vendor not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Vendor found",
            data: vendor
        })
    } catch (error) {
        console.log("Internal server error in getting single vendor", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })

    }
}

exports.sendOtpForVerification = async (req, res) => {
    try {
        console.log("i am hit")
        const { Email } = req.body;
        if (!Email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        const vendor = await Vendor.findOne({ Email });
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Vendor not found"
            })
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10);

        // await Vendor.findOneAndUpdate(
        //     { Email },
        //     {
        //         $set: {
        //             VerifyOTP: OTP,
        //             OtpExpiredTime: OTPExpires
        //         }
        //     },
        //     { new: true }
        // )

        vendor.VerifyOTP = OTP,
            vendor.OtpExpiredTime = OTPExpires
        await vendor.save()

        const emailOptions = {
            email: Email,
            subject: 'Account Verification OTP',
            message: `
                <html>
                <head>
                </head>
                <body>
                    <p>Hello,</p>
                    <p>Your OTP for verifying your account is: <strong>${OTP}</strong></p>
                    <p>Please enter this OTP within 10 minutes to complete your account verification.</p>
                    <p>If you did not request this, please disregard this email.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p>Team Blueace India</p>
                </body>
                </html>
            `
        };


        await sendEmail(emailOptions)

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })

    } catch (error) {
        console.log("Internal server error in sending otp for verifing vendor", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.verifyVendor = async (req, res) => {
    try {
        const { Email, VerifyOTP } = req.body;

        // console.log("Email",Email)

        // Check if the Email is provided
        if (!Email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Find the vendor by email
        const vendor = await Vendor.findOne({ Email });
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: 'Vendor not found',
            });
        }

        // Check if OTP has expired
        const currentTime = new Date();
        if (vendor.OtpExpiredTime && currentTime > vendor.OtpExpiredTime) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.',
            });
        }

        // Verify the OTP
        // if (vendor.VerifyOTP !== VerifyOTP) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Invalid OTP',
        //     });
        // }

        if (String(vendor.VerifyOTP) !== String(VerifyOTP)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }


        vendor.verifyed = true;
        vendor.VerifyOTP = '';
        vendor.OtpExpiredTime = null;
        await vendor.save();


        // Generate token if OTP is correct
        // const token = await generateToken(vendor._id);
        res.status(200).json({
            success: true,
            message: 'Vendor verified successfully',
            data: vendor,
        });
    } catch (error) {
        console.error("Internal server error in verifying vendor", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

exports.resendVerifyOtp = async (req, res) => {
    try {
        const { Email } = req.body;
        const vendor = await Vendor.findOne({ Email })

        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: 'Vendor not found',
            })
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10);

        // await Vendor.findOneAndUpdate(
        //     { Email },
        //     {
        //         $set: {
        //             VerifyOTP: OTP,
        //             OtpExpiredTime: OTPExpires
        //         }
        //     },
        //     { new: true }
        // )

        vendor.VerifyOTP = OTP,
            vendor.OtpExpiredTime = OTPExpires
        await vendor.save()

        const emailOptions = {
            email: Email,
            subject: 'Resend: Verify Your Account with OTP',
            message: `
                <html>
                <head>
                </head>
                <body>
                    <p>Dear User,</p>
                    <p>We noticed that you requested to resend the OTP for verifying your account. Your new OTP is: <strong>${OTP}</strong></p>
                    <p>Please use this OTP within the next 10 minutes to complete your account verification process.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <br>
                    <p>Thank you,</p>
                    <p>Team Blueace India</p>
                </body>
                </html>
            `
        };


        await sendEmail(emailOptions)

        res.status(200).json({
            success: true,
            message: "OTP Resent successfully"
        })

    } catch (error) {
        console.log("Internal server error in resending otp", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in resending otp',
        })
    }
}