import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AllErrorCode = () => {
    const [errorCodes, setErrorCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchErrorCodeData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-error-code');
            if (res.data.success) {
                const data = res.data.data;
                setErrorCodes(data.reverse());
            } else {
                toast.error('Failed to fetch Error Codes');
            }
        } catch (error) {
            toast.error('An error occurred while fetching Error Codes.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchErrorCodeData();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-error-code/${id}`);
            if (response.data.success) {
                toast.success('Error Code deleted successfully!');
                await fetchErrorCodeData(); // Fetch the list of error codes again after deletion
            } else {
                toast.error('Failed to delete Error Code');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the Error Code.');
        }
    };

    const indexOfLastErrorCode = currentPage * productsPerPage;
    const indexOfFirstErrorCode = indexOfLastErrorCode - productsPerPage;
    const currentErrorCodes = errorCodes.slice(indexOfFirstErrorCode, indexOfLastErrorCode);

    const headers = ['S.No', 'Heading', 'Code', 'Description', 'Notes', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'All Error Codes'} subHeading={'All Error Codes'} LastHeading={'All Error Codes'} backLink={'/Error-Code/all-error'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentErrorCodes.map((errorCode, index) => (
                        <tr key={errorCode._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{errorCode?.Heading?.title || "Not Available"}</td>
                            <td className='fw-bolder'>{errorCode.code || "Not Available"}</td>
                            <td className='fw-bolder'>{errorCode.description || "Not Available"}</td>
                            <td className='fw-bolder'>
                                {errorCode.note && errorCode.note.length > 0 ? errorCode.note.join(', ') : "Not Available"}
                            </td>
                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/error-Code/edit-error/${errorCode._id}`}>
                                        <i className="ri-pencil-fill"></i>
                                    </Link>
                                    {/* <svg onClick={() => handleDelete(errorCode._id)} style={{ cursor: 'pointer' }}>
                                        <use href="/assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg> */}

                                    <i onClick={() => handleDelete(errorCode._id)} className="ri-delete-bin-fill"></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={errorCodes.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/Error-Code/add-error"
                    text="Add Error Code"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    );
};

export default AllErrorCode;
