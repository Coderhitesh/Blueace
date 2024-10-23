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
const Home = () => {
    return (
        <div class="page-wrapper compact-wrapper" id="pageWrapper">
            <div class="tap-top"><i class="iconly-Arrow-Up icli"></i></div>
            <Header />

            <div class="page-body-wrapper">


                <HederSlide />
                <div class="page-body">
                    <Routes>

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

                        {/* Vendor route here  */}
                        <Route path='/vendors/all-vendor' element={<AllVendors />} />

                        {/* Vendor membership plan route here  */}
                        <Route path='/vendors/all-membership-plan' element={<AllMemberShipPlan />} />
                        <Route path='/vendors/add-membership-plan' element={<AddMemberShipPlan />} />
                        <Route path='/vendors/edit-membership-plan/:id' element={<EditMemberShipPlan />} />
                        <Route path='/Alloted/:id' element={<VendorForOrder />} />

                        


                        {/* Order route here  */}
                        <Route path='/Orders/all-order' element={<Order />} />

                    </Routes>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Home