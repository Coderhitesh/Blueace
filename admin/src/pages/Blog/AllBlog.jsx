import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import Toggle from '../../components/Forms/toggle';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllBlog() {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-blogs');
            if (response.data.success) {
                const datasave = response.data.data;
                const r = datasave.reverse();
                setCategory(r);
            } else {
                toast.error('Failed to fetch blogs');
            }
        } catch (error) {
            toast.error('An error occurred while fetching blogs.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://www.api.blueaceindia.com/api/v1/delete-blog/${id}`);
            if (response.data.success) {
                toast.success('Blog deleted successfully!');
                await fetchBlogs();
            } else {
                toast.error('Failed to delete blog');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the blog.');
        }
    };

    const handleToggleIsTranding = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            const response = await axios.put(`https://www.api.blueaceindia.com/api/v1/update-isTranding/${id}`, {
                isTranding: newStatus
            });

            if (response.data.success) {
                toast.success('Blog trending status updated successfully!');
                await fetchBlogs();
            } else {
                toast.error('Failed to update blog trending status.');
            }
        } catch (error) {
            toast.error('An error occurred while updating the trending status.');
            console.error('Toggle error:', error);
        }
    };

    const indexOfLastBlog = currentPage * productsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - productsPerPage;
    const currentBlogs = category.slice(indexOfFirstBlog, indexOfLastBlog);

    const headers = ['S.No', 'Title', 'Small Image', 'Large Image', 'Content', 'Meta Title', 'Meta Description', 'Created At', 'Is Trending', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'All Blogs'} subHeading={'All Blogs Home Layout'} LastHeading={'All Blogs'} backLink={'/home-layout/all-blog'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentBlogs.map((blog, index) => (
                        <tr key={blog._id}>
                            <td>{index + 1}</td>
                            <td className='fw-bolder'>{blog.title || "Not Available"}</td>
                            <td className='text-danger fw-bolder'><img src={blog?.smallImage?.url} width={50} alt="" /></td>
                            <td className='text-danger fw-bolder'><img src={blog?.largeImage?.url} width={50} alt="" /></td>
                            <td className='fw-bolder'>{blog.content ? blog.content.substring(0, 14) + '....' : "Not Available"}</td>
                            <td className='fw-bolder'>{blog.metaTitle ? blog.metaTitle.substring(0, 14) + '....' : "Not Available"}</td>
                            <td className='fw-bolder'>{blog.metaDescription ? blog.metaDescription.substring(0, 14) + '....' : "Not Available"}</td>
                            <td>{new Date(blog.createdAt).toLocaleString() || "Not Available"}</td>
                            <td>
                                <Toggle
                                    isActive={blog.isTranding}
                                    onToggle={() => handleToggleIsTranding(blog._id, blog.isTranding)} // Pass blog ID and current isTranding status
                                />
                            </td>
                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/home-layout/edit-blog/${blog._id}`}>
                                        <i class="ri-pencil-fill"></i>
                                    </Link>
                                    {/* <svg onClick={() => handleDelete(blog._id)} style={{ cursor: 'pointer' }}>
                                        <use href="/assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg> */}
                                    <i onClick={() => handleDelete(blog._id)} style={{ cursor: 'pointer' }} class="ri-delete-bin-fill"></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                    productLength={category.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}

                    href="/home-layout/add-blog"
                    text="Add Blog"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
    );
}

export default AllBlog;
