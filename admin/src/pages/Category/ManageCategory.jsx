import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import Loader from '../../components/loader/Loader'
import CreateCategoryModel from './CreateCategoryModel'


const ManageCategory = () => {

    const [category, setCategory] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage] = useState(10)
    const [open, setOpen] = useState(false)

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/Product/Delete-category/${id}`);

                if (response.status === 200) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success",
                    });

                    setCategory(category.filter((product) => product._id !== id));
                }
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "There was an issue deleting the product.",
                icon: "error",
            });
        }
    };



    const handleFetch = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/Product/Get-All-category`)
            if (data.data) {
                setCategory(data.data)
            }
            console.log(data.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }, [])


    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }


    useEffect(() => {
        handleFetch()
    }, [])

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = category.slice(indexOfFirstProduct, indexOfLastProduct)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div class="container-fluid">
                <div class="page-title">
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <h2>Category</h2>
                        </div>
                        <div class="col-sm-6 col-12">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="index.html"><i class="iconly-Home icli svg-color"></i></a></li>
                                <li class="breadcrumb-item">Product</li>
                                <li class="breadcrumb-item active">Category</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="list-product-header">
                                    <div>

                                        <Link onClick={handleOpen} className='btn-primary hides-wrap btn' href="">Add Category</Link>
                                    </div>


                                </div>
                                <div class="list-product list-category">
                                    <table class="table" id="project-status">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Status
                                                    <div class="form-check">
                                                        <input class="form-check-input checkbox-primary" type="checkbox" />
                                                    </div>
                                                </th>
                                                <th> <span class="f-light f-w-600">Category</span></th>

                                                <th> <span class="f-light f-w-600">Category Type</span></th>
                                                <th> <span class="f-light f-w-600">Action</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProducts && currentProducts.length > 0 ? (
                                                currentProducts.map((item, index) => {
                                                    const { isActive } = item;
                                                    console.log(isActive)
                                                    return (
                                                        <tr key={index} class="product-removes">
                                                            <td>
                                                                <div class="form-check">
                                                                    <input class="form-check-input checkbox-primary" checked={isActive} type="checkbox" />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="product-names">
                                                                    <div class="light-product-box"><img class="img-fluid" src={item?.Image.url} alt="t-shirt" /></div>
                                                                    <p></p>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <span
                                                                    className={`badge ${index % 2 === 0 ? 'badge-light-danger' : 'badge-light-primary'}`}>
                                                                    {item.CategoryTitle}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <div class="product-action">
                                                                    <Link to={`/category/edit?id=${item._id}`}>
                                                                        <svg>
                                                                            <use href="../assets/svg/icon-sprite.svg#edit-content"></use>
                                                                        </svg>
                                                                    </Link>
                                                                    <svg onClick={() => handleDelete(item._id)}>
                                                                        <use href="../assets/svg/icon-sprite.svg#trash1"></use>
                                                                    </svg>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                    )
                                                })
                                            ) : (
                                                <tr><td colSpan="10">No products found</td></tr>
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                                <div className="pagination mt-4 d-flex gap-2">
                                        {Array.from({ length: Math.ceil(category.length / productsPerPage) }, (_, i) => (
                                            <button key={i} onClick={() => paginate(i + 1)} className={` btn btn-primary page-link ${currentPage === i + 1 ? 'btn-danger' : ''}`}>
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CreateCategoryModel isOpen={open} onClose={handleClose} />
        </div>
    )
}

export default ManageCategory