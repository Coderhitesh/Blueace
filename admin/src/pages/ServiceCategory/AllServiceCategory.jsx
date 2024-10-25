import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import Toggle from '../../components/Forms/toggle';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllServiceCategory() {
    const [category, setCategory] = useState([]);
    // const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchVouchers = async () => {
        setLoading(true); // Set loading state before fetching
        try {
            const response = await axios.get('http://localhost:7000/api/v1/get-all-service-category');
            if (response.data.success) {
                // console.log('data',response.data.data)
                const datasave = response.data.data;
                const r = datasave.reverse();
                setCategory(r);
                console.log(response.data.data);
            } else {
                toast.error('Failed to fetch service category');
            }
        } catch (error) {
            toast.error('An error occurred while fetching service category.');
            console.error('Fetch error:', error); // Logging error for debugging
        } finally {
            setLoading(false); // Stop loading regardless of success or error
        }
    };
    // Fetch vouchers using Axios
    useEffect(() => {
        fetchVouchers();
    }, []);


    // Handle deleting a category
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:7000/api/v1/delete-service-category/${id}`);
            if (response.data.success) {
                toast.success('Category deleted successfully!');
                await fetchVouchers(); // Fetch categories again after deletion
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

    // Define headers for the Table component
    const headers = ['S.No', 'Icon', 'Category', 'Sub Category', 'Discription', 'Slider Image', 'Meta Title', 'Meta Description', 'Created At', 'Action'];


    return (
        <div className='page-body'>
            <Breadcrumb heading={'Sub Category'} subHeading={'Services'} LastHeading={'All Sub Category'} backLink={'/service/category'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='text-danger fw-bolder'><img src={category?.icon?.url} width={50} alt="" /></td>
                            <td className='fw-bolder'>{category.mainCategoryId?.name || "Not-Available"}</td>
                            <td className='fw-bolder'>{category.name || "Not-Availdable"}</td>
                            <td className='fw-bolder'>
                                {category.description
                                    ? category.description.substring(0, 14) + '....'
                                    : "Not-Available"}
                            </td>

                            {
                                Array.isArray(category.sliderImage) ? (
                                    category.sliderImage.map((item, index) => (
                                        <img key={index} src={item?.url} width={50} alt={`Image ${index}`} />
                                    ))
                                ) : (
                                    <img src={category?.sliderImage?.url} width={50} alt="Single Slider" />
                                )
                            }
                            
                            <td className=' fw-bolder'>{category.metaTitle ? category.metaTitle.substring(0, 14) + '....' : "Not-Available"}</td>
                            <td className=' fw-bolder'>{category.metaDescription ? category.metaDescription.substring(0, 14) + '....' : "Not-Available"}</td>
                            <td>{new Date(category.createdAt).toLocaleString() || "Not-Availdable"}</td>

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/service/edit-category/${category._id}`}>
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
                    href="/service/Add-category"
                    text="Add Sub Category"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    )
}

export default AllServiceCategory
