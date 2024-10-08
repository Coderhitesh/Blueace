import React, { useEffect } from 'react'

function AddListing() {
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    },[])
    return (
        <>
            <div class="goodup-dashboard-content">
                <div class="dashboard-tlbar d-block mb-5">
                    <div class="row">
                        <div class="colxl-12 col-lg-12 col-md-12">
                            <h1 class="ft-medium">Add Listing</h1>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item text-muted"><a href="#">Home</a></li>
                                    <li class="breadcrumb-item text-muted"><a href="#">Dashboard</a></li>
                                    <li class="breadcrumb-item"><a href="#" class="theme-cl">Add Listing</a></li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

                <div class="dashboard-widg-bar d-block">
                    <div class="row">
                        <div class="col-xl-12 col-lg-2 col-md-12 col-sm-12">
                            <div class="submit-form">

                                {/* <!-- Listing Info --> */}
                                <div class="dashboard-list-wraps bg-white rounded mb-4">
                                    <div class="dashboard-list-wraps-head br-bottom py-3 px-3">
                                        <div class="dashboard-list-wraps-flx">
                                            <h4 class="mb-0 ft-medium fs-md"><i class="fa fa-file me-2 theme-cl fs-sm"></i>Listing Info</h4>
                                        </div>
                                    </div>

                                    <div class="dashboard-list-wraps-body py-3 px-3">
                                        <div class="row">
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Listing Tile</label>
                                                    <input type="text" class="form-control rounded" placeholder="Decathlon Sport House" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Categories</label>
                                                    <select class="form-control">
                                                        <option>Hotel & Spa</option>
                                                        <option>Education</option>
                                                        <option>Wedding</option>
                                                        <option>Restaurents</option>
                                                        <option>Cafe & Bars</option>
                                                        <option>Bankings</option>
                                                        <option>Services</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Keywords</label>
                                                    <input type="text" class="form-control rounded" placeholder="Type keywords by comma's" />
                                                </div>
                                            </div>
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">About Listing</label>
                                                    <textarea class="form-control rounded ht-150" placeholder="Describe your self"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Location Info --> */}
                                <div class="dashboard-list-wraps bg-white rounded mb-4">
                                    <div class="dashboard-list-wraps-head br-bottom py-3 px-3">
                                        <div class="dashboard-list-wraps-flx">
                                            <h4 class="mb-0 ft-medium fs-md"><i class="fas fa-map-marker-alt me-2 theme-cl fs-sm"></i>Location Info</h4>
                                        </div>
                                    </div>

                                    <div class="dashboard-list-wraps-body py-3 px-3">
                                        <div class="row">
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Latitude</label>
                                                    <input type="text" class="form-control rounded" placeholder="8054256" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Longitude</label>
                                                    <input type="text" class="form-control rounded" placeholder="-7254625" />
                                                </div>
                                            </div>
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27437.803590312993!2d76.75937213955079!3d30.726117899999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390feda9761bdc2f%3A0x5e764f7f18edc390!2sMidpoint%20Cafe!5e0!3m2!1sen!2sin!4v1649569611177!5m2!1sen!2sin" class="full-width" height="300" style={{border:'0'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">State</label>
                                                    <select class="form-control">
                                                        <option>Uttar Pradesh</option>
                                                        <option>Uttrakhand</option>
                                                        <option>Gujrat</option>
                                                        <option>Mumbai</option>
                                                        <option>Karnatak</option>
                                                        <option>Goa</option>
                                                        <option>Punjab</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">City</label>
                                                    <select class="form-control">
                                                        <option>Aligarh</option>
                                                        <option>Allahabad</option>
                                                        <option>Agra</option>
                                                        <option>Gonda</option>
                                                        <option>Lucknow</option>
                                                        <option>Meeruth</option>
                                                        <option>Gaziabad</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Address</label>
                                                    <input type="text" class="form-control rounded" placeholder="USA 20TH Berlin Market NY" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Zip Code</label>
                                                    <input type="text" class="form-control rounded" placeholder="HQ125478" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Mobile</label>
                                                    <input type="text" class="form-control rounded" placeholder="91 256 584 7895" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Email</label>
                                                    <input type="text" class="form-control rounded" placeholder="kumarsrikan@gmail.com" />
                                                </div>
                                            </div>
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Website</label>
                                                    <input type="text" class="form-control rounded" placeholder="https://www.kuamrsrikant.com/" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Image & Gallery Option --> */}
                                <div class="dashboard-list-wraps bg-white rounded mb-4">
                                    <div class="dashboard-list-wraps-head br-bottom py-3 px-3">
                                        <div class="dashboard-list-wraps-flx">
                                            <h4 class="mb-0 ft-medium fs-md"><i class="fa fa-camera me-2 theme-cl fs-sm"></i>Image & Gallery Option</h4>
                                        </div>
                                    </div>

                                    <div class="dashboard-list-wraps-body py-3 px-3">
                                        <div class="row">
                                            {/* <!-- Logo --> */}
                                            <div class="col-lg-4 col-md-6">
                                                <label class="mb-1">Upload Logo</label>
                                                <form action="/file-upload" class="dropzone" id="single-logo">
                                                    <i class="fas fa-upload"></i>
                                                </form>
                                                <label class="smart-text">Maximum file size: 2 MB.</label>
                                            </div>

                                            {/* <!-- Featured Image --> */}
                                            <div class="col-lg-4 col-md-6">
                                                <label class="mb-1">Featured Image</label>
                                                <form action="/file-upload" class="dropzone" id="featured-image">
                                                    <i class="fas fa-upload"></i>
                                                </form>
                                                <label class="smart-text">Maximum file size: 2 MB.</label>
                                            </div>

                                            {/* <!-- Gallery --> */}
                                            <div class="col-lg-4 col-md-12">
                                                <label class="mb-1">Image Gallery</label>
                                                <form action="/file-upload" class="dropzone" id="gallery">
                                                    <i class="fas fa-upload"></i>
                                                </form>
                                                <label class="smart-text">Maximum file size: 2 MB.</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Menu Items --> */}
                                <div class="dashboard-list-wraps bg-white rounded mb-4">
                                    <div class="dashboard-list-wraps-head br-bottom py-3 px-3">
                                        <div class="dashboard-list-wraps-flx">
                                            <h4 class="mb-0 ft-medium fs-md"><i class="fas fa-utensils me-2 theme-cl fs-sm"></i>Menu Items</h4>
                                        </div>
                                    </div>

                                    <div class="dashboard-list-wraps-body py-3 px-3">
                                        <div class="row">
                                            <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Item Name</label>
                                                    <input type="text" class="form-control rounded" placeholder="Spicy Brunchi Burger" />
                                                </div>
                                            </div>
                                            <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Category</label>
                                                    <input type="text" class="form-control rounded" placeholder="Fast Food" />
                                                </div>
                                            </div>
                                            <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">Price</label>
                                                    <input type="text" class="form-control rounded" placeholder="ex. 49 USD" />
                                                </div>
                                            </div>
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1">About Item</label>
                                                    <textarea class="form-control rounded ht-80" placeholder="Describe your Item"></textarea>
                                                </div>
                                            </div>
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label for="formFileLg" class="form-label">Upload Item Image</label>
                                                    <input class="form-control rounded" id="formFileLg" type="file" />
                                                </div>
                                            </div>
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <button type="button" class="btn theme-cl rounded theme-bg-light ft-medium">Add New</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Working hours --> */}
                                <div class="dashboard-list-wraps bg-white rounded mb-4">
                                    <div class="dashboard-list-wraps-head br-bottom py-3 px-3">
                                        <div class="dashboard-list-wraps-flx">
                                            <h4 class="mb-0 ft-medium fs-md"><i class="fa fa-clock me-2 theme-cl fs-sm"></i>Working Hours</h4>
                                        </div>
                                    </div>

                                    <div class="dashboard-list-wraps-body py-3 px-3">
                                        <div class="row">
                                            <div class="form-group">
                                                <div class="row align-items-center">
                                                    <label class="control-label col-lg-2 col-md-2">Monday</label>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control chosen-select">
                                                            <option>Opening Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control">
                                                            <option>Closing Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <div class="row align-items-center">
                                                    <label class="control-label col-lg-2 col-md-2">Tuesday</label>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control chosen-select">
                                                            <option>Opening Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control">
                                                            <option>Closing Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <div class="row align-items-center">
                                                    <label class="control-label col-lg-2 col-md-2">Wednesday</label>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control chosen-select">
                                                            <option>Opening Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control">
                                                            <option>Closing Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <div class="row align-items-center">
                                                    <label class="control-label col-lg-2 col-md-2">Thursday</label>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control chosen-select">
                                                            <option>Opening Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control">
                                                            <option>Closing Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <div class="row align-items-center">
                                                    <label class="control-label col-lg-2 col-md-2">Friday</label>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control chosen-select">
                                                            <option>Opening Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control">
                                                            <option>Closing Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <div class="row align-items-center">
                                                    <label class="control-label col-lg-2 col-md-2">Saturday</label>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control chosen-select">
                                                            <option>Opening Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control">
                                                            <option>Closing Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <div class="row align-items-center">
                                                    <label class="control-label col-lg-2 col-md-2">Sunday</label>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control chosen-select">
                                                            <option>Opening Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-5 col-md-5">
                                                        <select class="form-control">
                                                            <option>Closing Time</option>
                                                            <option>1 :00 AM</option>
                                                            <option>2 :00 AM</option>
                                                            <option>3 :00 AM</option>
                                                            <option>4 :00 AM</option>
                                                            <option>5 :00 AM</option>
                                                            <option>6 :00 AM</option>
                                                            <option>7 :00 AM</option>
                                                            <option>8 :00 AM</option>
                                                            <option>9 :00 AM</option>
                                                            <option>10 :00 AM</option>
                                                            <option>11 :00 AM</option>
                                                            <option>12 :00 AM</option>
                                                            <option>1 :00 PM</option>
                                                            <option>2 :00 PM</option>
                                                            <option>3 :00 PM</option>
                                                            <option>4 :00 PM</option>
                                                            <option>5 :00 PM</option>
                                                            <option>6 :00 PM</option>
                                                            <option>7 :00 PM</option>
                                                            <option>8 :00 PM</option>
                                                            <option>9 :00 PM</option>
                                                            <option>10 :00 PM</option>
                                                            <option>11 :00 PM</option>
                                                            <option>12 :00 PM</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="form-group mt-4">
                                                <input id="t24" class="checkbox-custom" name="24-1" type="checkbox" />
                                                    <label for="t24" class="checkbox-custom-label">This Business open 7x24</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Amenties Options --> */}
                                <div class="dashboard-list-wraps bg-white rounded mb-4">
                                    <div class="dashboard-list-wraps-head br-bottom py-3 px-3">
                                        <div class="dashboard-list-wraps-flx">
                                            <h4 class="mb-0 ft-medium fs-md"><i class="lni lni-coffee-cup me-2 theme-cl fs-sm"></i>Amenties Options</h4>
                                        </div>
                                    </div>

                                    <div class="dashboard-list-wraps-body py-3 px-3">
                                        <div class="row">
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div class="Goodup-all-features-list">
                                                    <ul>
                                                        <li>
                                                            <input id="am1" class="checkbox-custom" name="am1" type="checkbox" />
                                                            <label for="am1" class="checkbox-custom-label">Health Score 8.7 / 10</label>
                                                        </li>
                                                        <li>
                                                            <input id="am2" class="checkbox-custom" name="am2" type="checkbox" />
                                                            <label for="am2" class="checkbox-custom-label">Reservations</label>
                                                        </li>
                                                        <li>
                                                            <input id="am3" class="checkbox-custom" name="am3" type="checkbox" />
                                                            <label for="am3" class="checkbox-custom-label">Vegetarian Options</label>
                                                        </li>
                                                        <li>
                                                            <input id="am4" class="checkbox-custom" name="am4" type="checkbox" />
                                                            <label for="am4" class="checkbox-custom-label">Moderate Noise</label>
                                                        </li>
                                                        <li>
                                                            <input id="am5" class="checkbox-custom" name="am5" type="checkbox" />
                                                            <label for="am5" class="checkbox-custom-label">Good For Kids</label>
                                                        </li>
                                                        <li>
                                                            <input id="am6" class="checkbox-custom" name="am6" type="checkbox" />
                                                            <label for="am6" class="checkbox-custom-label">Private Lot Parking</label>
                                                        </li>
                                                        <li>
                                                            <input id="am7" class="checkbox-custom" name="am7" type="checkbox" />
                                                            <label for="am7" class="checkbox-custom-label">Beer & Wine</label>
                                                        </li>
                                                        <li>
                                                            <input id="am8" class="checkbox-custom" name="am8" type="checkbox" />
                                                            <label for="am8" class="checkbox-custom-label">TV Services</label>
                                                        </li>
                                                        <li>
                                                            <input id="am9" class="checkbox-custom" name="am9" type="checkbox" />
                                                            <label for="am9" class="checkbox-custom-label">Pets Allow</label>
                                                        </li>
                                                        <li>
                                                            <input id="am10" class="checkbox-custom" name="am10" type="checkbox" />
                                                            <label for="am10" class="checkbox-custom-label">Offers Delivery</label>
                                                        </li>
                                                        <li>
                                                            <input id="am11" class="checkbox-custom" name="am11" type="checkbox" />
                                                            <label for="am11" class="checkbox-custom-label">Staff wears masks</label>
                                                        </li>
                                                        <li>
                                                            <input id="am12" class="checkbox-custom" name="am12" type="checkbox" />
                                                            <label for="am12" class="checkbox-custom-label">Accepts Credit Cards</label>
                                                        </li>
                                                        <li>
                                                            <input id="am13" class="checkbox-custom" name="am13" type="checkbox" />
                                                            <label for="am13" class="checkbox-custom-label">Offers Catering</label>
                                                        </li>
                                                        <li>
                                                            <input id="am14" class="checkbox-custom" name="am14" type="checkbox" />
                                                            <label for="am14" class="checkbox-custom-label">Good for Breakfast</label>
                                                        </li>
                                                        <li>
                                                            <input id="am15" class="checkbox-custom" name="am15" type="checkbox" />
                                                            <label for="am15" class="checkbox-custom-label">Waiter Service</label>
                                                        </li>
                                                        <li>
                                                            <input id="am16" class="checkbox-custom" name="am16" type="checkbox" />
                                                            <label for="am16" class="checkbox-custom-label">Drive-Thru</label>
                                                        </li>
                                                        <li>
                                                            <input id="am17" class="checkbox-custom" name="am17" type="checkbox" />
                                                            <label for="am17" class="checkbox-custom-label">Outdoor Seating</label>
                                                        </li>
                                                        <li>
                                                            <input id="am18" class="checkbox-custom" name="am18" type="checkbox" />
                                                            <label for="am18" class="checkbox-custom-label">Offers Takeout</label>
                                                        </li>
                                                        <li>
                                                            <input id="am19" class="checkbox-custom" name="am19" type="checkbox" />
                                                            <label for="am19" class="checkbox-custom-label">Vegan Options</label>
                                                        </li>
                                                        <li>
                                                            <input id="am20" class="checkbox-custom" name="am20" type="checkbox" />
                                                            <label for="am20" class="checkbox-custom-label">Casual</label>
                                                        </li>
                                                        <li>
                                                            <input id="am21" class="checkbox-custom" name="am21" type="checkbox" />
                                                            <label for="am21" class="checkbox-custom-label">Good for Groups</label>
                                                        </li>
                                                        <li>
                                                            <input id="am22" class="checkbox-custom" name="am22" type="checkbox" />
                                                            <label for="am22" class="checkbox-custom-label">Brunch, Lunch, Dinner</label>
                                                        </li>
                                                        <li>
                                                            <input id="am23" class="checkbox-custom" name="am23" type="checkbox" />
                                                            <label for="am23" class="checkbox-custom-label">Free Wi-Fi</label>
                                                        </li>
                                                        <li>
                                                            <input id="am24" class="checkbox-custom" name="am24" type="checkbox" />
                                                            <label for="am24" class="checkbox-custom-label">Wheelchair Accessible</label>
                                                        </li>
                                                        <li>
                                                            <input id="am25" class="checkbox-custom" name="am25" type="checkbox" />
                                                            <label for="am25" class="checkbox-custom-label">Happy Hour</label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Social Links --> */}
                                <div class="dashboard-list-wraps bg-white rounded mb-4">
                                    <div class="dashboard-list-wraps-head br-bottom py-3 px-3">
                                        <div class="dashboard-list-wraps-flx">
                                            <h4 class="mb-0 ft-medium fs-md"><i class="fa fa-user-friends me-2 theme-cl fs-sm"></i>Social Links</h4>
                                        </div>
                                    </div>

                                    <div class="dashboard-list-wraps-body py-3 px-3">
                                        <div class="row">
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1"><i class="ti-facebook theme-cl me-1"></i>Facebook</label>
                                                    <input type="text" class="form-control rounded" placeholder="https://facebook.com/" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1"><i class="ti-twitter theme-cl me-1"></i>Twitter</label>
                                                    <input type="text" class="form-control rounded" placeholder="https://twitter.com/" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1"><i class="ti-instagram theme-cl me-1"></i>Instagram</label>
                                                    <input type="text" class="form-control rounded" placeholder="https://instagram.com/" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <label class="mb-1"><i class="ti-linkedin theme-cl me-1"></i>Linkedin</label>
                                                    <input type="text" class="form-control rounded" placeholder="https://linkedin.com/" />
                                                </div>
                                            </div>
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                    <button class="btn theme-bg rounded text-light">Submit & Preview</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default AddListing
