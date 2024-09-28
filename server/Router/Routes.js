const express = require('express')
const { protect } = require('../Middleware/Protect')
const { register, login, logout, passwordChangeRequest, verifyOtpAndChangePassword, resendOtp, addDeliveryDetails, userDetails, GetDeliveryAddressOfUser, updateDeliveryAddress, getAllUsers } = require('../Controller/Usercontroller')
const router = express.Router()
const upload = require('../Middleware/Multer')
const { createServiceCategory, updateServiceCategory, getServiceCategory, getSingleServiceCategroy, deleteServiceCategory } = require('../Controller/serviceCategory.Controller')
const { createService, getService, getSingleService, updateService, deleteService } = require('../Controller/service.Controller')
const { createMarqueeText, getMarqueeText, getSingleMarquee, updateMarqueeText, deleteMarqueeText } = require('../Controller/marqueeText.Controller')
const { createPromotionalBanner, getPromotionalBanner, getSinglePromotionalBanner, updatePromotionalBanner, deletePromotionalBanner } = require('../Controller/promotionalBanner.Controller')
const { createFAQBanner, getFAQBanner, getSingleFAQBanner, updateFAQBanner, deleteFAQBanner } = require('../Controller/faqBanner.Controller')
const { createFaqContent, getFaqContent, getSingleFaqContent, deleteFaqContent, updateFaqContent } = require('../Controller/faqContent.Controller')

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

// Router for service category
router.post('/create-service-category', upload.fields([
    { name: 'sliderImage', maxCount: 10 },  // Allow multiple images for sliderImage
    { name: 'icon', maxCount: 1 }           // Only one image for icon
]), createServiceCategory);
router.put('/update-service-category/:_id', upload.fields([{ name: 'sliderImage', maxCount: 10 }, { name: 'icon' }]), updateServiceCategory);
router.get('/get-all-service-category',getServiceCategory)
router.get('/get-single-service-category/:_id',getSingleServiceCategroy)
router.delete('/delete-service-category/:_id',deleteServiceCategory)

// Router for services

router.post('/create-service',upload.fields([{name:'serviceImage', maxCount:1}, {name:'serviceBanner', maxCount:1}]),createService)
router.get('/get-all-service',getService)
router.get('/get-single-service/:_id',getSingleService)
router.put('/update-service/:_id',upload.fields([{name:'serviceImage',maxCount:1},{name:'serviceBanner',maxCount:1}]),updateService)
router.delete('/delete-service/:_id',deleteService)

// Router for marquee text 

router.post('/create-marquee',createMarqueeText)
router.get('/get-all-marquee',getMarqueeText)
router.get('/get-single-marquee/:_id',getSingleMarquee)
router.put('/update-marquee/:_id',updateMarqueeText)
router.delete('/delete-marquee/:_id',deleteMarqueeText)

// Router for Promotional banner 

router.post('/create-promotional-banner',upload.single('bannerImage'),createPromotionalBanner)
router.get('/get-promotional-banner',getPromotionalBanner)
router.get('/get-single-promotional-banner/:_id',getSinglePromotionalBanner)
router.put('/update-promotional-banner/:_id',upload.single('bannerImage'),updatePromotionalBanner)
router.delete('/delete-promotional-banner/:_id',deletePromotionalBanner)

// Router for FAQ banner 

router.post('/create-faq-banner',upload.single('bannerImage'),createFAQBanner)
router.get('/get-faq-banner',getFAQBanner)
router.get('/get-single-faq-banner/:_id',getSingleFAQBanner)
router.put('/update-faq-banner/:_id',upload.single('bannerImage'),updateFAQBanner)
router.delete('/delete-faq-banner/:_id',deleteFAQBanner)

// Route fro faq content 

router.post('/create-faq-content',createFaqContent)
router.get('/get-all-faq-content',getFaqContent)
router.get('/get-single-faq-content/:_id',getSingleFaqContent)
router.delete('/delete-faq-content/:_id',deleteFaqContent)
router.put('/update-faq-content/:_id',updateFaqContent)

module.exports = router;