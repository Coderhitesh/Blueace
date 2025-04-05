import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import Toggle from '../../components/Forms/toggle';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AllGalleryImage() {
  const [banner, setBanner] = useState([])
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const handleFetchData = async () => {
      setLoading(true);
      try {
          const response = await axios.get('http://localhost:7987/api/v1/get-all-gallery-image');
          if (response.data.success) {
              const datasave = response.data.data;
              const r = datasave.reverse();
              setBanner(r);
          } else {
              toast.error('Failed to fetch Gallery image');
          }
      } catch (error) {
          toast.error('An error occurred while fetching gallery Image.');
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
          const response = await axios.delete(`http://localhost:7987/api/v1/delete-gallery-image/${id}`);
          if (response.data.success) {
              toast.success('Gallery Image deleted successfully!');
              await handleFetchData(); // Fetch categories again after deletion
          } else {
              toast.error('Failed to delete Gallery Image');
          }
      } catch (error) {
          toast.error('An error occurred while deleting the Gallery Image.');
      }
  };


  // Calculate the indices of the vouchers to display
  const indexOfLastVoucher = currentPage * productsPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
  const currentServices = banner.slice(indexOfFirstVoucher, indexOfLastVoucher);

  // Define headers for the Table component
  const headers = ['S.No', "Title", 'Gallery Image', 'Action'];

return (
  <div className='page-body'>
          <Breadcrumb heading={'Gallery Image'} subHeading={'Home Layout'} LastHeading={'All Gallery Image'} backLink={'/home-layout/all-gallery-image'} />
          {loading ? (
              <div>Loading...</div>
          ) : (
              <Table
                  headers={headers}
                  elements={currentServices.map((category, index) => (
                      <tr key={category._id}>
                          <td>{index + 1}</td>
                          <td className=' fw-bolder'>{category?.galleryCategoryId?.name}</td>
                          <td className='text-danger fw-bolder'><img src={category?.image?.url} width={50} alt="" /></td>
                          {/* <td>
                              <Toggle
                                  isActive={category.active}
                                  onToggle={() => handleToggle(category._id, category.active)} // Pass service id and current active status
                              />
                          </td> */}

                          {/* <td>{new Date(category.createdAt).toLocaleString() || "Not-Availdable"}</td> */}

                          <td className='fw-bolder'>
                              <div className="product-action">
                                  <Link to={`/home-layout/Edit-gallery-image/${category._id}`}>
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
                  href="/home-layout/Add-gallery-image"
                  text="Add Gallery Image"
                  errorMsg=""
                  handleOpen={() => { }}
              />
          )}
      </div>
)
}

export default AllGalleryImage
