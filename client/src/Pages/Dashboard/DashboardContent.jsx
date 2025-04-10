import React, { useEffect, useState } from 'react'
import axios from 'axios'
function DashboardContent({ userData, activeOrder, allOrder, completeOrderCount, cancelOrderCount, loading }) {
	const [dashboard, setDashboard] = useState({})
	const token = sessionStorage.getItem('token');
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}, [])
	const fetchDashboardData = async () => {
		try {
			const { data } = await axios.get('https://www.api.blueaceindia.com/api/v1/getAnylaticalData?OrderStatus=Service Done&secondStatus=Pending', {
				headers: { Authorization: `Bearer ${token}` }
			})

			// console.log(data)
			setDashboard(data)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		fetchDashboardData()
	}, [token])
	if(loading) {
		return <div>Loading...</div>
	}

	return (
		<>
			<div className="goodup-dashboard-content">
				<div className="dashboard-tlbar d-block mb-5">
					<div className="row">
						<div className="colxl-12 col-lg-12 col-md-12">
							<h1 className="ft-medium">Hello, {userData.FullName}</h1>
							<nav aria-label="breadcrumb">
								<ol className="breadcrumb">
									<li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
									<li className="breadcrumb-item"><a href="#" className="theme-cl">Dashboard</a></li>
								</ol>
							</nav>
						</div>
					</div>
				</div>

				<div className="dashboard-widg-bar d-block">
					{/* <div className="row">
						<div className="col-xl-12 col-lg-12 col-md-12 mb-3">
							<div className="alert bg-inverse text-light d-flex align-items-center" role="alert">
								<p className="p-0 m-0 ft-medium full-width">Your listing <a href="#" className="text-success">Wedding Willa Resort</a> has been approved!</p>
								<button type="button" className="btn-close text-light" data-bs-dismiss="alert" aria-label="Close"></button>
							</div>
						</div>
					</div> */}
					<div className="row">
						<div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
							<div className="dsd-boxed-widget py-5 px-4 bg-danger rounded">
								{/* <h2 className="ft-medium mb-1 fs-xl text-light count">{dashboard?.pendingsHave || 0}</h2> */}
								<h2 className="ft-medium mb-1 fs-xl text-light count">{activeOrder.length || 0}</h2>
								<p className="p-0 m-0 text-light fs-md">Active Order</p>
								<i className="lni lni-empty-file"></i>
							</div>
						</div>
						<div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
							<div className="dsd-boxed-widget py-5 px-4 bg-success rounded">
								{/* <h2 className="ft-medium mb-1 fs-xl text-light count">{dashboard?.allOrdersHave || 0}</h2> */}
								<h2 className="ft-medium mb-1 fs-xl text-light count">{allOrder.length || 0}</h2>
								<p className="p-0 m-0 text-light fs-md">All Order</p>
								<i className="lni lni-eye"></i>
							</div>
						</div>
						<div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
							<div className="dsd-boxed-widget py-5 px-4 bg-warning rounded">
								{/* <h2 className="ft-medium mb-1 fs-xl text-light count">{dashboard?.Cancelled || 0}</h2> */}
								<h2 className="ft-medium mb-1 fs-xl text-light count">{cancelOrderCount || 0}</h2>
								<p className="p-0 m-0 text-light fs-md">Cancelled Order</p>
								<i className="lni lni-comments"></i>
							</div>
						</div>
						<div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
							<div className="dsd-boxed-widget py-5 px-4 bg-purple rounded">
								{/* <h2 className="ft-medium mb-1 fs-xl text-light count">{dashboard?.count}</h2> */}
								<h2 className="ft-medium mb-1 fs-xl text-light count">{completeOrderCount}</h2>
								<p className="p-0 m-0 text-light fs-md">Completed Order</p>
								<i className="lni lni-wallet"></i>
							</div>
						</div>
					</div>

					
			

				</div>

			</div>
		</>
	)
}

export default DashboardContent
