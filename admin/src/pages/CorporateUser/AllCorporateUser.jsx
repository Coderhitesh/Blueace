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
    const [filterAddress, setFilterAddress] = useState("");  // New state for address filter
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showFilter, setShowFilter] = useState(false);

    const fetchUserDetail = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://api.blueaceindia.com/api/v1/AllUser');
            const datasave = res.data.data;
            const filterdata = datasave.filter((item) => item.UserType === "Corporate");
            const r = filterdata.reverse();
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

    // Filter users based on Email, Phone Number, Address, and Date Range
    const filteredUsers = users.filter((user) => {
        const emailMatch = user.Email && user.Email.toLowerCase().includes(filterEmail.toLowerCase());
        const phoneNumberMatch = user.ContactNumber && user.ContactNumber.includes(filterPhoneNumber);
        const companyNameMatch = user.companyName && user.companyName.toLowerCase().includes(filterCompanyName);
        const addressMatch = user.address && user.address.toLowerCase().includes(filterAddress.toLowerCase()); // Address filter logic

        const userDate = new Date(user.createdAt);
        const startDateMatch = startDate ? userDate >= new Date(startDate) : true;
        const endDateMatch = endDate ? userDate <= new Date(endDate) : true;

        return emailMatch && phoneNumberMatch && companyNameMatch && addressMatch && startDateMatch && endDateMatch;
    });

    const currentServices = filteredUsers.slice(indexOfFirstVoucher, indexOfLastVoucher);

    // Handle updating the UserType
    const handleUserTypeChange = async (userId, newUserType) => {
        try {
            await axios.put(`https://api.blueaceindia.com/api/v1/update-user-type/${userId}`, { UserType: newUserType });
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
            const response = await axios.put(`https://api.blueaceindia.com/api/v1/update-user-deactive-status/${id}`, {
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
            const response = await axios.delete(`https://api.blueaceindia.com/api/v1/delete-user/${id}`);
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

    const headers = ['S.No', 'Company Name', 'Name', 'Phone Number', 'Email', 'Address', 'Deactive', 'Created At', "Action"];

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
                                    <label htmlFor="addressFilter" className='form-label'>Search by Address</label>
                                    <input
                                        id="addressFilter"
                                        placeholder='Search by Address'
                                        type="text"
                                        className="form-control mb-2"
                                        value={filterAddress}
                                        onChange={(e) => setFilterAddress(e.target.value)}
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
                                <td className='fw-bolder'>{`${category.HouseNo}, ${category.address}, ${category.PinCode}` || "Not-Available"}</td>
                                <td>
                                    <Toggle
                                        isActive={category.isDeactive}
                                        onToggle={() => handleToggle(category._id, category.isDeactive)} // Pass vendor id and current active status
                                    />
                                </td>
                                <td>{new Date(category.createdAt).toLocaleString() || "Not-Available"}</td>
                                {/* <td className='fw-bolder'>
                                    <div className="product-action">
                                        <svg onClick={() => handleUserTypeChange(category._id, "Admin")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="bi bi-person-check" width="20" height="20">
                                            <path d="M14 7c.553 0 1-.447 1-1V4a1 1 0 0 0-1-1h-1V2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1H3V2a1 1 0 0 0-1-1H0a1 1 0 0 0-1 1v1H0a1 1 0 0 0-1 1v2c0 .553.447 1 1 1h1v2c0 .553.447 1 1 1h2v2c0 .553.447 1 1 1h2v2c0 .553.447 1 1 1h2v2c0 .553.447 1 1 1h1c.553 0 1-.447 1-1v-2c0-.553-.447-1-1-1h-1v-2h-2v-2h2zM7 10H6v1H7z"/>
                                        </svg>
                                    </div>
                                </td> */}
                                <td className='fw-bolder'>
                                    <div className="product-action">
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
                        text="Add Corporate"
                        errorMsg=""
                        handleOpen={() => { }}
                        
                    />
                </>
            )}
        </div>
    );
}

export default AllCorporateUser;
