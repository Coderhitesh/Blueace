import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllMarquee() {
    const [marquees, setMarquees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchMarqueeData = async() => {
        setLoading(true)
        try {
            const res = await axios.get('https://api.blueace.co.in/api/v1/get-all-marquee')
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

    useEffect(()=>{
        fetchMarqueeData();
    },[])

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://api.blueace.co.in/api/v1/delete-marquee/${id}`);
            if (response.data.success) {
                toast.success('Marquee deleted successfully!');
                await fetchMarqueeData(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete Marquee');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the Marquee.');
        }
    };

    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = marquees.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const headers = ['S.No', 'Marquee' , 'Created At', 'Action'];

  return (
    <div className='page-body'>
            <Breadcrumb heading={'Marquee'} subHeading={'Home Layout'} LastHeading={'All Marquee'} backLink={'/home-layout/all-marquee'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{category.text || "Not-Availdable"}</td>
                            
                            <td>{new Date(category.createdAt).toLocaleString() || "Not-Availdable"}</td>

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/home-layout/edit-marquee/${category._id}`}>
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
                    href="/home-layout/add-marquee"
                    text="Add Marquee"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
  )
}

export default AllMarquee
