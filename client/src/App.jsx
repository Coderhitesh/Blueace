import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Pages/Home/Home"
import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer"
import NewsLetter from "./Components/NewsLetter/NewsLetter"
import ListingsPage from "./Pages/ListingsPage/ListingsPage"
import Dashboard from "./Pages/Dashboard/Dashboard"
import About from "./Pages/About/About"
import Contact from "./Pages/Contact/Contact"
import Privacy from "./Pages/Privacy/Privacy"
import Registration from "./Components/Auth/Registration"
import Login from "./Components/Auth/Login"
import DoctorSinglePage from "./Pages/DoctorSinglePage/DoctorSinglePage"
import JobSingle from "./Pages/JobSingle/JobSingle"
import Error from "./Pages/Error/Error"
// import RegisterServiceProvider from "./service-provider/RegisterServiceProvider"
import VendorRegistration from "./service-provider/VendorRegistration"
import MaintenanceofAHUandFCU from "./Pages/services/MaintenanceofAHUandFCU"
import Category from "./Pages/Category/Category"
import SubCategory from "./Pages/SubCateogry/SubCategory"
import Register from "./Components/Register/Register"
import Forget from "./Components/Auth/Forget"
import AddMembersForm from "./service-provider/AddMembersForm "
import MemberShipPlan from "./Pages/MemberShipPlan/MemberShipPlan"
import SuccessPayment from "./Pages/PaymentStatusPage/SuccessPayment"
import PaymentFailed from "./Pages/PaymentStatusPage/PaymentFailed"
import UserDashboard from "./Pages/Dashboard/UserDashboard"
// import VendorTest from "./Components/Auth/VendorTest"

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing" element={<ListingsPage />} />
          <Route path="/vendor-dashboard" element={<Dashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/sign-up" element={<Registration />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/doctor-detail" element={<DoctorSinglePage />} />
          <Route path="/job-detail" element={<JobSingle />} />
          <Route path="/*" element={<Error />} />
          <Route path="/sub-category/:name" element={<Category />} />
          <Route path="/service/:title" element={<SubCategory />} />
          {/* <Route path="/Make-a-Service-Provider" element={<RegisterServiceProvider />} /> */}
          <Route path="/vendor-registration" element={<VendorRegistration />} />
          <Route path="/maintenance-ahu-fcu" element={<MaintenanceofAHUandFCU />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Forget />} />
          <Route path="/add-vendor-member/:id" element={<AddMembersForm />} />
          <Route path="/membership-plan/:vendorId" element={<MemberShipPlan />} />
          <Route path="/successfull-payment" element={<SuccessPayment />} />
          <Route path="/failed-payment" element={<PaymentFailed />} />

          
        </Routes>
        {/* <NewsLetter /> */}
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
