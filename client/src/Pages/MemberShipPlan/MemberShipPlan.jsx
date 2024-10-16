import React, { useEffect, useState } from 'react';
import './membership.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import razerPay from 'razorpay'

function MemberShipPlan() {
    const { vendorId } = useParams(); // Extract vendorId from URL parameters
    const [price, setPrice] = useState([]); // State to hold the membership plans

    // Fetch all membership plans
    const fetchMemberShipPlan = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/get-all-membership-plan');
            setPrice(res.data.data); // Set membership plans to state
        } catch (error) {
            console.log(error);
        }
    };

    // Handle submission of selected membership plan for a vendor
    const handleSubmit = async (vendorId, planId) => {
        try {
            const { data } = await axios.post(`http://localhost:7000/api/v1/member-ship-plan/${vendorId}`, {
                memberShipPlan: planId
            });
            const order = data.data.razorpayOrder;

            const options = {
                key: 'rzp_test_cz0vBQnDwFMthJ', // Replace with your Razorpay key_id
                amount: '50000', // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: 'INR',
                name: 'Acme Corp',
                description: 'Test Transaction',
                order_id: order.id, // This is the order_id created in the backend
                callback_url: 'http://localhost:3000/payment-success', // Your success URL
                prefill: {
                    name: 'Gaurav Kumar',
                    email: 'gaurav.kumar@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#F37254'
                },
            };

            const rzp = new razerPay(options);
            rzp.open();

            // console.log(object)
            console.log('Successfully purchased membership plan:', res.data);
        } catch (error) {
            console.log('Internal server error in buying membership plan', error);
        }
    };

    // Fetch membership plans on component mount
    useEffect(() => {
        fetchMemberShipPlan();
    }, []);

    return (
        <section id="pricing" className="pricing-content section-padding">
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
                                            onClick={() => handleSubmit(vendorId, plan._id)} // Pass vendorId and plan._id
                                            className="price_btn"
                                            style={{ cursor: 'pointer' }} // Make the button look clickable
                                        >
                                            Order Now
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
