import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllMemberShipPlan() {
    const [memberShipPlan, setMemberShipPlan] = useState([])
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchMemberShipPlan = async (req, res) => {
        setLoading(true)
        try {
            const res = await axios.get('http://localhost:7987/api/v1/get-all-membership-plan')
            const datasave = res.data.data;
            const r = datasave.reverse();
            setMemberShipPlan(r)
        } catch (error) {
            console.log(error)
            toast.error('Internal server error in fetching membership plan')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMemberShipPlan();
    }, [])

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:7987/api/v1/delete-membership-plan/${id}`);
            if (response.data.success) {
                toast.success('Membership plan deleted successfully!');
                await fetchMemberShipPlan(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete Membership plan');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the membership plan.');
        }
    };

    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = memberShipPlan.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const headers = ['S.No', 'Title', 'Price', 'Offers', 'Created At', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'All MemberShip Plan'} subHeading={'Vendor'} LastHeading={'All MemberShip Plan'} backLink={'/vendors/all-membership-plan'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{category.name || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{category.price || "0"}</td>
                            <td className='fw-bolder'>
                                <div className="row">
                                    {
                                        category.offer && category.offer.map((offer, index) => (
                                            <p key={index}>{offer.name}</p>
                                        ))
                                    }
                                </div>
                            </td>

                            <td>{new Date(category.createdAt).toLocaleString() || "Not-Availdable"}</td>

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/vendors/edit-membership-plan/${category._id}`}>
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
                    productLength={memberShipPlan.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/vendors/add-membership-plan"
                    text="Add Membership Plan"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    );

};

export default AllMemberShipPlan
