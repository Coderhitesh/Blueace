import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllScript() {
    const [marquees, setMarquees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchMarqueeData = async() => {
        setLoading(true)
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-script')
            if (res.data.success) {
                // console.log('data',res.data.data)
                const datasave = res.data.data;
                const r = datasave.reverse();
                setMarquees(r);
            } else {
                toast.error('Failed to fetch Script');
            }
        } catch (error) {
            toast.error('An error occurred while fetching Script.');
            console.error('Fetch error:', error); 
        } finally {
            setLoading(false); 
        }
    }

    useEffect(()=>{
        fetchMarqueeData();
    },[])

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-script/${id}`);
            if (response.data.success) {
                toast.success('Script deleted successfully!');
                await fetchMarqueeData(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete Script');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the Script.');
        }
    };

    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = marquees.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const headers = ['S.No', 'Head Script', 'Body Script', 'Footer Script' , 'Created At', 'Action'];

  return (
    <div className='page-body'>
            <Breadcrumb heading={'All Script'} subHeading={'Home Layout'} LastHeading={'All Script'} backLink={'/all-script'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{category.headScript || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{category.bodyScript || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{category.footerScript || "Not-Availdable"}</td>
                            
                            <td>{new Date(category.createdAt).toLocaleString() || "Not-Availdable"}</td>

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/edit-script/${category._id}`}>
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
                    href="/add-script"
                    text="Add Script"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
  )
}

export default AllScript
