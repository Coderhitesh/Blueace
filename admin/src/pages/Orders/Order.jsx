import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import Toggle from '../../components/Forms/toggle';

function Order() {
    const [allOrders, setAllOrders] = useState([])
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get('https://api.blueace.co.in/api/v1/get-all-order')
            setAllOrders(res.data.data)
            setLoading(false)
        } catch (error) {
            console.log("Internal server error in fetching all orders")
        }
    }

    // Handle order status change
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`https://api.blueace.co.in/api/v1/update-order-status/${orderId}`, { OrderStatus: newStatus });
        
            toast.success('Order status updated successfully')
            fetchAllOrders()
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to update order status", "error");
        }
    };

    useEffect(() => {
        fetchAllOrders()
    }, [])

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://api.blueace.co.in/api/v1/delete-order/${id}`);
            if (response.data.success) {
                toast.success('Order deleted successfully!');
                await fetchAllOrders(); // Fetch vendors again after deletion
            } else {
                toast.error('Failed to delete Order');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the order.');
            console.log(error)

        }
    };


    const indexOfLastVendor = currentPage * productsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - productsPerPage;
    const currentallOrders = allOrders.slice(indexOfFirstVendor, indexOfLastVendor);

    const headers = ['S.No', 'Service Name', 'Service Type', 'User Name', 'User Type', 'Voice Note', 'Select Vendor', 'OrderStatus', 'Delete', 'Created At'];
    return (
        <div className='page-body'>
            <Breadcrumb heading={'Orders'} subHeading={'Orders'} LastHeading={'All Orders'} backLink={'/Orders/all-order'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Table
                        headers={headers}
                        elements={currentallOrders.map((vendor, index) => (
                            <tr key={vendor._id}>
                                <td>{index + 1}</td>
                                <td className='fw-bolder'>{vendor?.serviceId?.name}</td>
                                <td className='fw-bolder'>{vendor?.serviceType}</td>
                                <td className='fw-bolder'>{vendor?.userId?.FullName || "Not-Available"}</td>
                                <td className='fw-bolder'>{vendor?.userId?.UserType || "Not-Available"}</td>
                                <td className='fw-bolder'>
                                    {vendor.voiceNote ? (
                                        <audio style={{width:'200px'}} controls>
                                            <source src={vendor.voiceNote.url} type="audio/webm" />

                                        </audio>
                                    ) : 'No voice note'}
                                </td>
                                {/* <td className='fw-bolder'>{vendor?.userId?.UserType || "Not-Available"}</td> */}
                                

                              
                                <td style={{whiteSpace:'nowrap'}}>
                                    {vendor.VendorAllotedStatus ? (
                                        <a href={`/Alloted/${vendor._id}?type=change-vendor`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                            Change vendor
                                        </a>
                                    ) : (
                                        <a href={`/Alloted/${vendor._id}`} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                            Allot Vendor
                                        </a>
                                    )}

                                </td>
                                <td className='fw-bolder'>{vendor?.OrderStatus || "Not-Available"}</td>
                                <td>
                                    <button onClick={() => handleDelete(vendor._id)} className="btn btn-danger btn-activity-danger rounded-pill px-4 py-2 shadow-sm">
                                        Delete
                                    </button>
                                </td>
                                <td>{new Date(vendor.createdAt).toLocaleString() || "Not-Available"}</td>
                            </tr>
                        ))}
                        productLength={allOrders.length}
                        productsPerPage={productsPerPage}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                        href=""
                        text=""
                        errorMsg=""
                        handleOpen={() => { }}
                    />
                
                </>
            )}
        </div>
    )
}

export default Order
