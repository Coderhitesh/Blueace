const Vendor = require('../Model/vendor.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../Utils/Cloudnary');
const sendEmail = require('../Utils/SendEmail');
const sendToken = require('../Utils/SendToken');
const fs = require('fs').promises;
const axios = require('axios')

const crypto = require('crypto')
const Razorpay = require('razorpay');
const MembershipPlan = require('../Model/memberShip.Model')
const User = require('../Model/UserModel');
const { sendSMS } = require('../Utils/SMSSender');
const Order = require('../Model/Order.Model');
require('dotenv').config()
// Initialize Razorpay instance with your key and secret
// const razorpayInstance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,   // Razorpay Key ID
//     key_secret: process.env.RAZORPAY_KEY_SECRET, // Razorpay Secret Key
// });
const merchantId = process.env.PHONEPAY_MERCHANT_ID
const apiKey = process.env.PHONEPAY_API_KEY

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
            PinCode,
            createdFrom
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
        // if (!gstNo) emptyField.push('GST No');
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
            PinCode,
            createdFrom
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
        // const emailOptions = {
        //     email: Email,
        //     subject: 'Welcome to Blueace!',
        //     message: `
        //         <html>
        //         <head>
        //             <style>
        //                 body {
        //                     font-family: Arial, sans-serif;
        //                     line-height: 1.6;
        //                     background-color: #f5f5f5;
        //                     padding: 20px;
        //                 }
        //                 .container {
        //                     max-width: 600px;
        //                     margin: 0 auto;
        //                     background-color: #fff;
        //                     padding: 20px;
        //                     border-radius: 8px;
        //                     box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        //                 }
        //                 .header {
        //                     background-color: #007bff;
        //                     color: #fff;
        //                     padding: 10px;
        //                     text-align: center;
        //                     border-top-left-radius: 8px;
        //                     border-top-right-radius: 8px;
        //                 }
        //                 .content {
        //                     padding: 20px;
        //                 }
        //                 .content p {
        //                     margin-bottom: 10px;
        //                 }
        //                 .footer {
        //                     text-align: center;
        //                     margin-top: 20px;
        //                     color: #666;
        //                 }
        //             </style>
        //         </head>
        //         <body>
        //             <div class="container">
        //                 <div class="header">
        //                     <h1>Welcome to Blueace!</h1>
        //                 </div>
        //                 <div class="content">
        //                     <p>Dear ${ownerName},</p>
        //                     <p>Thank you for registering with Blueace. We are delighted to have you as a part of our community.</p>
        //                     <p>If you have any questions or need assistance, please feel free to contact us.</p>
        //                 </div>
        //                 <div class="footer">
        //                     <p>Best regards,</p>
        //                     <p>Blueace Team</p>
        //                 </div>
        //             </div>
        //         </body>
        //         </html>
        //     `
        // };

        // await sendEmail(emailOptions);

        const message = `Dear ${ownerName}, Thank you for registering with Blueace. We are delighted to have you as a part of our community. If you have any questions or need assistance, please feel free to contact us.`
        // await sendSMS(ContactNumber, message)

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
        // console.log("i am hit")
        const { readyToWork } = req.body;
        const existingVendor = await Vendor.findById(id)
        // console.log("existingVendor",existingVendor)

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

        if (foundMembershipPlan.price === 0 || foundMembershipPlan.name.toLowerCase() === 'free') {
            vendor.PaymentStatus = 'paid';
            await vendor.save();
            console.log("I am Done with free");
            return res.json({
                success: true,
                url: 'https://www.blueaceindia.com/successfull-payment'
            });
        }

        const planPrice = foundMembershipPlan.price;
        // console.log("Plan", planPrice)
        if (!planPrice && planPrice !== 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price.',
            });
        }

        if (planPrice) {

            const transactionId = crypto.randomBytes(9).toString('hex');
            const merchantUserId = crypto.randomBytes(12).toString('hex');

            const data = {
                merchantId: merchantId,
                merchantTransactionId: transactionId,
                merchantUserId,
                name: "User",
                amount: planPrice * 100,
                callbackUrl: `https://www.blueaceindia.com/failed-payment`,
                redirectUrl: `https://www.api.blueaceindia.com/api/v1/payment-verify/${transactionId}`,
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

            vendor.memberShipPrice = planPrice;
            vendor.razorpayOrderId = response?.data?.data?.merchantTransactionId; // Store Razorpay orderId for later tracking
            await vendor.save();
            res.status(201).json({
                success: true,
                url: response.data.data.instrumentResponse.redirectInfo.url
            })

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

    const { merchantTransactionId } = req.params;

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

        // console.log("data out", data)

        const findOrder = await Vendor.findOne({ razorpayOrderId: merchantTransactionId });
        if (!findOrder) {
            return res.status(400).json({
                success: false,
                message: 'Order not found.',
            });
        }

        if (data.success === true) {

            findOrder.transactionId = data?.data?.merchantTransactionId;
            findOrder.PaymentStatus = 'paid';
            findOrder.isMember = true;

            await findOrder.save();

            let redirectEndPoint;
            if (findOrder?.createdFrom === 'Admin') {
                redirectEndPoint = 'https://admin.blueace.co.in'
            } else {
                redirectEndPoint = 'https://www.blueaceindia.com'
            }
            const successRedirect = `${redirectEndPoint}/successfull-payment`;
            return res.redirect(successRedirect);

        } else {
            let redirectEndPoint;
            if (findOrder?.createdFrom === 'Admin') {
                redirectEndPoint = 'https://admin.blueace.co.in'
            } else {
                redirectEndPoint = 'https://www.blueaceindia.com'
            }
            const failureRedirect = `${redirectEndPoint}/failed-payment`;
            return res.redirect(failureRedirect);
        }

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

exports.updateVendorApp = async (req, res) => {
    try {
        const vendorId = req.params._id;
        // console.log('Vendor ID:', vendorId);

        // Destructure the fields from the request body
        const {
            companyName,
            yearOfRegistration,
            address,
            HouseNo,
            PinCode,
            Email,
            FullName,
            ContactNumber,
            panNo,
            gstNo,
            adharNo,
        } = req.body;

        // console.log('Request Body:', req.body);

        // Fetch the existing vendor by ID
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found',
            });
        }

        // Check if the Email is being updated and if it already exists
        if (Email && Email !== vendor.Email) {
            const existingVendorEmail = await Vendor.findOne({ Email });
            if (existingVendorEmail) {
                return res.status(403).json({
                    success: false,
                    message: 'Email already exists as a Vendor',
                });
            }
        }

        // Check if the ContactNumber is being updated and if it already exists
        if (ContactNumber && ContactNumber !== vendor.ContactNumber) {
            const existingVendorNumber = await Vendor.findOne({ ContactNumber });
            if (existingVendorNumber) {
                return res.status(403).json({
                    success: false,
                    message: 'Contact number already exists as a Vendor',
                });
            }
        }

        // Update only the fields that are provided in the request body
        const fieldsToUpdate = {};
        if (companyName && companyName !== vendor.companyName) {
            fieldsToUpdate.companyName = companyName;
        }
        if (yearOfRegistration && yearOfRegistration !== vendor.yearOfRegistration) {
            fieldsToUpdate.yearOfRegistration = yearOfRegistration;
        }
        if (address && address !== vendor.address) {
            fieldsToUpdate.address = address;
        }
        if (HouseNo && HouseNo !== vendor.HouseNo) {
            fieldsToUpdate.HouseNo = HouseNo;
        }
        if (PinCode && PinCode !== vendor.PinCode) {
            fieldsToUpdate.PinCode = PinCode;
        }
        if (Email && Email !== vendor.Email) {
            fieldsToUpdate.Email = Email;
        }
        if (FullName && FullName !== vendor.ownerName) {
            fieldsToUpdate.ownerName = FullName;
        }
        if (ContactNumber && ContactNumber !== vendor.ContactNumber) {
            fieldsToUpdate.ContactNumber = ContactNumber;
        }
        if (panNo && panNo !== vendor.panNo) {
            fieldsToUpdate.panNo = panNo;
        }
        if (gstNo && gstNo !== vendor.gstNo) {
            fieldsToUpdate.gstNo = gstNo;
        }
        if (adharNo && adharNo !== vendor.adharNo) {
            fieldsToUpdate.adharNo = adharNo;
        }

        // Update the vendor with the fields that have changed
        if (Object.keys(fieldsToUpdate).length > 0) {
            Object.assign(vendor, fieldsToUpdate);
        }

        // Save the updated vendor document
        const updatedVendor = await vendor.save();

        res.status(200).json({
            success: true,
            message: 'Vendor updated successfully',
            data: updatedVendor,
        });
    } catch (error) {
        console.error('Error updating vendor:', error);

        // Handle specific errors
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `${duplicateField} already exists`,
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. '),
            });
        }

        // Handle generic errors
        res.status(500).json({
            success: false,
            message: 'Internal server error in updating vendor',
            error: error.message,
        });
    }
};


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

        // console.log('vendorid', vendorId)

        const user = await Vendor.findById(vendorId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isMatch = await user.comparePassword(Password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Enter Correct Old Password'
            });
        }

        user.Password = NewPassword;

        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
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

        const vendorNumber = existingVendor ? existingVendor.Password : '';

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

        // await sendEmail(emailOptions);

        const message = `Your OTP for password reset is: ${OTP}. Please use this OTP within 10 minutes to reset your password.`;
        // await sendSMS(vendorNumber, message)

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

        // console.log("vendor", vendor)
        // console.log("Email", Email)

        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP or OTP has expired',
            })
        }

        const vendorNumber = vendor ? vendor.ContactNumber : '';

        vendor.Password = NewPassword;
        vendor.PasswordChangeOtp = undefined;
        vendor.OtpExpiredTime = undefined;
        vendor.NewPassword = undefined;

        await vendor.save();

        // const successEmailOptions = {
        //     email: Email,
        //     subject: 'Password Changed Successfully',
        //     message: `
        //         <html>
        //         <head>

        //         </head>
        //         <body>
        //             <p>Your password has been successfully changed.</p>
        //             <p>If you did not perform this action, please contact us immediately.</p>
        //         </body>
        //         </html>
        //     `
        // }

        // await sendEmail(successEmailOptions)

        const message = `Your password has been successfully changed. If you did not perform this action, please contact us immediately.`

        // await sendSMS(vendorNumber, message)

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

        const vendorNumber = vendor ? vendor.ContactNumber : '';

        // Check if the OTP has been sent recently
        const currentTime = Date.now();
        const otpLastSentTime = vendor.OtpExpiredTime ? vendor.OtpExpiredTime.getTime() : 0;

        // If OTP was sent less than 3 minutes ago, return an error
        if (otpLastSentTime && (currentTime - otpLastSentTime) < 3 * 60 * 1000) {
            const remainingTime = Math.ceil((3 * 60 * 1000 - (currentTime - otpLastSentTime)) / 1000); // In seconds
            return res.status(400).json({
                success: false,
                message: `Please wait ${remainingTime} seconds before requesting a new OTP.`
            });
        }

        const OTP = Math.floor(100000 + Math.random() * 900000)
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10);

        vendor.PasswordChangeOtp = OTP;
        vendor.OtpExpiredTime = OTPExpires;
        await vendor.save();

        // const emailOptions = {
        //     email: Email,
        //     subject: 'Password Reset OTP',
        //     message: `
        //         <html>
        //         <head>

        //         </head>
        //         <body>
        //             <p>Your new OTP for password reset is: <strong>${OTP}</strong></p>
        //             <p>Please use this OTP within 10 minutes to reset your password.</p>
        //         </body>
        //         </html>
        //     `
        // }

        // await sendEmail(emailOptions);

        const message = `Your new OTP for password reset is: ${OTP}. Please use this OTP within 10 minutes to reset your password.`;

        // await sendSMS(userNumber, message);

        res.status(200).json({
            success: true,
            message: 'New OTP sent successfully. Check your SMS Box.'
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

        if (RangeWhereYouWantService && Array.isArray(RangeWhereYouWantService)) {
            const isValidRange = RangeWhereYouWantService.every(service => {
                const location = service?.location;
                const type = location?.type;
                const coordinates = location?.coordinates;

                return type === "Point" &&
                    Array.isArray(coordinates) &&
                    coordinates.length === 2 &&
                    coordinates.every(coord => coord !== "" && coord !== null && coord !== undefined);
            });

            if (isValidRange && JSON.stringify(RangeWhereYouWantService) !== JSON.stringify(vendor.RangeWhereYouWantService)) {
                vendor.RangeWhereYouWantService = RangeWhereYouWantService;
            }
        }

        if (req.files) {
            const { panImage, adharImage, gstImage, vendorImage } = req.files;

            const processImage = async (image, fieldName) => {
                if (image && image[0]) {
                    if (vendor[fieldName]?.public_id) {
                        try {
                            await deleteImageFromCloudinary(vendor[fieldName].public_id);
                        } catch (err) {
                            console.warn(`Failed to delete existing ${fieldName} from Cloudinary:`, err.message);
                        }
                    }
                    try {
                        const imgUrl = await uploadImage(image[0].path);
                        vendor[fieldName] = {
                            url: imgUrl.image,
                            public_id: imgUrl.public_id
                        };
                        uploadedImages.push(imgUrl.public_id);

                        if (await fs.access(image[0].path).then(() => true).catch(() => false)) {
                            await fs.unlink(image[0].path);
                        }
                    } catch (err) {
                        console.error(`Failed to upload ${fieldName}:`, err.message);
                    }
                }
            };

            await Promise.all([
                processImage(panImage, 'panImage'),
                processImage(adharImage, 'adharImage'),
                processImage(gstImage, 'gstImage'),
                processImage(vendorImage, 'vendorImage')
            ]);
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
        // console.log("i am hit")
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

        const vendorNumber = vendor ? vendor.ContactNumber : '';

        const OTP = Math.floor(100000 + Math.random() * 900000);
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10);

        vendor.VerifyOTP = OTP,
            vendor.OtpExpiredTime = OTPExpires
        await vendor.save()

        // const emailOptions = {
        //     email: Email,
        //     subject: 'Account Verification OTP',
        //     message: `
        //         <html>
        //         <head>
        //         </head>
        //         <body>
        //             <p>Hello,</p>
        //             <p>Your OTP for verifying your account is: <strong>${OTP}</strong></p>
        //             <p>Please enter this OTP within 10 minutes to complete your account verification.</p>
        //             <p>If you did not request this, please disregard this email.</p>
        //             <br>
        //             <p>Best Regards,</p>
        //             <p>Team Blueace India</p>
        //         </body>
        //         </html>
        //     `
        // };


        // await sendEmail(emailOptions)

        const message = `Your OTP for verifying your account is: ${OTP}. Please enter this OTP within 10 minutes to complete your account verification. If you did not request this, please disregard this SMS.`

        // await sendSMS(vendorNumber, message)

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

        const vendorNumber = vendor ? vendor.ContactNumber : '';
        const vendorName = vendor ? vendor.ownerName : '';

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

        const message = `Dear ${vendorName},

Congratulations! Your verification process has been successfully completed. You are now verified to use our services and platform.

If you have any questions or need further assistance, feel free to contact our support team.

Thank you for being a part of our network.

Best regards,  
Team Blueace India`;

        // await sendSMS(vendorNumber, message)

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

        const vendorNumber = vendor ? vendor.ContactNumber : '';
        const vendorName = vendor ? vendor.ownerName : '';

        // Check if the OTP has been sent recently
        const currentTime = Date.now();
        const otpLastSentTime = vendor.OtpExpiredTime ? vendor.OtpExpiredTime.getTime() : 0;

        // If OTP was sent less than 3 minutes ago, return an error
        if (otpLastSentTime && (currentTime - otpLastSentTime) < 3 * 60 * 1000) {
            const remainingTime = Math.ceil((3 * 60 * 1000 - (currentTime - otpLastSentTime)) / 1000); // In seconds
            return res.status(400).json({
                success: false,
                message: `Please wait ${remainingTime} seconds before requesting a new OTP.`
            });
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10);

        vendor.VerifyOTP = OTP,
            vendor.OtpExpiredTime = OTPExpires
        await vendor.save()

        // const emailOptions = {
        //     email: Email,
        //     subject: 'Resend: Verify Your Account with OTP',
        //     message: `
        //         <html>
        //         <head>
        //         </head>
        //         <body>
        //             <p>Dear User,</p>
        //             <p>We noticed that you requested to resend the OTP for verifying your account. Your new OTP is: <strong>${OTP}</strong></p>
        //             <p>Please use this OTP within the next 10 minutes to complete your account verification process.</p>
        //             <p>If you did not request this, please ignore this email.</p>
        //             <br>
        //             <p>Thank you,</p>
        //             <p>Team Blueace India</p>
        //         </body>
        //         </html>
        //     `
        // };

        const message = `Dear ${vendorName},
        We noticed that you requested to resend the OTP for verifying your account. Your new OTP is: ${OTP},

        Please use this OTP within the next 10 minutes to complete your account verification process.

        If you did not request this, please ignore this email.

        Best regards,  
        Team Blueace India`


        // await sendEmail(emailOptions)
        // await sendSMS(vendorNumber,message)

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

exports.updateBankDetail = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const {
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode,
            branchName,
            // panCardNumber
        } = req.body;

        // Validate input
        if (!accountHolderName || !bankName || !accountNumber || !ifscCode || !branchName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Find the provider
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'vendor not found',
            });
        }

        // Check if bank details already exist
        if (vendor.bankDetail && Object.keys(vendor.bankDetail).length > 0) {
            // Update only the provided fields
            vendor.bankDetail.accountHolderName = accountHolderName;
            vendor.bankDetail.bankName = bankName;
            vendor.bankDetail.accountNumber = accountNumber;
            vendor.bankDetail.ifscCode = ifscCode;
            vendor.bankDetail.branchName = branchName;
            // vendor.bankDetail.panCardNumber = panCardNumber;
        } else {
            // Create new bank details
            vendor.bankDetail = {
                accountHolderName,
                bankName,
                accountNumber,
                ifscCode,
                branchName,
                // panCardNumber,
            };
        }

        // Save the updated vendor
        await vendor.save();

        res.status(200).json({
            success: true,
            message: 'Bank details updated successfully',
            bankDetail: vendor.bankDetail,
        });
    } catch (error) {
        console.error("Internal server error", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};