import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';

function AllUserDetail() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchUserDetail = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:7000/api/v1/AllUser');
            const datasave = res.data.data;
            const r = datasave.reverse();
            setUsers(r);
        } catch (error) {
            toast.error('An error occurred while fetching User data.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetail();
    }, []);

    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = users.slice(indexOfFirstVoucher, indexOfLastVoucher);

    // Handle updating the UserType
    const handleUserTypeChange = async (userId, newUserType) => {
        try {
            await axios.put(`http://localhost:7000/api/v1/update-user-type/${userId}`, { UserType: newUserType });
            toast.success('User type updated successfully!');
            fetchUserDetail(); // Refetch the user details to update the table
        } catch (error) {
            toast.error('Failed to update user type.');
            console.error('Update error:', error);
        }
    };

    const headers = ['S.No', 'Name', 'Phone Number', 'Email', 'Role', 'Type of user', 'Created At'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Users'} subHeading={'Users'} LastHeading={'All Users'} backLink={'/users/all-users'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{category.FullName}</td>
                            <td className='fw-bolder'>{category.ContactNumber || "Not-Available"}</td>
                            <td className='fw-bolder'>{category.Email || "Not-Available"}</td>
                            <td className='fw-bolder'>{category.Role || "Not-Available"}</td>

                            {/* Dropdown for updating UserType */}
                            <td>

                                <select
                                    value={category.UserType || 'Normal'}
                                    onChange={(e) => handleUserTypeChange(category._id, e.target.value)}
                                    className="form-select"
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="Corporate">Corporate</option>
                                </select>


                                {/* <select
                                    value={category.UserType || 'Normal'}
                                    onChange={(e) => handleUserTypeChange(category._id, e.target.value)}
                                    className="form-select"
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="Corporate">Corporate</option>
                                </select> */}
                            </td>

                            <td>{new Date(category.createdAt).toLocaleString() || "Not-Available"}</td>

                            {/* <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/service/edit-category/${category._id}`}>
                                        <svg><use href="../assets/svg/icon-sprite.svg#edit-content"></use></svg>
                                    </Link>
                                    <svg onClick={() => handleDelete(category._id)} style={{ cursor: 'pointer' }}>
                                        <use href="../assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg>
                                </div>
                            </td> */}
                        </tr>
                    ))}
                    productLength={users.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href=""
                    text="Add User"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    );
}

export default AllUserDetail;
