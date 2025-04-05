const User = require('../Model/UserModel');
const SendToken = require('../Utils/SendToken');
const SendEmail = require('../Utils/SendEmail');
const Vendor = require('../Model/vendor.Model');
const { deleteImageFromCloudinary, uploadImage } = require('../Utils/Cloudnary');
const fs = require("fs")
const mongoose = require('mongoose');
const { sendSMS } = require('../Utils/SMSSender');
const xlsx = require('xlsx');
const sendEmail = require('../Utils/SendEmail');
const { SendWhatsapp } = require('../Utils/SendWhatsapp');
// const Orders = require('../Model/OrderModel');
exports.register = async (req, res) => {
    try {
        // console.log("I am hit")
        const { companyName, address, FullName, Email, ContactNumber, Password, PinCode, HouseNo, NearByLandMark, RangeWhereYouWantService, UserType } = req.body;

        const emptyField = [];
        if (!FullName) emptyField.push('FullName');
        if (!Email) emptyField.push('Email');
        if (!ContactNumber) emptyField.push('ContactNumber');
        // if (!City) emptyField.push('City');
        // if (!PinCode) emptyField.push('PinCode');
        // if (!HouseNo) emptyField.push('HouseNo');
        // if (!Street) emptyField.push('Street');
        // if (!address) emptyField.push('address');
        // if (!NearByLandMark) emptyField.push('NearByLandMark');
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill all the required fields: ${emptyField.join(', ')}`
            })
        }

        // console.log('body',req.body)


        // Check if email or contact number already exists
        const existingUserEmail = await User.findOne({ Email });
        if (existingUserEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists as a User'
            });
        }

        const existingUserContact = await User.findOne({ ContactNumber });
        if (existingUserContact) {
            return res.status(403).json({
                success: false,
                message: 'Number already exists as a User'
            });
        }

        // Check for existing vendor email
        const existingVendorEmail = await Vendor.findOne({ Email });
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

        // Check password length
        if (Password.length <= 6) {
            return res.status(403).json({
                success: false,
                message: 'Password Length Must be Greater than 6 Digits'
            });
        }

        // Define initial user data
        const userData = {
            FullName,
            Password,
            Email,
            ContactNumber,
            // City,
            PinCode,
            UserType,
            HouseNo,
            // Street,
            address,
            NearByLandMark,
            RangeWhereYouWantService,
            companyName
        };

        // Create new user instance
        const newUser = new User(userData);

        // Save user to database
        await newUser.save();

        const Param = [
            FullName
        ]

        await SendWhatsapp(ContactNumber, 'registeruserandcorporate', Param)

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
            message: 'Internal Server Error in user registration'
        });
    }
};

exports.login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        // Find the user by Email or ContactNumber
        let user = await User.findOne({
            $or: [
                { Email: Email },
                { ContactNumber: Email }
            ]
        });
        if (user) {
            const isDeactive = user?.isDeactive;
            if (isDeactive === true) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account is deactivated'
                });
            }
            const isMatch = await user.comparePassword(Password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Enter Correct Password'
                });
            }

            await SendToken(user, res, 201)
        } else {
            const vendor = await Vendor.findOne({
                $or: [
                    { Email: Email },
                    { ContactNumber: Email }
                ]
            });
            const isDeactive = vendor.isDeactive;
            if (isDeactive) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account is deactivated'
                });
            }

            const isMatch = await vendor.comparePassword(Password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Enter Correct Password'
                });
            }

            await SendToken(vendor, res, 201)
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'No excisting account. Please Register',
            error: error.message
        });
    }
};

exports.updateUserDeactive = async (req, res) => {
    try {
        const id = req.params._id;
        const { isDeactive } = req.body;
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User is not found'
            })
        }
        user.isDeactive = isDeactive;
        await user.save();
        var valueDeactive
        if (isDeactive === true) {
            valueDeactive = 'Deactive'
        } else{
            valueDeactive = 'Active'
        }
        const Param = [valueDeactive]
        await SendWhatsapp(user?.ContactNumber, 'userblockedbyadmin', Param)
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
        })

    } catch (error) {
        console.log("Internal server error in updating deactive status", error)
        res.status(500).json({
            success: false,
            message: ' Internal Server Error',
        })
    }
}

exports.ChangeOldPassword = async (req, res) => {
    try {
        const userId = req.params._id;
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

        const user = await User.findById(userId);

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

exports.logout = async (req, res) => {
    try {
        // Clearing cookies directly
        res.clearCookie('token'); // Replace 'token' with your cookie name
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in user logout'
        });
    }
};

exports.passwordChangeRequest = async (req, res) => {
    try {
        const { Email, NewPassword } = req.body;
        console.log(req.body)


        if (NewPassword.length <= 6) {
            return res.status(400).json({
                success: false,
                message: 'Your new password must be longer than 6 characters. Please try again with a stronger password.'
            });
        }


        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'We couldn’t find an account with that email. Please check and try again.'
            });
        }

        const userEmail = user.Email;

        // Generate OTP and set expiration time
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const OTPExpires = new Date();
        OTPExpires.setTime(OTPExpires.getTime() + 2 * 60 * 1000);


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

        // Prepare email content
        const message = `Hi there,\n\nYour OTP for resetting your password is: ${OTP}.\n\nPlease use this OTP within the next 2 minutes to complete your password reset.\n\nIf you didn’t request this change, please ignore this email.\n\nThank you,\nSupport Team`;

        const options = {
            email: userEmail,
            subject: 'Your Password Reset OTP',
            message: message
        };

        // Send OTP via email
        try {
            await sendEmail(options);
            console.log('OTP sent successfully');
        } catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).json({
                success: false,
                message: 'There was an issue sending the OTP. Please try again later.'
            });
        }

        // Successful response
        res.status(200).json({
            success: true,
            message: 'An OTP has been sent to your registered email. Please check your inbox and follow the instructions to reset your password.'
        });

    } catch (error) {
        console.error('Password change request error:', error);
        res.status(500).json({
            success: false,
            message: 'Oops! Something went wrong on our end. Please try again later.'
        });
    }
};


exports.verifyOtpAndChangePassword = async (req, res) => {
    const { Email, PasswordChangeOtp, NewPassword } = req.body;

    try {
        // Check if OTP is valid and not expired
        const user = await User.findOne({
            Email,
            PasswordChangeOtp: PasswordChangeOtp,
            OtpExpiredTime: { $gt: Date.now() } // Check if OTP is not expired
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP or OTP has expired'
            });
        }
        const userEmail = user ? user.Email : '';
        // console.log(user)
        // Update password
        user.Password = NewPassword; // Assign NewPassword from user object to Password field
        user.PasswordChangeOtp = undefined;
        user.OtpExpiredTime = undefined;
        user.NewPassword = undefined; // Clear NewPassword field after using it
        await user.save();


        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Verify OTP and change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.resendOtp = async (req, res) => {
    const { Email } = req.body;

    try {
        const user = await User.findOne({ Email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if OTP was sent recently
        const currentTime = Date.now();
        const otpLastSentTime = user.OtpExpiredTime ? user.OtpExpiredTime.getTime() : 0;




        const OTP = Math.floor(100000 + Math.random() * 900000);
        const OTPExpires = new Date();
        OTPExpires.setTime(OTPExpires.getTime() + 2 * 60 * 1000);



        user.PasswordChangeOtp = OTP;
        user.OtpExpiredTime = OTPExpires;
        await user.save();


        const message = `
            Hi there,
            
            Your OTP for resetting your password is: ${OTP}.
            
            Please use this OTP within the next 2 minutes to complete your password reset.
            
            If you didn’t request this change, please ignore this email.
            
            Thank you,
            Support Team
        `;

        // Email options
        const options = {
            email: user.Email,
            subject: 'Your Password Reset OTP',
            message: message
        };

        try {
            await sendEmail(options);
            console.log('OTP sent successfully');
        } catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).json({
                success: false,
                message: 'There was an issue sending the OTP. Please try again later.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'New OTP sent successfully. Check your email inbox.'
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Delete user
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.log("Internal server error in deleting user")
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}


exports.addDeliveryDetails = async (req, res) => {
    try {
        const user = req.user;
        const userExist = await User.findById(user.id._id);

        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Extract DeliveryAddress from req.body
        const { city, pincode, houseNo, street, nearByLandMark } = req.body;

        if (!city || !pincode || !houseNo || !street || !nearByLandMark) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
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
            message: 'Delivery details added/updated successfully',
            user: userExist
        });
    } catch (error) {
        console.error('Error adding delivery details:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
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
                message: 'User not found'
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
            message: 'Delivery address updated successfully',
            user: user // Optionally, you can return the updated user object
        });
    } catch (error) {
        console.error('Error updating delivery address:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const allUser = await User.find()
        if (!allUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All Users',
            data: allUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

exports.getSingleUserById = async (req, res) => {
    try {
        const id = req.params._id;

        // Check if the ID is a valid ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        // Query the database for the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User found',
            data: user
        });
    } catch (error) {
        console.error("Internal server error", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in fetching single user by ID',
            message: error.message
        });
    }
};


exports.updateUser = async (req, res) => {
    const uploadedImages = [];
    try {
        const id = req.params._id;
        const { companyName, FullName, RangeWhereYouWantService, ContactNumber, Email, address, PinCode, HouseNo, NearByLandMark } = req.body;

        console.log("body", req.body)

        const existingUser = await User.findById(id)
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            })
        }

        existingUser.FullName = FullName;
        existingUser.ContactNumber = ContactNumber;
        existingUser.Email = Email;
        existingUser.address = address;
        existingUser.PinCode = PinCode;
        existingUser.HouseNo = HouseNo;
        // existingUser.Street = Street;
        existingUser.NearByLandMark = NearByLandMark;
        existingUser.companyName = companyName;
        // existingUser.RangeWhereYouWantService = RangeWhereYouWantService;
        if (RangeWhereYouWantService) {
            console.log("New RangeWhereYouWantService:", RangeWhereYouWantService);

            // Validate the new RangeWhereYouWantService
            const isValidRange = RangeWhereYouWantService.every((service, index) => {
                // console.log(`Checking service at index ${index}:`, service);

                const location = service?.location;
                // console.log(`Location:`, location);

                const type = location?.type;
                // console.log(`Type:`, type);

                const coordinates = location?.coordinates;
                // console.log(`Coordinates:`, coordinates);

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
                const isDifferent = JSON.stringify(RangeWhereYouWantService) !== JSON.stringify(existingUser.RangeWhereYouWantService);

                if (isDifferent) {
                    existingUser.RangeWhereYouWantService = RangeWhereYouWantService;
                    // console.log("RangeWhereYouWantService updated.");
                } else {
                    console.log("No change detected in RangeWhereYouWantService.");
                }
            } else {
                console.warn("Invalid RangeWhereYouWantService format provided. Skipping update.");
            }
        }

        if (req.file) {
            if (existingUser.userImage.public_id) {
                await deleteImageFromCloudinary(existingUser.userImage.public_id)
            }
            const imgUrl = await uploadImage(req.file.path)
            const { image, public_id } = imgUrl;
            existingUser.userImage.url = image;
            existingUser.userImage.public_id = public_id;
            uploadedImages.push = existingUser.userImage.public_id
            try {
                fs.unlink(req.file.path)
            } catch (error) {
                console.log('Error in deleting file from local', error)
            }
        }
        // console.log('mid', existingUser)

        const userupdated = await existingUser.save()
        // console.log('aftersve', userupdated)

        if (!userupdated) {
            await deleteImageFromCloudinary(existingUser.userImage.public_id)
            return res.status(400).json({
                success: false,
                message: 'Failed to update user',
            })
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: userupdated
        })

    } catch (error) {
        console.log('Internal server error', error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            message: error.message

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
                message: 'User not found'
            })
        }
        user.UserType = UserType;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'User Type Updated',
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


exports.universelLogin = async (req, res) => {
    try {
        const id = req.params._id;
        const user = await User.findById(id)
        if (!user) {
            const vendor = await Vendor.findById(id).populate('workingHour')
            return res.status(200).json({
                success: true,
                message: 'vendor is founded',
                data: vendor
            })
        }
        res.status(200).json({
            success: true,
            message: 'user is founded',
            data: user
        })
    } catch (error) {
        console.log('Internal server error in universel login', error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in universel login',
            error: error.message
        })
    }
}

exports.getMyDetails = async (req, res) => {
    try {
        const id = req.user.id?._id;
        const user = await User.findById(id)

        if (!user) {
            const vendor = await Vendor.findById(id).populate('workingHour memberShipPlan')
            return res.status(200).json({
                success: true,
                message: 'vendor is founded',
                data: vendor
            })
        }
        res.status(200).json({
            success: true,
            message: 'user is founded',
            data: user
        })
    } catch (error) {
        console.log('Internal server error in universel login', error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in universel login',
            error: error.message
        })
    }
}

exports.changeAMCStatus = async (req, res) => {
    try {
        const id = req.params._id;
        const { isAMCUser } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        user.isAMCUser = isAMCUser;
        const FullName = user?.FullName
        const updatedUser = await user.save();
        const Param = new URLSearchParams({
            FullName
        })
        await SendWhatsapp(user?.ContactNumber, 'userandcorpisAMC', Param)
        res.status(200).json({
            success: true,
            message: 'AMC Status Updated',
            data: updatedUser
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

exports.updateIsAMCUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAMCUser } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        user.isAMCUser = isAMCUser;
        const updatedUser = await user.save();
        res.status(200).json({
            success: true,
            message: 'AMC Status Updated',
            data: updatedUser
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

exports.registerCorporateuserByExcel = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // Read the uploaded Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const users = xlsx.utils.sheet_to_json(sheet);

        // Save users to MongoDB
        await User.insertMany(users);

        res.status(200).json({ message: "Users registered successfully!" });
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}