import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllCommission() {
    const [marquees, setMarquees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchMarqueeData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-commission')
            if (res.data.success) {
                // console.log('data',res.data.data)
                const datasave = res.data.data;
                const r = datasave.reverse();
                setMarquees(r);
            } else {
                toast.error('Failed to fetch marquee');
            }
        } catch (error) {
            toast.error('An error occurred while fetching marquee.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMarqueeData();
    }, [])

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-commission/${id}`);
            if (response.data.success) {
                toast.success('Commission deleted successfully!');
                await fetchMarqueeData(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete Commission');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the Commission.');
        }
    };

    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = marquees.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const headers = ['S.No', 'Name', 'Commission %', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Commission'} subHeading={'Commission'} LastHeading={'All Commission'} backLink={'/commission/all-commission'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{category.name || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{`${category.percent}%` || "Not-Availdable"}</td>

                           

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/commission/edit-commission/${category._id}`}>
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
                    productLength={marquees.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/commission/add-commission"
                    text="Add Commission"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    )
}

export default AllCommission
