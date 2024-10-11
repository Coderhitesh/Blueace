const Vendor = require('../Model/vendor.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../Utils/Cloudnary');
const sendEmail = require('../Utils/SendEmail');
const sendToken = require('../Utils/SendToken');
const fs = require('fs').promises;

exports.registerVendor = async (req, res) => {
    const uploadedImages = []; 
    try {
        console.log('data', req.body);
        const {
            companyName,
            yearOfRegistration,
            registerAddress,
            registerEmail,
            ownerName,
            ownerNumber,
            panNo,
            gstNo,
            adharNo,
            member,
            Password,
            RangeWhereYouWantService
        } = req.body;

        const emptyField = [];
        if (!companyName) emptyField.push('Company Name');
        if (!yearOfRegistration) emptyField.push('Year Of Registration');
        if (!registerAddress) emptyField.push('Register Address');
        if (!registerEmail) emptyField.push('Register Email');
        if (!ownerName) emptyField.push('Owner Name');
        if (!ownerNumber) emptyField.push('Owner Number');
        if (!panNo) emptyField.push('Pan No');
        if (!gstNo) emptyField.push('Gst No');
        if (!adharNo) emptyField.push('Adhar No');
        if (!member || member.length === 0) emptyField.push('Member');
        if (!Password) emptyField.push('Password');
        if (!RangeWhereYouWantService) emptyField.push('Range Where You Want Service');
        
        if (emptyField.length > 0) {
            return res.status(400).json({ message: `Please fill all the fields ${emptyField.join(', ')}` });
        }

        // Check for existing vendor email
        const existingVendorEmail = await Vendor.findOne({ registerEmail });
        if (existingVendorEmail) {
            return res.status(403).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Check for existing vendor number
        const existingVendorNumber = await Vendor.findOne({ ownerNumber });
        if (existingVendorNumber) {
            return res.status(403).json({
                success: false,
                message: "Number already exists"
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
            registerEmail,
            ownerName,
            ownerNumber,
            panNo,
            gstNo,
            adharNo,
            member, // This will include member details and images
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

            // Upload Vendor Image
            if (vendorImage && vendorImage[0]) {
                const imgUrl = await uploadImage(vendorImage[0]?.path);
                newVendor.vendorImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                await fs.unlink(vendorImage[0].path);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Please upload Vendor Image"
                });
            }
        }

        // Handle member images and details
        if (member && Array.isArray(member)) {
            for (let i = 0; i < member.length; i++) {
                const memberAdharImage = req.files[`memberAdharImage_${i}`];
                if (memberAdharImage && memberAdharImage[0]) {
                    const imgUrl = await uploadImage(memberAdharImage[0]?.path);
                    member[i].memberAdharImage = {
                        url: imgUrl.image,
                        public_id: imgUrl.public_id
                    };
                    uploadedImages.push(imgUrl.public_id);
                    await fs.unlink(memberAdharImage[0].path);
                } else {
                    return res.status(400).json({
                        success: false,
                        message: `Please upload Aadhar Image for member ${i + 1}`
                    });
                }
            }
        }

        console.log('aftersubmit',newVendor)

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
            email: registerEmail,
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
            message: 'Internal server error in registration vendor',
            error: error.message
        });
    }
}


exports.vendorLogin = async (req,res) => {
    try {
        const {registerEmail,Password} = req.body;
        const availablevendor = await Vendor.findOne({registerEmail})

        if(!availablevendor){
            return res.staus(400).json({
                success: false,
                message: 'Vendor not found'
            })
        }

        const isMatch = await availablevendor.comparePassword(Password);
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            })
        }

        await sendToken(availablevendor,res,201)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in vendor login',
        })
    }
}

exports.vendorLogout = async (req,res) => {
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

exports.vendorPasswordChangeRequest = async (req,res) => {
    try {
        const {registerEmail,NewPassword} = req.body;
        if(NewPassword.length <= 6){
            return res.status(404).json({
                success: false,
                message: 'Password must be at least 7 characters long'
            })
        }

        const existingVendor = await Vendor.findOne({registerEmail});
        if(!existingVendor){
            return res.staus(404).json({
                success: false,
                message: 'Vendor not found'
            })
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10);

        await Vendor.findOneAndUpdate(
            {registerEmail},
            {
                $set: {
                    PasswordChangeOtp: OTP,
                    OtpExpiredTime: OTPExpires,
                    NewPassword: NewPassword
                }
            },
            {new: true}
        )

        const emailOptions = {
            email: registerEmail,
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

exports.VendorVerifyOtpAndChangePassword = async (req,res) => {
    try {
        const {registerEmail, PasswordChangeOtp, NewPassword} =req.body;
        const vendor = await Vendor.findOne({
            registerEmail,
            PasswordChangeOtp: PasswordChangeOtp,
            OtpExpiredTime: {$gt: Date.now()}
        });

        if(!vendor){
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
            email: registerEmail,
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

exports.vendorResendOTP = async (req,res) => {
    try {
        const {registerEmail} = req.body;
        const vendor = await Vendor.findOne({registerEmail});
        if(!vendor){
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
            email: registerEmail,
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
        console.log("Internal server error in resendOTP",error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        })
    }
}