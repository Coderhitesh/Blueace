import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import Toggle from '../../components/Forms/toggle';

function AllCorporateUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // States for filter inputs
    const [filterEmail, setFilterEmail] = useState("");
    const [filterPhoneNumber, setFilterPhoneNumber] = useState("");
    const [filterCompanyName, setFilterCompanyName] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showFilter, setShowFilter] = useState(false);

    const fetchUserDetail = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/AllUser');
            const datasave = res.data.data;
            const filterdata = datasave.filter((item) => item.UserType === "Corporate")
            const r = filterdata.reverse();
            // console.log("data",r)
            // console.log(object)
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

    // Filter users based on Email, Phone Number, and Date Range
    const filteredUsers = users.filter((user) => {
        const emailMatch = user.Email && user.Email.toLowerCase().includes(filterEmail.toLowerCase());
        const phoneNumberMatch = user.ContactNumber && user.ContactNumber.includes(filterPhoneNumber);
        const companyNameMatch = user.companyName && user.companyName.toLowerCase().includes(filterCompanyName);
    
        const userDate = new Date(user.createdAt);
        const startDateMatch = startDate ? userDate >= new Date(startDate) : true;
        const endDateMatch = endDate ? userDate <= new Date(endDate) : true;
    
        return emailMatch && phoneNumberMatch && startDateMatch && endDateMatch && companyNameMatch;
    });
    

    const currentServices = filteredUsers.slice(indexOfFirstVoucher, indexOfLastVoucher);

    // Handle updating the UserType
    const handleUserTypeChange = async (userId, newUserType) => {
        try {
            await axios.put(`https://www.api.blueaceindia.com/api/v1/update-user-type/${userId}`, { UserType: newUserType });
            toast.success('User type updated successfully!');
            fetchUserDetail(); // Refetch the user details to update the table
        } catch (error) {
            toast.error('Failed to update user type.');
            console.error('Update error:', error);
        }
    };

    const handleToggle = async (id, currentDeactiveStatus) => {
        try {
            const newDeactiveStatus = !currentDeactiveStatus;
            const response = await axios.put(`https://www.api.blueaceindia.com/api/v1/update-user-deactive-status/${id}`, {
                isDeactive: newDeactiveStatus
            })
            if (response.data.success) {
                toast.success('User status updated successfully.');
                await fetchUserDetail();
            } else {
                toast.error('Failed to update User status.');
            }
        } catch (error) {
            toast.error("An error occurred while updating the deactive status")
            console.error("Toggle error:", error)
        }
    }

    // Handle deleting a category
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-user/${id}`);
            if (response.data.success) {
                toast.success('User deleted successfully!');
                await fetchUserDetail(); // Fetch categories again after deletion
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the user.');
        }
    };

    const headers = ['S.No', 'Company Name', 'Name', 'Phone Number', 'Email', 'Deactive', 'Created At', "Action"];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Corporate Users'} subHeading={'Corporate Users'} LastHeading={'All Corporate Users'} backLink={'/corporate-user/all-corporate-user'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {/* Filter UI */}
                    <div className="filter-section mb-4">
                        <button className="btn btn-primary" onClick={() => setShowFilter(!showFilter)}>
                            {showFilter ? "Hide Filter" : "Show Filter"}
                        </button>
                        {showFilter && (
                            <div className="mt-2 row">
                                <div className="col-md-3">
                                    <label htmlFor="emailFilter" className='form-label'>Search by Email</label>
                                    <input
                                        id="emailFilter"
                                        placeholder='Search by Email'
                                        type="text"
                                        className="form-control mb-2"
                                        value={filterEmail}
                                        onChange={(e) => setFilterEmail(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="filterCompanyName" className='form-label'>Search by Company Name</label>
                                    <input
                                        id="filterCompanyName"
                                        placeholder='Search by Company Name'
                                        type="text"
                                        className="form-control mb-2"
                                        value={filterCompanyName}
                                        onChange={(e) => setFilterCompanyName(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="phoneFilter" className='form-label'>Search by Phone Number</label>
                                    <input
                                        id="phoneFilter"
                                        placeholder='Search by Phone Number'
                                        type="text"
                                        className="form-control mb-2"
                                        value={filterPhoneNumber}
                                        onChange={(e) => setFilterPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="startDate" className='form-label'>Start Date</label>
                                    <input
                                        id="startDate"
                                        type="date"
                                        className="form-control mb-2"
                                        value={startDate || ""}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="endDate" className='form-label'>End Date</label>
                                    <input
                                        id="endDate"
                                        type="date"
                                        className="form-control mb-2"
                                        value={endDate || ""}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <Table
                        headers={headers}
                        elements={currentServices.map((category, index) => (
                            <tr key={category._id}>
                                <td>{index + 1}</td>
                                <td className='fw-bolder'>{category.companyName || 'Detail Not Provided'}</td>
                                <td className='fw-bolder'>{category.FullName}</td>
                                <td className='fw-bolder'>{category.ContactNumber || "Not-Available"}</td>
                                <td className='fw-bolder'>{category.Email || "Not-Available"}</td>
                                {/* <td className='fw-bolder'>{category.Role || "Not-Available"}</td> */}

                                {/* Dropdown for updating UserType */}
                                {/* <td>

                                <select
                                    value={category.UserType || 'Normal'}
                                    onChange={(e) => handleUserTypeChange(category._id, e.target.value)}
                                    className="form-select"
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                            </td> */}

                                <td>
                                    <Toggle
                                        isActive={category.isDeactive}
                                        onToggle={() => handleToggle(category._id, category.isDeactive)} // Pass vendor id and current active status
                                    />
                                </td>

                                <td>{new Date(category.createdAt).toLocaleString() || "Not-Available"}</td>

                                <td className='fw-bolder'>
                                    <div className="product-action">
                                        {/* <Link to={`/service/edit-category/${category._id}`}>
                                        <i class="ri-pencil-fill"></i>
                                    </Link> */}
                                        <svg onClick={() => handleDelete(category._id)} style={{ cursor: 'pointer' }}>
                                            <use href="/assets/svg/icon-sprite.svg#trash1"></use>
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        productLength={users.length}
                        productsPerPage={productsPerPage}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                        href="/corporate-user/add-corporate-user"
                        text="Add Corporate User"
                        errorMsg=""
                        handleOpen={() => { }}
                    />
                </>
            )}
        </div>
    );
}

export default AllCorporateUser
