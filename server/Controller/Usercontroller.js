const User = require('../Model/UserModel');
const SendToken = require('../Utils/SendToken');
const SendEmail = require('../Utils/SendEmail');
const Orders = require('../Model/OrderModel');
exports.register = async (req, res) => {
    try {
        console.log("I am hit")
        const { FullName, Email, ContactNumber, Password } = req.body;

        // Check if all required fields are provided
        if (!FullName || !Email || !ContactNumber || !Password) {
            console.log("i am error")
            return res.status(403).json({
                success: false,
                msg: 'Please Fill All Required Fields'
            });
        }

        // Check if email or contact number already exists
        const existingUserEmail = await User.findOne({ Email });
        if (existingUserEmail) {
            return res.status(403).json({
                success: false,
                msg: 'User Already Exists With This Email'
            });
        }

        const existingUserContact = await User.findOne({ ContactNumber });
        if (existingUserContact) {
            return res.status(403).json({
                success: false,
                msg: 'User Already Exists With This Contact Number'
            });
        }

        // Check password length
        if (Password.length <= 6) {
            return res.status(403).json({
                success: false,
                msg: 'Password Length Must be Greater than 6 Digits'
            });
        }

        // Define initial user data
        const userData = {
            FullName,
            Password,
            Email,
            ContactNumber,
        };

        // Create new user instance
        const newUser = new User(userData);

        // Save user to database
        await newUser.save();

        // Prepare email options
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
                            <p>Dear ${FullName},</p>
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


        // Send welcome email
        await SendEmail(emailOptions);

        // Send token to the user
        await SendToken(newUser, res, 201);


    } catch (error) {
        console.error('Error creating user:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `${duplicateField} already exists`
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        // Validate password
        const isMatch = await user.comparePassword(Password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        await SendToken(user, res, 201)
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
};

exports.logout = async (req, res) => {
    try {
        // Clearing cookies directly
        res.clearCookie('token'); // Replace 'token' with your cookie name
        res.status(200).json({
            success: true,
            msg: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
};

exports.userDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Please login to access this resource.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Fetch all orders for the user
        const allOrders = await Orders.find({ userId: user._id });

        // Exclude sensitive information from user details
        const { Password, ...userDetails } = user.toObject();

        res.status(200).json({
            message: 'User details and orders retrieved successfully.',
            user: userDetails,
            orders: allOrders
        });

    } catch (error) {
        console.error('Error fetching user details and orders:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
exports.passwordChangeRequest = async (req, res) => {
    try {
        const { Email, NewPassword } = req.body;

        // Check password length
        if (NewPassword.length <= 6) {
            return res.status(403).json({
                success: false,
                msg: 'Password Length Must be Greater than 6 Digits'
            });
        }

        // Find user by email
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        // Generate OTP and expiry time
        const OTP = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10); // Set expiry time to 10 minutes from now

        // Update user document with OTP and expiry
        await User.findOneAndUpdate(
            { Email },
            {
                $set: {
                    PasswordChangeOtp: OTP,
                    OtpExpiredTime: OTPExpires,
                    NewPassword: NewPassword
                }
            },
            { new: true }
        );

        // Prepare email options
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

        // Send OTP via email
        await SendEmail(emailOptions);

        res.status(200).json({
            success: true,
            msg: 'OTP sent successfully. Check your email.'
        });
    } catch (error) {
        console.error('Password change request error:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
};


exports.verifyOtpAndChangePassword = async (req, res) => {
    const { Email, OTP, NewPassword } = req.body;

    try {
        // Check if OTP is valid and not expired
        const user = await User.findOne({
            Email,
            PasswordChangeOtp: OTP,
            OtpExpiredTime: { $gt: Date.now() } // Check if OTP is not expired
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid OTP or OTP expired'
            });
        }
        console.log(user)
        // Update password
        user.Password = NewPassword; // Assign NewPassword from user object to Password field
        user.PasswordChangeOtp = undefined;
        user.OtpExpiredTime = undefined;
        user.NewPassword = undefined; // Clear NewPassword field after using it
        await user.save();

        // Send password change success email
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
        };

        // Send email notification
        await SendEmail(successEmailOptions);

        res.status(200).json({
            success: true,
            msg: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Verify OTP and change password error:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
};
exports.resendOtp = async (req, res) => {
    const { Email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ Email });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        // // Check if OTP is expired or not
        // if (user.OtpExpiredTime > Date.now()) {
        //     return res.status(400).json({
        //         success: false,
        //         msg: 'OTP is not yet expired. Please wait before requesting a new one.'
        //     });
        // }

        // Generate new OTP and update expiry time
        const OTP = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const OTPExpires = new Date();
        OTPExpires.setMinutes(OTPExpires.getMinutes() + 10); // Set expiry time to 10 minutes from now

        // Update user document with new OTP and expiry
        user.PasswordChangeOtp = OTP;
        user.OtpExpiredTime = OTPExpires;
        await user.save();

        // Prepare email options
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
        };

        // Send OTP via email
        await SendEmail(emailOptions);

        res.status(200).json({
            success: true,
            msg: 'New OTP sent successfully. Check your email.'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
};

exports.addDeliveryDetails = async (req, res) => {
    try {
        const user = req.user;
        const userExist = await User.findById(user.id._id);

        if (!userExist) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }

        // Extract DeliveryAddress from req.body
        const { city, pincode, houseNo, street, nearByLandMark } = req.body;

        if (!city || !pincode || !houseNo || !street || !nearByLandMark) {
            return res.status(400).json({
                success: false,
                msg: 'All fields are required'
            });
        }

        // Update user's DeliveryAddress
        userExist.DeliveryAddress = {
            City: city,
            PinCode: pincode,
            HouseNo: houseNo,
            Street: street,
            NearByLandMark: nearByLandMark,
        };

        // Save updated user
        await userExist.save();

        res.status(200).json({
            success: true,
            msg: 'Delivery details added/updated successfully',
            user: userExist
        });
    } catch (error) {
        console.error('Error adding delivery details:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
};


exports.GetDeliveryAddressOfUser = async (req, res) => {
    try {
        const user = req.user;
        const userExist = await User.findById(user.id._id);

        if (userExist) {
            const deliveryAddress = userExist.DeliveryAddress;
            return res.status(200).json({
                success: true,
                deliveryAddress: deliveryAddress
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Error fetching delivery address:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch delivery address'
        });
    }
};


exports.updateDeliveryAddress = async (req, res) => {
    try {
        const userId = req.user.id._id; // Assuming req.user contains the authenticated user's ID

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }
        console.log(req.body)
        // Extract DeliveryAddress fields from req.body that are actually updated
        const { city, pincode, houseNo, street, nearByLandMark } = req.body;

        // Update user's DeliveryAddress fields only if they are provided in req.body
        if (city) user.DeliveryAddress.City = city;
        if (pincode) user.DeliveryAddress.PinCode = pincode;
        if (houseNo) user.DeliveryAddress.HouseNo = houseNo;
        if (street) user.DeliveryAddress.Street = street;
        if (nearByLandMark) user.DeliveryAddress.NearByLandMark = nearByLandMark;

        // Save updated user
        await user.save();

        res.status(200).json({
            success: true,
            msg: 'Delivery address updated successfully',
            user: user // Optionally, you can return the updated user object
        });
    } catch (error) {
        console.error('Error updating delivery address:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const allUser = await User.find()
        if (!allUser) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            })
        }
        res.status(200).json({
            success: true,
            msg: 'All Users',
            data: allUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        })
    }
}

exports.updateUserType = async (req, res) => {
    try {
        const id = req.params._id;
        const { UserType } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            })
        }
        user.UserType = UserType;
        await user.save();
        res.status(200).json({
            success: true,
            msg: 'User Type Updated',
            data: user
        })
    } catch (error) {
        console.log('Internal server error in updating user type', error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in updating user type',
            error: error.message
        })
    }
}