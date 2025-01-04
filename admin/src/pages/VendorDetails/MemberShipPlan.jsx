import React, { useEffect, useState } from 'react';
import './membership.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function MemberShipPlan() {
    const { vendorId } = useParams(); // Extract vendorId from URL parameters
    const [price, setPrice] = useState([]); // State to hold the membership plans
    const [vendorData, setVendorData] = useState({
        ownerName: '',
        ContactNumber: '',
        Email: ''
    })

    // console.log('vendorData',vendorData)

    const fetchVendorDetail = async () => {
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/all-vendor')
            const allVendorData = res.data.data
            const filterVendor = allVendorData.filter((item) => item._id === vendorId)
            setVendorData({
                ownerName: filterVendor[0].ownerName,
                ContactNumber: filterVendor[0].ContactNumber,
                Email: filterVendor[0].Email
            })
        } catch (error) {
            console.log("Internal Server Error in fetching vendor detail", error)
        }
    }

    useEffect(() => {
        fetchVendorDetail()
    }, [vendorId])

    // Fetch all membership plans
    const fetchMemberShipPlan = async () => {
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-membership-plan');
            setPrice(res.data.data); // Set membership plans to state
        } catch (error) {
            console.log(error);
        }
    };

    // Handle submission of selected membership plan for a vendor
    const handleSubmit = async (vendorId, planId, planPrice) => {
        try {

            // Create the membership plan order
            const res = await axios.post(`https://www.api.blueaceindia.com/api/v1/member-ship-plan/${vendorId}`, {
                memberShipPlan: planId
            });

            if (res.data.success) {

                window.location.href = res.data.url;
            } else {
                console.error('Error initiating payment:', res.data.message);
            }

        } catch (error) {
            console.log('Internal server error in buying membership plan', error);
        }
    };

    // Fetch membership plans on component mount
    useEffect(() => {
        fetchMemberShipPlan();
    }, []);

    return (
        <section id="pricing" className="pricing-content section-padding pt-3 pb-3">
            <div className="container">
                <div className="section-title text-center">
                    <h2>Subscription Plans</h2>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                </div>
                <div className="row text-center">
                    {
                        price && price.map((plan, index) => (
                            <div key={index} className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp mt-3" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0" style={{ visibility: 'visible', animationDuration: '1s', animationDelay: '0.1s', animationName: 'fadeInUp' }}>
                                <div className="pricing_design">
                                    <div className="single-pricing">
                                        <div className="price-head">
                                            <h2>{plan.name}</h2>
                                            <h1>₹{plan.price}</h1>
                                            <span>/Monthly</span>
                                        </div>
                                        <ul>
                                            {
                                                plan.offer.map((offer, index) => (
                                                    <li key={index}>{offer.name}</li>
                                                ))
                                            }
                                        </ul>
                                        <a
                                            onClick={() => handleSubmit(vendorId, plan._id, plan.price)} // Pass vendorId and plan._id
                                            className="price_btn"
                                            style={{ cursor: 'pointer' }} // Make the button look clickable
                                        >
                                            Become a Member
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
}

export default MemberShipPlan;
