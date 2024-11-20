import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import Toggle from '../../components/Forms/toggle';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllEnquiry() {
    const [faq, setFaq] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchFAQData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-contact')
            if (res.data.success) {
                // console.log('data',res.data.data)
                const datasave = res.data.data;
                const r = datasave.reverse();
                setFaq(r);
            } else {
                toast.error('Failed to fetch faq content');
            }
        } catch (error) {
            toast.error('An error occurred while fetching faq content.');
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
            const response = await axios.delete(`https://api.blueaceindia.com/api/v1/delete-contact/${id}`);
            if (response.data.success) {
                toast.success('FAQ deleted successfully!');
                await fetchFAQData(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete FAQ');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the FAQ.');
        }
    };

    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = faq.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const headers = ['S.No', 'Name', 'Email', 'Phone No.', 'Subject', 'Message', 'Action'];
    return (
        <div className='page-body'>
            <Breadcrumb heading={'All Enquiry'} subHeading={'All Enquiry'} LastHeading={'All Enquiry'} backLink={'/all-enquiry'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{category.name || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{category.email || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{category.mobile || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{category.subject || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{category.message || "Not-Availdable"}</td>

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    {/* <Link to={`/home-layout/edit-faq-content/${category._id}`}>
                                        <i class="ri-pencil-fill"></i>
                                    </Link> */}
                                    <svg onClick={() => handleDelete(category._id)} style={{ cursor: 'pointer' }}>
                                        <use href="/assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg>

                                    <i onClick={() => handleDelete(category._id)} class="ri-delete-bin-fill"></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={faq.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href=""
                    text=""
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    )
}

export default AllEnquiry
