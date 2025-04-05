import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllCareer() {
    const [marquees, setMarquees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchMarqueeData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('http://localhost:7987/api/v1/careers')
            if (res.data.success) {
                // console.log('data',res.data.data)
                const datasave = res.data.data;
                const r = datasave.reverse();
                setMarquees(r);
            } else {
                toast.error('Failed to fetch Career listing');
            }
        } catch (error) {
            toast.error('An error occurred while fetching Career listing.');
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
            const response = await axios.delete(`http://localhost:7987/api/v1/careers/${id}`);
            if (response.data.success) {
                toast.success('Carrer deleted successfully!');
                await fetchMarqueeData(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete Carrer');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the Carrer.');
        }
    };

    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = marquees.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const headers = ['S.No', 'Title', 'No. of Vacancy', 'Description', 'Points', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Career'} subHeading={'Career'} LastHeading={'All Career'} backLink={'/career/all-career'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((item, index) => (
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{item.title || "Not-Available"}</td>
                            <td className='fw-bolder'>{item.noOfVacancy || "Not-Available"}</td>
                            <td className='fw-bolder'>{`${item.description}` || "Not-Avail  able"}</td>
                            {
                                item.points.map((ptn,index)=>(
                                    <td key={index} style={{display:"flex",flexDirection:'column',paddingTop:'0px',paddingBottom:'3px'}} className='fw-bolder'><span>{`${ptn},` || "Not-Availdable"}</span></td>
                                ))
                            }



                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/career/edit-career/${item._id}`}>
                                        <i class="ri-pencil-fill"></i>
                                    </Link>
                                    {/* <svg onClick={() => handleDelete(item._id)} style={{ cursor: 'pointer' }}>
                                        <use href="/assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg> */}
                                    <i onClick={() => handleDelete(item._id)} style={{ cursor: 'pointer' }} class="ri-delete-bin-fill"></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={marquees.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/career/add-career"
                    text="Add Job"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    )
}

export default AllCareer
