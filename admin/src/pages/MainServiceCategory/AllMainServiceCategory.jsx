import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import Toggle from '../../components/Forms/toggle';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllMainServiceCategory() {
    const [category, setCategory] = useState([]);
    // const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const handleFetchCategory = async() => {
        setLoading(true)
        try {
            const res = await axios.get('https://api.blueace.co.in/api/v1/get-all-service-main-category')
            setCategory(res.data.data)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        handleFetchCategory();
    },[])

    // Handle deleting a category
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://api.blueace.co.in/api/v1/delete-service-main-category/${id}`);
            if (response.data.success) {
                toast.success('Category deleted successfully!');
                await handleFetchCategory(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete Category');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the Category.');
        }
    };

      // Calculate the indices of the vouchers to display
      const indexOfLastVoucher = currentPage * productsPerPage;
      const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
      const currentServices = category.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const headers = ['S.No', 'Category name', 'Meta Title', 'Meta Description', 'Created At', 'Action'];
  return (
    <div className='page-body'>
            <Breadcrumb heading={'Category'} subHeading={'Services'} LastHeading={'All Category'} backLink={'/service/main-category'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className=' fw-bolder'>{category.name || "Not-Available"}</td>
                            <td className=' fw-bolder'>{category.metaTitle ? category.metaTitle.substring(0, 14) + '....' : "Not-Available"}</td>
                            <td className=' fw-bolder'>{category.metaDescription ? category.metaDescription.substring(0, 14) + '....' : "Not-Available"}</td>
                            
                            <td>{new Date(category.createdAt).toLocaleString() || "Not-Available"}</td>

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/service/edit-main-category/${category._id}`}>
                                        <svg><use href="../assets/svg/icon-sprite.svg#edit-content"></use></svg>
                                    </Link>
                                    <svg onClick={() => handleDelete(category._id)} style={{ cursor: 'pointer' }}>
                                        <use href="../assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={category.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/service/Add-main-category"
                    text="Add Category"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
  )
}

export default AllMainServiceCategory
