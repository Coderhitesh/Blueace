import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import Toggle from '../../components/Forms/toggle';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageVouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Fetch vouchers using Axios
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/v1/product/vouchers');
                console.log(response.data)
                if (response.data.success) {
                    setVouchers(response.data.data);
                } else {
                    setErrorMsg('Failed to fetch vouchers');
                }
            } catch (error) {
                setErrorMsg('An error occurred while fetching vouchers.');
            } finally {
                setLoading(false); // Stop loading regardless of success or error
            }
        };

        fetchVouchers();
    }, []);

    // Handle toggling voucher status
    const handleToggleStatus = async (id) => {
        try {
            const response = await axios.get(`http://localhost:7000/api/v1/product/vouchers/toggle/${id}`);
            if (response.data.success) {
                // Update the local state with the toggled voucher
                setVouchers((prevVouchers) =>
                    prevVouchers.map((voucher) =>
                        voucher._id === id ? { ...voucher, Active: !voucher.Active } : voucher
                    )
                );
                toast.success('Voucher status updated successfully!');
            } else {
                toast.error('Failed to toggle voucher status');
            }
        } catch (error) {
            toast.error('An error occurred while toggling voucher status.');
        }
    };

    // Handle deleting a voucher
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:7000/api/v1/product/vouchers/deleteVoucher/${id}`);
            if (response.data.success) {
                // Remove the deleted voucher from the local state
                setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher._id !== id));
                toast.success('Voucher deleted successfully!');
            } else {
                toast.error('Failed to delete voucher');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the voucher.');
        }
    };

    // Calculate the indices of the vouchers to display
    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentVouchers = vouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

    // Define headers for the Table component
    const headers = ['S.No', 'Coupon Code', 'Amount', 'How Much Percentage Of', 'Active', 'Created At', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Vouchers'} subHeading={'Vouchers'} LastHeading={'All Vouchers'} />
            {loading ? (
                <div>Loading...</div>
            ) : errorMsg ? (
                <div>{errorMsg}</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentVouchers.map((voucher, index) => (
                        <tr key={voucher._id}>
                            <td>{index + 1}</td>
                            <td className='text-danger fw-bolder'>{voucher.CouponCode}</td>
                            <td className='fw-bolder'>{voucher.MinimumAmount}</td>
                            <td className='fw-bolder'>{voucher.HowMuchPercentageOf}</td>
                            <td>
                                <Toggle
                                    isActive={voucher.Active}
                                    onToggle={() => handleToggleStatus(voucher._id)}
                                />
                            </td>
                            <td>{new Date(voucher.createdAt).toLocaleString()}</td>
                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/Voucher/edit?id=${voucher._id}`}>
                                        <svg><use href="../assets/svg/icon-sprite.svg#edit-content"></use></svg>
                                    </Link>
                                    <svg onClick={() => handleDelete(voucher._id)} style={{ cursor: 'pointer' }}>
                                        <use href="../assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={vouchers.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/vouchers/create"
                    text="Add Voucher"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    );
};

export default ManageVouchers;
