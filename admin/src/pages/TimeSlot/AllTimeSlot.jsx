import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function AllTimeSlot() {
    const [faq, setFaq] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchFAQData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:7987/api/v1/get-all-timing')
            // if (res.data.success) {
                // console.log('data',res.data.data)
                const datasave = res.data.data;
                setFaq(datasave);
                // const r = datasave.reverse();
                // setFaq(r);
            // } else {
            //     toast.error('Failed to Time slot:');
            // }
        } catch (error) {
            toast.error('No Time Slot is Found');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFAQData();
    }, [])

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:7987/api/v1/delete-timing/${id}`);
            if (response.data.success) {
                toast.success('Time Slot deleted successfully!');
                await fetchFAQData(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete Time Slot');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the Time Slot.');
        }
    };

    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = faq.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const headers = ['S.No', 'Time', 'Action'];
    return (
        <div className='page-body'>
            <Breadcrumb heading={'All Timing'} subHeading={'Vendors'} LastHeading={'All Timing'} backLink={'/vendors/all-time-slot'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{category.time || "Not-Availdable"}</td>

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/vendors/edit-time-slot/${category._id}`}>
                                        <i class="ri-pencil-fill"></i>
                                    </Link>
                                    {/* <svg onClick={() => handleDelete(category._id)} style={{ cursor: 'pointer' }}>
                                        <use href="/assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg> */}

                                    <i onClick={() => handleDelete(category._id)} class="ri-delete-bin-fill"></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={faq.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/vendors/add-time-slot"
                    text="Add Timing"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    )
}

export default AllTimeSlot
