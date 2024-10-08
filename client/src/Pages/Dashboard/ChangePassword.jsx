import React, { useEffect } from 'react'

function ChangePassword() {
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
								<h1 class="ft-medium">Change Password</h1>
								<nav aria-label="breadcrumb">
									<ol class="breadcrumb">
										<li class="breadcrumb-item text-muted"><a href="#">Home</a></li>
										<li class="breadcrumb-item text-muted"><a href="#">Dashboard</a></li>
										<li class="breadcrumb-item"><a href="#" class="theme-cl">Change Password</a></li>
									</ol>
								</nav>
							</div>
						</div>
					</div>
					
					<div class="dashboard-widg-bar d-block">
						<div class="row">
							<div class="col-xl-12 col-lg-12 col-md-12">
								<div class="_dashboard_content bg-white rounded mb-4">
									<div class="_dashboard_content_header br-bottom py-3 px-3">
										<div class="_dashboard__header_flex">
											<h4 class="mb-0 ft-medium fs-md"><i class="fa fa-lock me-2 theme-cl fs-sm"></i>Change Password</h4>	
										</div>
									</div>
									
									<div class="_dashboard_content_body py-3 px-3">
										<form class="row submit-form">
											<div class="col-xl-8 col-lg-9 col-md-12 col-sm-12">
												<div class="form-group">
													<label>Old Password</label>
													<input type="text" class="form-control rounded" placeholder="" />
												</div>
											</div>
											<div class="col-xl-8 col-lg-9 col-md-12 col-sm-12">
												<div class="form-group">
													<label>New Password</label>
													<input type="text" class="form-control rounded" placeholder="" />
												</div>
											</div>
											<div class="col-xl-8 col-lg-9 col-md-12 col-sm-12">
												<div class="form-group">
													<label>Confirm Password</label>
													<input type="text" class="form-control rounded" placeholder="" />
												</div>
											</div>
											<div class="col-xl-12 col-lg-12">
												<div class="form-group">
													<button type="submit" class="btn btn-md ft-medium text-light rounded theme-bg">Save Changes</button>
												</div>
											</div>
											
										</form>
									</div>
								</div>
							</div>
						</div>
							
					</div>
		
				</div>
    </>
  )
}

export default ChangePassword
