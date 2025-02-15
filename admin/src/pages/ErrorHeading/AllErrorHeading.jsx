import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AllErrorHeading = () => {
    const [errorCodeHeadings, setErrorCodeHeadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchErrorCodeHeadingData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-error-heading');
            if (res.data.success) {
                const data = res.data.data;
                setErrorCodeHeadings(data.reverse()); // Reverse to show the latest at top
            } else {
                toast.error('Failed to fetch Error Code Headings');
            }
        } catch (error) {
            toast.error('An error occurred while fetching Error Code Headings.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchErrorCodeHeadingData();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-error-heading/${id}`);
            if (response.data.success) {
                toast.success('Error Code Heading deleted successfully!');
                await fetchErrorCodeHeadingData(); // Fetch the list of error code headings again after deletion
            } else {
                toast.error('Failed to delete Error Code Heading');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the Error Code Heading.');
        }
    };

    const indexOfLastErrorCode = currentPage * productsPerPage;
    const indexOfFirstErrorCode = indexOfLastErrorCode - productsPerPage;
    const currentErrorCodeHeadings = errorCodeHeadings.slice(indexOfFirstErrorCode, indexOfLastErrorCode);

    const headers = ['S.No', 'Title', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb
                heading={'All Error Code Headings'}
                subHeading={'All Error Code Headings'}
                LastHeading={'All Error Code Headings'}
                backLink={'/error-code-heading/all-error-code-heading'}
            />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentErrorCodeHeadings.map((errorCodeHeading, index) => (
                        <tr key={errorCodeHeading._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{errorCodeHeading.title || "Not Available"}</td>
                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/error-code-heading/edit-error-code-heading/${errorCodeHeading._id}`}>
                                        <i className="ri-pencil-fill"></i>
                                    </Link>

                                    <i onClick={() => handleDelete(errorCodeHeading._id)} className="ri-delete-bin-fill"></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={errorCodeHeadings.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/error-code-heading/add-error-code-heading"
                    text="Add Error Code Heading"
                    errorMsg=""
                    handleOpen={() => {}}
                />
            )}
        </div>
    );
};

export default AllErrorHeading
