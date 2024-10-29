import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import Toggle from '../../components/Forms/toggle';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllHomeBanner() {
  const [banner, setBanner] = useState([])
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.blueace.co.in/api/v1/get-all-banner');
      if (response.data.success) {
        const datasave = response.data.data;
        const r = datasave.reverse();
        setBanner(r);
      } else {
        toast.error('Failed to fetch banner');
      }
    } catch (error) {
      toast.error('An error occurred while fetching banner.');
      console.error('Fetch error:', error); // Logging error for debugging
    } finally {
      setLoading(false); // Stop loading regardless of success or error
    }
  }

  useEffect(() => {
    handleFetchData();
  }, [])

  // Handle deleting a category
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://api.blueace.co.in/api/v1/delete-banner/${id}`);
      if (response.data.success) {
        toast.success('Banner deleted successfully!');
        await handleFetchData(); // Fetch categories again after deletion
      } else {
        toast.error('Failed to delete Banner');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the Banner.');
    }
  };

  const handleToggle = async (id, currentActiveStatus) => {
    try {
      // console.log('currentActiveStatus', currentActiveStatus)
      const newActiveStatus = !currentActiveStatus; // Toggle the status
      // console.log('newActiveStatus', newActiveStatus)
      const response = await axios.put(`https://api.blueace.co.in/api/v1/update-banner-active-status/${id}`, {
        active: newActiveStatus
      });

      if (response.data.success) {
        toast.success('Banner active status updated successfully!');
        await handleFetchData();
      } else {
        toast.error('Failed to update Banner active status.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the active status.');
      console.error('Toggle error:', error);
    }
  };


  // Calculate the indices of the vouchers to display
  const indexOfLastVoucher = currentPage * productsPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
  const currentServices = banner.slice(indexOfFirstVoucher, indexOfLastVoucher);

  // Define headers for the Table component
  const headers = ['S.No', 'Banner Image', 'Active', 'Action'];

  return (
    <div className='page-body'>
            <Breadcrumb heading={'Home Layout'} subHeading={'Home Layout'} LastHeading={'All Banner'} backLink={'/home-layout/all-banner'} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td className='text-danger fw-bolder'><img src={category?.bannerImage?.url} width={50} alt="" /></td>
                            <td>
                                <Toggle
                                    isActive={category.active}
                                    onToggle={() => handleToggle(category._id, category.active)} // Pass service id and current active status
                                />
                            </td>

                            {/* <td>{new Date(category.createdAt).toLocaleString() || "Not-Availdable"}</td> */}

                            <td className='fw-bolder'>
                                <div className="product-action">
                                    <Link to={`/home-layout/edit-banner/${category._id}`}>
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
                    productLength={banner.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/home-layout/add-banner"
                    text="Add Banner"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
        </div>
  )
}

export default AllHomeBanner
