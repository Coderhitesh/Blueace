import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './vendorCss.css';
import verifiedImage from './verifiedImage.png';


function VendorDashboard({ userId, readyToWork, handleChangeReadyToWork, }) {
    const userDataString = sessionStorage.getItem('user');
    const userDataJson = userDataString ? JSON.parse(userDataString) : null;
    // const [userId, setUserId] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [activeOrder, setActiveOrder] = useState([]);
    const [allOrder, setAllOrder] = useState([]);
    const [allCompleteOrderCount, setCompleteOrder] = useState([]);
    const [walletAmount, setWalletAmount] = useState(0);
    const [isVerified, setIsVerify] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({})

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    useEffect(() => {
        // if (userData?.walletAmount !== undefined) {
        //     setWalletAmount(userData.walletAmount);
        // }
        // if (userData?.verifyed !== undefined) {
        //     setIsVerify(userData.verifyed);
        // }
        // if (userData !== undefined) {
        //     setUserId(userData._id);
        // }
    }, []);

    const handleFetchVendor = async () => {
        setLoading(true)
        // setUserId(userDataJson._id);

        try {
            const res = await axios.get(`http://localhost:7987/api/v1/findUser/${userId}`)
            setUserData(res.data.data)
            const allData = res.data.data
            setWalletAmount(Math.round(allData?.walletAmount || 0));
            setIsVerify(allData?.verifyed);
            setLoading(false)
        } catch (error) {
            console.log("Internal server error", error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!userId) return;
        setLoading(true)
        const fetchOrderById = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7987/api/v1/get-order-by-id?vendorAlloted=${userId}`
                );
                const allData = res.data.data;
                const isAccepted = allData.filter(
                    (item) => item.VendorAllotedStatus === 'Accepted'
                );
                setAllOrder(isAccepted);
                setActiveOrder(isAccepted.filter(
                    (item) => item.OrderStatus !== 'Service Done' && item.OrderStatus !== 'Cancelled'
                ));
                setCompleteOrder(isAccepted.filter(
                    (item) => item.OrderStatus === 'Service Done'
                ));
                setLoading(false)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        };
        fetchOrderById();
    }, [userId]);

    useEffect(()=>{
        handleFetchVendor()
    },[])

    const handleWithdraw = async () => {
        try {
            const { data } = await axios.post(
                'http://localhost:7987/api/v1/create-withdraw-request',
                { vendor: userId, amount: withdrawAmount },
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
            );
            toast.success(data.message || 'Withdraw request created successfully!');
            setShowModal(false);
        } catch (error) {
            toast.error(
                error.response?.data.message || 'Failed to create withdraw request.'
            );
        }
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])
    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <>
            <div className="goodup-dashboard-content">
                <div className="dashboard-tlbar d-block mb-5">
                    <div className="row">
                        <div className="col-xl-9 col-lg-9 col-md-12">
                            <h1 className="ft-medium">{userData.companyName}</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item text-muted"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#" className="theme-cl">Dashboard</a></li>
                                </ol>
                            </nav>
                        </div>
                        {/* {
                            role === 'vendor' && ( */}
                        <div className="col-xl-3 col-lg-3 col-md-12">
                            <div className="row">
                                <div className="col-xl-12 mb-2 col-lg-12 col-md-12 d-flex g-2">
                                    <div className=' col-xl-6 d-flex align-items-center justify-content-center'>
                                        <button
                                            className="btn btn-outline-success"
                                            style={{ width: '100%', height: '40px' }}
                                            onClick={() => setShowModal(true)}
                                        >
                                            Withdraw
                                        </button>
                                    </div>
                                    <div className=' col-xl-6 d-flex justify-content-center'>
                                        {
                                            isVerified && (
                                                <img style={{ width: "80px" }} src={verifiedImage} alt={userData.companyName} />
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="col-xl-12 col-lg-12 col-md-12">
                                    <label className="ready-to-work-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={readyToWork}
                                            onChange={handleChangeReadyToWork}
                                        />
                                        <span className="checkbox-text">Ready to Work</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* )
                        }  */}


                    </div>
                </div>

                <div className="dashboard-widg-bar d-block">

                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-danger rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{userId ? activeOrder.length || 0 : 0}</h2>
                                <p className="p-0 m-0 text-light fs-md">Active Orders</p>
                                <i className="lni lni-empty-file"></i>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-success rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{userId ? allOrder.length || 0 : 0}</h2>
                                <p className="p-0 m-0 text-light fs-md">All Orders</p>
                                <i className="lni lni-eye"></i>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-warning rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">{userId ? allCompleteOrderCount.length || 0 : 0}</h2>
                                <p className="p-0 m-0 text-light fs-md">Complete Orders</p>
                                <i className="lni lni-comments"></i>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="dsd-boxed-widget py-5 px-4 bg-purple rounded">
                                <h2 className="ft-medium mb-1 fs-xl text-light count">₹{userId ? walletAmount : 0}</h2>
                                <p className="p-0 m-0 text-light fs-md">Wallet Amount</p>
                                <i className="lni lni-wallet"></i>
                            </div>
                        </div>
                    </div>


                </div>

            </div>

            {/* Modal for Withdraw */}
            {showModal && (
                <div className="withdraw-modal-hitesh">
                    <div className="modal-content">
                        <h2>Withdraw Amount</h2>
                        <p>Select or enter the amount to withdraw:</p>
                        <div className="amount-options">
                            {[500, 1000, 2000].map((amount) => (
                                <button
                                    key={amount}
                                    className="btn btn-secondary"
                                    onClick={() => setWithdrawAmount(amount)}
                                >
                                    ₹{amount}
                                </button>
                            ))}
                        </div>
                        <div className="input-group mt-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter custom amount"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-primary for-withdraw mt-3"
                            onClick={handleWithdraw}
                            disabled={!withdrawAmount}
                        >
                            Withdraw
                        </button>
                        <button
                            className="btn btn-danger for-withdraw mt-2"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default VendorDashboard