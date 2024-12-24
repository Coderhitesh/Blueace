import React from 'react'
import Header from '../../components/Header/Header'
import HederSlide from '../../components/Header/HederSlide'
import { Route, Routes } from 'react-router-dom'
import './home.css'
import { Toaster } from 'react-hot-toast'
import AllServiceCategory from '../ServiceCategory/AllServiceCategory'
import AddServiceCategory from '../ServiceCategory/AddServiceCategory'
import EditServiceCategory from '../ServiceCategory/EditServiceCategory'
import AllMainServiceCategory from '../MainServiceCategory/AllMainServiceCategory'
import AddMainServiceCategory from '../MainServiceCategory/AddMainServiceCategory'
import EditMainServiceCategory from '../MainServiceCategory/EditMainServiceCategory'
import AddServices from '../Services/AddServices'
import AllServices from '../Services/AllServices'
import EditServices from '../Services/EditServices'
import AllHomeBanner from '../HomeBanner/AllHomeBanner'
import AddHomeBanner from '../HomeBanner/AddHomeBanner'
import EditHomeBanner from '../HomeBanner/EditHomeBanner'
import AllPromotionalBanner from '../PromotionalBanner/AllPromotionalBanner'
import AddPromotionalBanner from '../PromotionalBanner/AddPromotionalBanner'
import EditPromotionalBanner from '../PromotionalBanner/EditPromotionalBanner'
import AllFAQBanner from '../FAQBanner/AllFAQBanner'
import AddFAQBanner from '../FAQBanner/AddFAQBanner'
import EditFAQBanner from '../FAQBanner/EditFAQBanner'
import AllFAQContent from '../FAQContent/AllFAQContent'
import AddFAQContent from '../FAQContent/AddFAQContent'
import EditFAQContent from '../FAQContent/EditFAQContent'
import AllMarquee from '../Marquee/AllMarquee'
import AddMarquee from '../Marquee/AddMarquee'
import EditMarquee from '../Marquee/EditMarquee'
import AllUserDetail from '../UserDetail/AllUserDetail'
import AllVendors from '../VendorDetails/AllVendors'
import AllMemberShipPlan from '../MemberShipPlan/AllMemberShipPlan'
import AddMemberShipPlan from '../MemberShipPlan/AddMemberShipPlan'
import EditMemberShipPlan from '../MemberShipPlan/EditMemberShipPlan'
import Order from '../Orders/Order'
import VendorForOrder from '../Orders/VendorForOrder'
import AllBlog from '../Blog/AllBlog'
import AddBlog from '../Blog/AddBlog'
import EditBlog from '../Blog/EditBlog'
import SeeEstimatedBudget from '../Orders/SeeEstimatedBudget'
import AllGalleryName from '../GalleryName/AllGalleryName'
import AddGalleryName from '../GalleryName/AddGalleryName'
import EditGalleryName from '../GalleryName/EditGalleryName'
import AllGalleryImage from '../GalleryImage/AllGalleryImage'
import AddGalleryImage from '../GalleryImage/AddGalleryImage'
import EditGalleryImage from '../GalleryImage/EditGalleryImage'
import AddVendor from '../VendorDetails/AddVendor'
import AddMembersForm from '../VendorDetails/AddMembersForm '
import MemberShipPlan from '../VendorDetails/MemberShipPlan'
import SuccessPayment from '../PaymentStatusPage/SuccessPayment'
import PaymentFailed from '../PaymentStatusPage/PaymentFailed'
import DashBoard from '../DashBoard/DashBoard'
import AllEnquiry from '../Enquiry/AllEnquiry'
import AllEmploy from '../Employ/AllEmploy'
import AddEmploy from '../Employ/AddEmploy'
import AllCorporateUser from '../CorporateUser/AllCorporateUser'
import AddCorporateUser from '../CorporateUser/AddCorporateUser'
import AddCorporateOrder from '../CorporateUser/AddCorporateOrder'
import AllTimeSlot from '../TimeSlot/AllTimeSlot'
import AddTimeSlot from '../TimeSlot/AddTimeSlot'
import EditTimeSlot from '../TimeSlot/EditTimeSlot'
import AllScript from '../Script/AllScript'
import AddScript from '../Script/AddScript'
import EditScript from '../Script/EditScript'
import AddUser from '../UserDetail/AddUser'
import AllWithdraw from '../Withdraw/AllWithdraw'

const Home = () => {
    return (
        <div class="page-wrapper compact-wrapper" id="pageWrapper">
            <div class="tap-top"><i class="iconly-Arrow-Up icli"></i></div>
            <Header />

            <div class="page-body-wrapper">


                <HederSlide />
                <div class="page-body">
                    <Routes>
                        {/* dashboard routes here  */}
                        <Route path="/" element={<DashBoard />} />
                        {/* service main category route here  */}
                        <Route path='/service/main-category' element={<AllMainServiceCategory />} />
                        <Route path='/service/Add-main-category' element={<AddMainServiceCategory />} />
                        <Route path='/service/edit-main-category/:id' element={<EditMainServiceCategory />} />

                        {/* service category route here  */}
                        <Route path='/service/category' element={<AllServiceCategory />} />
                        <Route path='/service/Add-category' element={<AddServiceCategory />} />
                        <Route path='/service/edit-category/:id' element={<EditServiceCategory />} />

                        {/* service category route here  */}
                        <Route path='/service/all-service' element={<AllServices />} />
                        <Route path='/service/add-service' element={<AddServices />} />
                        <Route path='/service/edit-service/:id' element={<EditServices />} />

                        {/* banner route here  */}
                        <Route path='/home-layout/all-banner' element={<AllHomeBanner />} />
                        <Route path='/home-layout/add-banner' element={<AddHomeBanner />} />
                        <Route path='/home-layout/edit-banner/:id' element={<EditHomeBanner />} />

                        {/* promotional banner route here  */}
                        <Route path='/home-layout/all-Offer-banner' element={<AllPromotionalBanner />} />
                        <Route path='/home-layout/add-Offer-banner' element={<AddPromotionalBanner />} />
                        <Route path='/home-layout/edit-Offer-banner/:id' element={<EditPromotionalBanner />} />

                        {/* faq banner route here  */}
                        <Route path='/home-layout/all-faq-banner' element={<AllFAQBanner />} />
                        <Route path='/home-layout/add-faq-banner' element={<AddFAQBanner />} />
                        <Route path='/home-layout/edit-faq-banner/:id' element={<EditFAQBanner />} />

                        {/* faq banner route here  */}
                        <Route path='/home-layout/all-faq-content' element={<AllFAQContent />} />
                        <Route path='/home-layout/add-faq-content' element={<AddFAQContent />} />
                        <Route path='/home-layout/edit-faq-content/:id' element={<EditFAQContent />} />

                        {/* marquee route here  */}
                        <Route path='/home-layout/all-marquee' element={<AllMarquee />} />
                        <Route path='/home-layout/add-marquee' element={<AddMarquee />} />
                        <Route path='/home-layout/edit-marquee/:id' element={<EditMarquee />} />

                        {/* marquee route here  */}
                        <Route path='/home-layout/all-blog' element={<AllBlog />} />
                        <Route path='/home-layout/add-blog' element={<AddBlog />} />
                        <Route path='/home-layout/edit-blog/:id' element={<EditBlog />} />

                        {/* user route here  */}
                        <Route path='/users/all-users' element={<AllUserDetail />} />
                        <Route path='/users/add-user' element={<AddUser />} />

                        {/* Vendor route here  */}
                        <Route path='/vendors/all-vendor' element={<AllVendors />} />
                        <Route path='/vendors/add-vendor' element={<AddVendor />} />
                        <Route path='/add-vendor-member/:id' element={<AddMembersForm />} />
                        <Route path='/membership-plan/:vendorId' element={<MemberShipPlan />} />

                        {/* Vendor membership plan route here  */}
                        <Route path='/vendors/all-membership-plan' element={<AllMemberShipPlan />} />
                        <Route path='/vendors/add-membership-plan' element={<AddMemberShipPlan />} />
                        <Route path='/vendors/edit-membership-plan/:id' element={<EditMemberShipPlan />} />
                        <Route path='/Alloted/:id' element={<VendorForOrder />} />
                        <Route path="/see-esitimated-bill" element={<SeeEstimatedBudget />} />

                        {/* time slot route here  */}

                        <Route path='/vendors/all-time-slot' element={<AllTimeSlot />} />
                        <Route path='/vendors/add-time-slot' element={<AddTimeSlot />} />
                        <Route path='/vendors/edit-time-slot/:id' element={<EditTimeSlot />} />

                        {/* employ route  */}
                        <Route path='/vendors/all-employ' element={<AllEmploy />} />
                        <Route path='/vendors/add-employ' element={<AddEmploy />} />

                        {/* corporate user route  */}
                        <Route path='/corporate-user/all-corporate-user' element={<AllCorporateUser />} />
                        <Route path='/corporate-user/add-corporate-user' element={<AddCorporateUser />} />

                        {/* corporate user order route  */}
                        <Route path='/corporate-order/add-corporate-order' element={<AddCorporateOrder />} />

                        {/* galley title route here  */}
                        <Route path="/home-layout/all-gallery-title" element={<AllGalleryName />} />
                        <Route path="/home-layout/Add-gallery-title" element={<AddGalleryName />} />
                        <Route path="/home-layout/Edit-gallery-title/:id" element={<EditGalleryName />} />

                        {/* galley title route here  */}
                        <Route path="/home-layout/all-gallery-image" element={<AllGalleryImage />} />
                        <Route path="/home-layout/Add-gallery-image" element={<AddGalleryImage />} />
                        <Route path="/home-layout/Edit-gallery-image/:id" element={<EditGalleryImage />} />



                        {/* Order route here  */}
                        <Route path='/Orders/all-order' element={<Order />} />

                        {/* payment status route here  */}

                        <Route path='/successfull-payment' element={<SuccessPayment />} />
                        <Route path='/failed-payment' element={<PaymentFailed />} />
                        {/* <Route path='/' element={<Login />} /> */}
                        <Route path='/all-enquiry' element={<AllEnquiry />} />

                        {/* sript route here  */}

                        <Route path='/all-script' element={<AllScript />} />
                        <Route path='/add-script' element={<AddScript />} />
                        <Route path='/edit-script/:id' element={<EditScript />} />

                        {/* withdraw route here  */}
                        <Route path='/withdraw/all-withdraw' element={<AllWithdraw />} />


                    </Routes>
                </div>
            </div>
            {/* <Toaster /> */}
        </div>
    )
}

export default Home