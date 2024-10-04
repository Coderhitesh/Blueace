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
                        {/* <Route path='/service/add-service' element={<AddServices />} />
                        <Route path='/service/edit-service/:id' element={<EditServices />} /> */}


                        
                    </Routes>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Home