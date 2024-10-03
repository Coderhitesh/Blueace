import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import Toggle from '../../components/Forms/toggle';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
const ManagaeService = () => {
    const [service, setService] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Fetch vouchers using Axios
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/v1/Doctors/Get-Services');
                if (response.data.success) {
                    setService(response.data.data);
                    console.log(response.data)
                } else {
                    setErrorMsg('Failed to fetch vouchers');
                }
            } catch (error) {
                setErrorMsg('An error occurred while fetching vouchers.');
            } finally {
                setLoading(false); // Stop loading regardless of success or error
            }
        };

        fetchVouchers();
    }, []);


    // Handle deleting a voucher
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:7000/api/v1/Doctors/Delete-Service/${id}`);
            if (response.data.success) {
                // Remove the deleted voucher from the local state
                setService((prevVouchers) => prevVouchers.filter((voucher) => voucher._id !== id));
                toast.success('Voucher deleted successfully!');
            } else {
                toast.error('Failed to delete voucher');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the voucher.');
        }
    };

    // Calculate the indices of the vouchers to display
    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = service.slice(indexOfFirstVoucher, indexOfLastVoucher);

    // Define headers for the Table component
    const headers = ['S.No', 'Images', 'Service Name', 'Price', 'Discount Percentage', 'Discount Price', 'Categorey', 'Active', 'Created At', 'Action'];



    return (
        <div className='page-body'>
            <Breadcrumb heading={'Services'} subHeading={'Services'} LastHeading={'All Services'} />
            {loading ? (
                <div>Loading...</div>
            ) : errorMsg ? (
                <div>{errorMsg}</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((service, index) => (
                        <tr key={service._id}>
                            <td>{index + 1}</td>
                            <td className='text-danger fw-bolder'><img src={service?.Images?.[0].url} width={50} alt="" /></td>
                            <td className='fw-bolder'>{service.ServiceName || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{service.Price || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{service.DiscountPercentage || "Not-Availdable"}</td>

                            <td className='fw-bolder'>{service.DiscountPrice || "Not-Availdable"}</td>

                            <td className='fw-bolder'>{service.ServiceCategorey?.CategoryTitle || "Not-Availdable"}</td>
                            <td className='fw-bolder'>{service.ServiceState ? "Active" : "in Active" || "Not-Availdable"}</td>



                            <td>{new Date(service.createdAt).toLocaleString()}</td>
                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/Service/edit?id=${service._id}`}>
                                        <svg><use href="../assets/svg/icon-sprite.svg#edit-content"></use></svg>
                                    </Link>
                                    <svg onClick={() => handleDelete(service._id)} style={{ cursor: 'pointer' }}>
                                        <use href="../assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={service.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/Service/create"
                    text="Add Service"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    )
}

export default ManagaeService
