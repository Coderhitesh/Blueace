import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllGalleryName() {
    const [faq, setFaq] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchFAQData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:7987/api/v1/get-all-gallery-category-name')
            if (res.data.success) {
                // console.log('data',res.data.data)
                const datasave = res.data.data;
                const r = datasave.reverse();
                setFaq(r);
            } else {
                toast.error('Failed to fetch Gallery content');
            }
        } catch (error) {
            toast.error('An error occurred while fetching Gallery content.');
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
            const response = await axios.delete(`http://localhost:7987/api/v1/delete-gallery-category-name/${id}`);
            if (response.data.success) {
                toast.success('Gallery Title deleted successfully!');
                await fetchFAQData(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete Gallery title');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the gallery title.');
        }
    };

    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = faq.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const headers = ['S.No', 'Gallery Title', 'Action'];

  return (
    <div className='page-body'>
            <Breadcrumb heading={'Gallery Title'} subHeading={'Home Layout'} LastHeading={'All Gallery Title'} backLink={'/home-layout/all-gallery-title'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{category.name || "Not-Availdable"}</td>
                            
                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/home-layout/Edit-gallery-title/${category._id}`}>
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
                    href="/home-layout/add-gallery-title"
                    text="Add Gallery Title"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
  )
}

export default AllGalleryName
