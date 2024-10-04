import React from 'react'
import Header from '../../components/Header/Header'
import HederSlide from '../../components/Header/HederSlide'
import { Route, Routes } from 'react-router-dom'
// import CreateProduct from '../Product/CreateProduct'
import './home.css'
import { Toaster } from 'react-hot-toast'
import AllServiceCategory from '../ServiceCategory/AllServiceCategory'
import AddServiceCategory from '../ServiceCategory/AddServiceCategory'
import EditServiceCategory from '../ServiceCategory/EditServiceCategory'
import AllMainServiceCategory from '../MainServiceCategory/AllMainServiceCategory'
import AddMainServiceCategory from '../MainServiceCategory/AddMainServiceCategory'
import EditMainServiceCategory from '../MainServiceCategory/EditMainServiceCategory'
// import GetAllProduct from '../Product/GetAllProduct'
// import EditProduct from '../Product/EditProduct'
// import ManageCategory from '../Category/ManageCategory'
// import CreateCategoryModel from '../Category/CreateCategory'
// import EditCategory from '../Category/EditCategory'

// import CreateVouchers from '../Vouchers/CreateVouchers'
// import ManageVocuhers from '../Vouchers/ManageVocuhers'
// import EditVocher from '../Vouchers/EditVocher'
// import CreateService from '../Service/CreateService'
// import ManagaeService from '../Service/ManagaeService'
const Home = () => {
    return (
        <div class="page-wrapper compact-wrapper" id="pageWrapper">
            <div class="tap-top"><i class="iconly-Arrow-Up icli"></i></div>
            <Header />

            <div class="page-body-wrapper">


                <HederSlide />
                <div class="page-body">
                    <Routes>
                        {/* <Route path='/products/create' element={<CreateProduct />} />
                        <Route path='/products/manage' element={<GetAllProduct />} />
                        <Route path='/products/edit' element={<EditProduct />} />
                        <Route path='/category/manage' element={<ManageCategory />} />
                        <Route path='/category/create' element={<CreateCategoryModel />} />
                        <Route path='/category/edit' element={<EditCategory />} />
                        <Route path='/vouchers/create' element={<CreateVouchers />} />
                        <Route path='/vouchers/manage' element={<ManageVocuhers />} />
                        <Route path='/Voucher/edit' element={<EditVocher />} />
                        <Route path='/Service/create' element={<CreateService />} />
                        <Route path='/Service/manage' element={<ManagaeService />} /> */}

                        {/* service main category route here  */}
                        <Route path='/service/main-category' element={<AllMainServiceCategory />} />
                        <Route path='/service/Add-main-category' element={<AddMainServiceCategory />} />
                        <Route path='/service/edit-main-category/:id' element={<EditMainServiceCategory />} />

                        {/* service category route here  */}
                        <Route path='/service/category' element={<AllServiceCategory />} />
                        <Route path='/service/Add-category' element={<AddServiceCategory />} />
                        <Route path='/service/edit-category/:id' element={<EditServiceCategory />} />


                        
                    </Routes>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Home