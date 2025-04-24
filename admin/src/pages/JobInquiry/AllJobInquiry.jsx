import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import toast from 'react-hot-toast';

const AllJobInquiry = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const inquiriesPerPage = 10;

    const handleFetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-career-inquiry');
            if (response.data.success) {
                const reversedData = response.data.data.reverse();
                setInquiries(reversedData);
            } else {
                toast.error('Failed to fetch inquiries');
            }
        } catch (error) {
            toast.error('An error occurred while fetching inquiries.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-career-inquiry/${id}`);
            if (response.data.success) {
                toast.success('Inquiry deleted successfully!');
                await handleFetchData();
            } else {
                toast.error('Failed to delete inquiry');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the inquiry.');
        }
    };

    const indexOfLast = currentPage * inquiriesPerPage;
    const indexOfFirst = indexOfLast - inquiriesPerPage;
    const currentInquiries = inquiries.slice(indexOfFirst, indexOfLast);

    const headers = ['S.No', 'Name', 'Email', 'Phone', 'Message', 'Job Title', 'Resume', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb 
                heading={'Career Inquiries'} 
                subHeading={'Careers'} 
                LastHeading={'All Inquiries'} 
                backLink={'/career-management/all-job-inquiries'} 
            />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentInquiries.map((inquiry, index) => (
                        <tr key={inquiry._id}>
                            <td>{indexOfFirst + index + 1}</td>
                            <td>{inquiry.name}</td>
                            <td>{inquiry.email}</td>
                            <td>{inquiry.phone}</td>
                            <td>{inquiry.message}</td>
                            <td>{inquiry.jobID?.title || 'N/A'}</td>
                            <td>
                                <a 
                                    href={inquiry.resume?.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary"
                                >
                                    View Resume
                                </a>
                            </td>
                            <td>
                                <div className="product-action">
                                    <i 
                                        onClick={() => handleDelete(inquiry._id)} 
                                        style={{ cursor: 'pointer' }} 
                                        className="ri-delete-bin-fill text-danger"
                                    ></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={inquiries.length}
                    productsPerPage={inquiriesPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href=""
                    text=""
                    errorMsg=""
                    handleOpen={() => {}}
                />
            )}
        </div>
    );
};

export default AllJobInquiry;
