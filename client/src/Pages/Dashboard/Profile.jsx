import React, { useEffect } from 'react'

function Profile() {
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
								<h1 class="ft-medium">Profile Info</h1>
								<nav aria-label="breadcrumb">
									<ol class="breadcrumb">
										<li class="breadcrumb-item text-muted"><a href="#">Home</a></li>
										<li class="breadcrumb-item text-muted"><a href="#">Dashboard</a></li>
										<li class="breadcrumb-item"><a href="#" class="theme-cl">My Profile</a></li>
									</ol>
								</nav>
							</div>
						</div>
					</div>
					
					<div class="dashboard-widg-bar d-block">
						<div class="row">
							<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 order-xl-last order-lg-last order-md-last">
								<div class="d-flex bg-white rounded px-3 py-3 mb-3">
									<div class="dash-figure">
										<div class="dash-figure-thumb"><img src="assets/img/t-4.png" class="img-fluid rounded" alt="" /></div>
										<div class="upload-photo-btn">
											<div class="Uploadphoto">
												<span><i class="fas fa-upload"></i> Upload Photo</span>
												<input type="file" class="upload" />
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-xl-9 col-lg-9 col-md-8 col-sm-12">
								<form class="submit-form">
									<div class="dashboard-list-wraps bg-white rounded mb-4">
										<div class="dashboard-list-wraps-head br-bottom py-3 px-3">
											<div class="dashboard-list-wraps-flx">
												<h4 class="mb-0 ft-medium fs-md"><i class="fa fa-user-check me-2 theme-cl fs-sm"></i>My Profile</h4>	
											</div>
										</div>
										
										<div class="dashboard-list-wraps-body py-3 px-3">
											<div class="row">
												<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
													<div class="form-group">
														<label class="mb-1">First Name</label>
														<input type="text" class="form-control rounded" placeholder="Amit Kumar" />
													</div>
												</div>
												<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
													<div class="form-group">
														<label class="mb-1">Last Name</label>
														<input type="text" class="form-control rounded" placeholder="Singh" />
													</div>
												</div>
												<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
													<div class="form-group">
														<label class="mb-1">Email ID</label>
														<input type="text" class="form-control rounded" placeholder="amitkumar@gmail.com" />
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
												<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
													<div class="form-group">
														<label class="mb-1">About Notes</label>
														<textarea class="form-control rounded ht-150" placeholder="Describe your self"></textarea>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="dashboard-list-wraps bg-white rounded mb-4">
										<div class="dashboard-list-wraps-head br-bottom py-3 px-3">
											<div class="dashboard-list-wraps-flx">
												<h4 class="mb-0 ft-medium fs-md"><i class="fa fa-user-friends me-2 theme-cl fs-sm"></i>My Social Links</h4>	
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
														<button class="btn theme-bg rounded text-light">Save Changes</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
							
					</div>
		
				</div>
    </>
  )
}

export default Profile
