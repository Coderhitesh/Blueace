import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Profile({ userData }) {
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, []);

	const userId = userData?._id;

	const [loading, setLoading] = useState(false);
	const [imagePreviews, setImagePreviews] = useState(null)
	const [formData, setFormData] = useState({
		UserType: '',
		companyName: '',
		FullName: '',
		ContactNumber: '',
		Email: '',
		City: '',
		PinCode: '',
		HouseNo: '',
		Street: '',
		NearByLandMark: '',
		userImage: null, // Added userImage field
	});

	const fetchExistingUser = async () => {
		try {
			const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/get-single-user/${userId}`);
			const existinguser = data.data;
			setFormData({
				FullName: existinguser.FullName,
				companyName: existinguser?.companyName,
				ContactNumber: existinguser.ContactNumber,
				Email: existinguser.Email,
				City: existinguser.City,
				PinCode: existinguser.PinCode,
				HouseNo: existinguser.HouseNo,
				Street: existinguser.Street,
				NearByLandMark: existinguser.NearByLandMark,
				userImage: existinguser.userImage || null, // Set existing image if available
				UserType: existinguser.UserType
			});

		} catch (error) {
			console.log('Internal server error', error);
			toast.error(error?.response?.data?.message);
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle file change for userImage
	const handleServiceImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData(prevData => ({
				...prevData,
				userImage: file
			}));
			setImagePreviews(URL.createObjectURL(file));
			toast.success('Image selected successfully!');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Validate required fields
		if (!formData.FullName || !formData.ContactNumber || !formData.Email ||
			!formData.HouseNo || !formData.Street || !formData.NearByLandMark) {
			toast.error('Please fill in all required fields');
			setLoading(false);
			return;
		}

		// console.log("fullname",formData.FullName)

		const Payload = new FormData();
		Payload.append('FullName', formData.FullName);
		Payload.append('companyName', formData.companyName);
		Payload.append('ContactNumber', formData.ContactNumber);
		Payload.append('Email', formData.Email);
		Payload.append('City', formData.City);
		Payload.append('PinCode', formData.PinCode);
		Payload.append('HouseNo', formData.HouseNo);
		Payload.append('Street', formData.Street);
		Payload.append('NearByLandMark', formData.NearByLandMark);

		if (formData.userImage) {
			Payload.append('userImage', formData.userImage);
		}

		try {
			const res = await axios.put(`https://api.blueaceindia.com/api/v1/update-user/${userId}`, Payload, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			toast.success(res.data.message);
		} catch (error) {
			console.log('Internal server error', error);
			toast.error(error?.response?.data?.message);
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		fetchExistingUser();
	}, []);

	return (
		<>
			<div className="goodup-dashboard-content">
				<div className="dashboard-tlbar d-block mb-5">
					<div className="row">
						<div className="colxl-12 col-lg-12 col-md-12">
							<h1 className="ft-medium">Profile Info</h1>
							<nav aria-label="breadcrumb">
								<ol className="breadcrumb">
									<li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
									<li className="breadcrumb-item text-muted"><a href="/user-dashboard">Dashboard</a></li>
									<li className="breadcrumb-item"><a className="theme-cl">My Profile</a></li>
								</ol>
							</nav>
						</div>
					</div>
				</div>

				<div className="dashboard-widg-bar d-block">
					<div className="row">
						{/* <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 order-xl-last order-lg-last order-md-last">
								<div className="d-flex bg-white rounded px-3 py-3 mb-3">
									<div className="dash-figure">
										<div className="dash-figure-thumb"><img src="assets/img/t-4.png" className="img-fluid rounded" alt="" /></div>
										<div className="upload-photo-btn">
											<div className="Uploadphoto">
												<span><i className="fas fa-upload"></i> Upload Photo</span>
												<input type="file" className="upload" />
											</div>
										</div>
									</div>
								</div>
							</div> */}
						<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
							<form className="submit-form" onSubmit={handleSubmit}>
								<div className="dashboard-list-wraps bg-white rounded mb-4">
									<div className="dashboard-list-wraps-head br-bottom py-3 px-3">
										<div className="dashboard-list-wraps-flx">
											<h4 className="mb-0 ft-medium fs-md"><i className="fa fa-user-check me-2 theme-cl fs-sm"></i>My Profile</h4>
										</div>
									</div>

									<div className="dashboard-list-wraps-body py-3 px-3">
										<div className="row">
											{
												formData.UserType === 'Corporate' && (
													<>
														<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
															<div className="form-group">
																<label className="mb-1">Company Name</label>
																<input type="text" value={formData.companyName} name='companyName' onChange={handleChange} className="form-control rounded" placeholder="Company Name" />
															</div>
														</div>
													</>
												)
											}
											<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
												<div className="form-group">
													<label className="mb-1">First Name</label>
													<input type="text" value={formData.FullName} name='FullName' onChange={handleChange} className="form-control rounded" placeholder="Full Name" />
												</div>
											</div>
											{/* <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
													<div className="form-group">
														<label className="mb-1">Last Name</label>
														<input type="text" className="form-control rounded" placeholder="Singh" />
													</div>
												</div> */}

											<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
												<div className="form-group">
													<label className="mb-1">Email ID</label>
													<input type="email" value={formData.Email} name='Email' onChange={handleChange} className="form-control rounded" placeholder="Email" />
												</div>
											</div>
											<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
												<div className="form-group">
													<label className="mb-1">Mobile</label>
													<input type="text" value={formData.ContactNumber} onChange={handleChange} name='ContactNumber' className="form-control rounded" placeholder="Phone Number" />
												</div>
											</div>
											<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
												<div className="form-group">
													<label className="mb-1">House No.</label>
													<input type="text" value={formData.HouseNo} onChange={handleChange} name='HouseNo' className="form-control rounded" placeholder="91 256 584 7895" />
												</div>
											</div>
											<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
												<div className="form-group">
													<label className="mb-1">Street</label>
													<input type="text" value={formData.Street} onChange={handleChange} name='Street' className="form-control rounded" placeholder="91 256 584 7895" />
												</div>
											</div>
											<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
												<div className="form-group">
													<label className="mb-1">City</label>
													<input type="text" value={formData.City} onChange={handleChange} name='City' className="form-control rounded" placeholder="91 256 584 7895" />
												</div>
											</div>
											<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
												<div className="form-group">
													<label className="mb-1">PinCode</label>
													<input type="text" value={formData.PinCode} onChange={handleChange} name='PinCode' className="form-control rounded" placeholder="91 256 584 7895" />
												</div>
											</div>
											<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
												<div className="form-group">
													<label className="mb-1">Near By LandMark</label>
													<input type="text" value={formData.NearByLandMark} onChange={handleChange} name='NearByLandMark' className="form-control rounded" placeholder="91 256 584 7895" />
												</div>
											</div>
											<div className="col-lg-6 col-md-6">
												{imagePreviews && (
													<div className="mb-3">
														<h5>Profile Image Preview:</h5>
														<img src={imagePreviews} alt="Icon Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
													</div>
												)}
												<label className="mb-1">Upload Profile Image</label>
												<input type="file" name="userImage" onChange={handleServiceImageUpload} className="form-control" />
												{/* <label className="smart-text">Maximum file size: 2 MB.</label> */}
											</div>
											<div className="col-xl-12 mt-2 col-lg-12 col-md-12 col-sm-12">
												<div className="form-group">
													<button className={`btn theme-bg rounded text-light ${loading ? 'disabled' : ''}`} type='submit' disabled={loading}>{loading ? 'Please Wait...' : 'Save Changes'}</button>
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
