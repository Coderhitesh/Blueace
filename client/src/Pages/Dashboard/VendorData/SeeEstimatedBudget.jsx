import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
const SeeEstimatedBudget = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const orderId = queryParams.get('OrderId');
    const vendorId = queryParams.get('vendor');
    const estimateParam = queryParams.get('Estimate');

    const [estimatedBill, setEstimatedBill] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Parse the estimate parameter if it exists
        const parsedEstimate = estimateParam ? JSON.parse(decodeURIComponent(estimateParam)) : null;
        if (parsedEstimate) {
            setEstimatedBill(parsedEstimate);
        } else {
            setError('No estimated bill found.');
            setLoading(false);
            return;
        }
        setLoading(false);
    }, [estimateParam]);

    const handleApprove = async () => {
        try {
            const response = await axios.put(`https://www.api.blueaceindia.com/api/v1/update-status-bills/${estimatedBill._id}`, {
                status: true
            });
            if (response.status === 200) {
                toast.success('Bill approved successfully! Please Wait Our Vendor Call You Shortly');
            }
        } catch (error) {
            toast.error(error.response.data.message);
            setError(error.response.data.message);
            console.error(error);
        }
    };

    const handleDecline = async () => {
        try {
            const response = await axios.put(`https://www.api.blueaceindia.com/api/v1/update-order-status/${estimatedBill._id}`, {
                status: false
            });
            if (response.status === 200) {
                toast.success('Bill declined successfully! Please Wait Our Vendor Call You Shortly for further discussion');
            }
        } catch (error) {
            toast.error(error.response.data.message);
            setError(error.response.data.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }



    return (
        <div className='container mx-auto my-5 py-5 px-3'>
            {error ?
                (
                    <div className="alert alert-danger">{error}</div>

                ) : null}
            <h2 className="text-center mb-4">Estimated Bill Details</h2>
            <hr />
            <h5>Order ID: <span className="text-muted">{orderId}</span></h5>
            <h5>Vendor ID: <span className="text-muted">{vendorId}</span></h5>
            <h4 className="mt-4">Items:</h4>
            <ul className="list-group mb-4">
                {estimatedBill.Items.map((item, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{item.name}</strong>
                            <div>Quantity: {item.quantity}</div>
                        </div>
                        <div>
                            Price: Rs {item.price} <br />
                            Discount: {item.Discount}%
                        </div>
                    </li>
                ))}
            </ul>
            <h5 className="text-end">Total Estimated Price (including GST): <span className="text-success">Rs {estimatedBill.EstimatedTotalPrice.toFixed(2)}</span></h5>

            <div className="d-flex justify-content-center mt-4">
                <button onClick={handleApprove} className='btn btn-success me-2 w-50'>
                    Approve Bill
                </button>
                <button onClick={handleDecline} className='btn btn-danger w-50'>
                    Decline Bill
                </button>
            </div>
        </div>
    );
};

export default SeeEstimatedBudget
