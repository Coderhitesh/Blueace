import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllFAQContent() {
    const [faq, setFaq] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchFAQData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/get-all-faq-content')
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
            const response = await axios.delete(`https://api.blueaceindia.com/api/v1/delete-faq-content/${id}`);
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

    const headers = ['S.No', 'Question', 'Answer', 'Created At', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'FAQ Content'} subHeading={'Home Layout'} LastHeading={'All FAQ Content'} backLink={'/home-layout/all-faq-content'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{category.question || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{category.answer || "Not-Availdable"}</td>

                            <td>{new Date(category.createdAt).toLocaleString() || "Not-Availdable"}</td>

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/home-layout/edit-faq-content/${category._id}`}>
                                        <i class="ri-pencil-fill"></i>
                                    </Link>
                                    {/* <svg onClick={() => handleDelete(category._id)} style={{ cursor: 'pointer' }}>
                                        <use href="/assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg> */}
                                    <i onClick={() => handleDelete(category._id)} style={{ cursor: 'pointer' }} class="ri-delete-bin-fill"></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={faq.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/home-layout/add-faq-content"
                    text="Add Service"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    )
}

export default AllFAQContent
