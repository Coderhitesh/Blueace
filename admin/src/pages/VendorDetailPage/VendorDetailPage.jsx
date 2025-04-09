import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VendorDetailPage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const { data } = await axios.get(`https://api.blueaceindia.com/api/v1/single-vendor/${id}`);
        setVendor(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleFetch();
  }, [id]);

  if (!vendor) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">{vendor.companyName}</h3>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <img src={vendor.panImage.url} alt="PAN Card" className="img-fluid rounded mb-3" />
                </div>
                <div className="col-md-6">
                  <img src={vendor.adharImage.url} alt="Aadhar Card" className="img-fluid rounded mb-3" />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-primary">Basic Information</h5>
                  <ul className="list-unstyled">
                    <li><strong>Owner Name:</strong> {vendor.ownerName}</li>
                    <li><strong>Email:</strong> {vendor.Email}</li>
                    <li><strong>Contact:</strong> {vendor.ContactNumber}</li>
                    <li><strong>Registration Year:</strong> {new Date(vendor.yearOfRegistration).getFullYear()}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5 className="text-primary">Document Details</h5>
                  <ul className="list-unstyled">
                    <li><strong>PAN No:</strong> {vendor.panNo}</li>
                    <li><strong>GST No:</strong> {vendor.gstNo || 'Not Available'}</li>
                    <li><strong>Aadhar No:</strong> {vendor.adharNo}</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-primary">Address Details</h5>
                <p>{vendor.address}</p>
                <p><strong>House No:</strong> {vendor.HouseNo}</p>
                <p><strong>Pin Code:</strong> {vendor.PinCode}</p>
              </div>

              {/* <div className="mt-4">
                <h5 className="text-primary">Membership Details</h5>
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title">{vendor.memberShipPlan.name} Plan</h6>
                    <p className="card-text">Price: ₹{vendor.memberShipPlan.price}</p>
                    <h6>Offers:</h6>
                    <ul>
                      {vendor.memberShipPlan.offer.map((offer, index) => (
                        <li key={offer._id}>{offer.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div> */}

              <div className="mt-4">
                <h5 className="text-primary">Working Hours</h5>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Morning</th>
                        <th>Afternoon</th>
                        <th>Evening</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendor.workingHour.schedule.map((schedule, index) => (
                        <tr key={index}>
                          <td>{schedule.day}</td>
                          <td>{schedule.morningSlot}</td>
                          <td>{schedule.afternoonSlot}</td>
                          <td>{schedule.eveningSlot}</td>
                          <td>
                            <span className={`badge ${schedule.is_active ? 'bg-success' : 'bg-danger'}`}>
                              {schedule.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-primary">Status Information</h5>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Member Status
                        <span className={`badge ${vendor.isMember ? 'bg-success' : 'bg-secondary'}`}>
                          {vendor.isMember ? 'Member' : 'Non-Member'}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Verification Status
                        <span className={`badge ${vendor.verifyed ? 'bg-success' : 'bg-warning'}`}>
                          {vendor.verifyed ? 'Verified' : 'Pending'}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Work Status
                        <span className={`badge ${vendor.readyToWork ? 'bg-success' : 'bg-danger'}`}>
                          {vendor.readyToWork ? 'Ready to Work' : 'Not Available'}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-title">Wallet Balance</h6>
                        <h3 className="text-success">₹{vendor.walletAmount}</h3>
                        <p className="card-text">
                          <small className="text-muted">Payment Status: {vendor.PaymentStatus}</small>
                        </p>
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
  );
};

export default VendorDetailPage;