const express = require('express')
const { protect } = require('../Middleware/Protect')
const { register, login, logout, passwordChangeRequest, verifyOtpAndChangePassword, resendOtp, addDeliveryDetails, userDetails, GetDeliveryAddressOfUser, updateDeliveryAddress, getAllUsers } = require('../Controller/Usercontroller')
const router = express.Router()
const upload = require('../Middleware/Multer')

// user routers 

router.post('/Create-User', register)
router.post('/Login', login)
router.get('/Logout', protect, logout)
router.post('/Password-Change', passwordChangeRequest)
router.post('/Verify-Otp', verifyOtpAndChangePassword)
router.post('/resend-otp', resendOtp)


router.post('/Add-Delivery-Address', protect, addDeliveryDetails)
router.get('/user-details', protect, userDetails)
router.get('/get-Delivery-Address', protect, GetDeliveryAddressOfUser)
router.post('/update-Delivery-Address', protect, updateDeliveryAddress)
router.get('/AllUser', getAllUsers)

// service router here 

// Route to create a new service category
// router.post('/create-service-category', upload.fields([
//     { name: 'sliderImage', maxCount: 10 },  // Allow multiple images for sliderImage
//     { name: 'iconImage', maxCount: 1 }           // Only one image for icon
// ]), createServiceCategory);

module.exports = router;