import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import nonVeg from './nonveg.png'
import Veg from './Veg_symbol.svg'
import Swal from 'sweetalert2'
const GetAllProduct = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedSize, setSelectedSize] = useState({})
    const [showFilterMenu, setShowFilterMenu] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage] = useState(12)


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
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/Product/Delete-Product/${id}`);

                if (response.status === 200) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success",
                    });

                    setProducts(products.filter((product) => product._id !== id));
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
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/Product/Get-All-Products`)
            if (data.data) {
                setProducts(data.data)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }, [])

    const handleOpen = () => {
        setShowFilterMenu(!showFilterMenu)
    }

    const handleSizeChange = (productId, size) => {
        setSelectedSize(prev => ({
            ...prev,
            [productId]: size
        }))
    }

    useEffect(() => {
        handleFetch()
    }, [])

    // Get current products for pagination
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div><div className="container-fluid">
            <div className="page-title">
                <div className="row">
                    <div className="col-sm-6 col-12">
                        <h2>Product list</h2>
                    </div>

                </div>
            </div>
        </div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="list-product-header">
                                    <div>
                                        <div onClick={handleOpen} className="light-box"><Link data-bs-toggle="collapse" href="#collapseProduct" role="button" aria-expanded="false" aria-controls="collapseProduct"><i className="fa-solid fa-filter"></i><i className="icon-close filter-close hide"></i></Link></div><Link className="btn btn-primary" to="/products/create"><i className="fa-solid fa-plus"></i>Add Product</Link>
                                    </div>
                                    <div className="collapse" style={{ display: `${showFilterMenu ? 'block' : ''}` }} id="collapseProduct">
                                        <div className="card card-body list-product-body">
                                            <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3">
                                                <div className="col">
                                                    <select className="form-select" aria-label="Default select example">
                                                        <option selected="">Choose Product</option>
                                                        <option value="1">Apple iphone 13 Pro</option>
                                                        <option value="2">Wood Chair</option>
                                                        <option value="3">M185 Compact Wireless Mouse</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select className="form-select" aria-label="Default select example">
                                                        <option selected="">Choose Category</option>
                                                        <option value="1">Furniture</option>
                                                        <option value="2">Smart Gadgets</option>
                                                        <option value="3">Electrics</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select className="form-select" aria-label="Default select example">
                                                        <option selected="">Choose Sub Category</option>
                                                        <option value="1">Smart Phones</option>
                                                        <option value="2">Smart Watches</option>
                                                        <option value="3">Wireless headphone</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select className="form-select" aria-label="Default select example">
                                                        <option selected="">Status</option>
                                                        <option value="1">Sold Out </option>
                                                        <option value="2">In Stock</option>
                                                        <option value="3">Pre Order</option>
                                                        <option value="4">Limited Stock </option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select className="form-select" aria-label="Default select example">
                                                        <option selected="">Price</option>
                                                        <option value="1">56000.00</option>
                                                        <option value="2">19000.00</option>
                                                        <option value="3">10000.00</option>
                                                        <option value="3">15000.00</option>
                                                        <option value="3">99000.00</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-product">
                                    <table className="table" id="project-status">
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th> <span className="f-light hide f-w-600">Product Name</span></th>
                                                <th> <span className="f-light hide f-w-600">Flavours</span></th>
                                                <th> <span className="f-light hide f-w-600">Category</span></th>
                                                <th> <span className="f-light hide f-w-600">Price</span></th>
                                                <th> <span className="f-light hide f-w-600">Off Price</span></th>
                                                <th> <span className="f-light hide f-w-600">Stock</span></th>
                                                <th> <span className="f-light hide f-w-600">Sizes</span></th>
                                                <th> <span className="f-light hide f-w-600">Status</span></th>

                                                <th> <span className="f-light hide f-w-600">Action</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProducts && currentProducts.length > 0 ? (
                                                currentProducts.map((item, index) => {
                                                    const defaultSize = item.PackSizes?.[0]?.WeightAndPack || 'N/A';
                                                    const selected = selectedSize[item._id] || defaultSize;
                                                    const price = item.PackSizes?.find(pack => pack.WeightAndPack === selected)?.MrpPrice || 'N/A';
                                                    const discountPrice = item.PackSizes?.find(pack => pack.WeightAndPack === selected)?.DiscountPrize || 'N/A';
                                                    const stock = item.PackSizes?.find(pack => pack.WeightAndPack === selected)?.SizeStock || 'N/A';
                                                    const SizeAvailable = item.PackSizes?.find(pack => pack.WeightAndPack === selected)?.SizeAvailable || 'N/A';
                                                    return (
                                                        <tr key={index} className="product-removes">
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <div className="product-names">
                                                                    <div className="light-product-box">
                                                                        <img className="img-fluid" src={item?.ProductImages[0]?.ImageUrl} alt="product" />
                                                                    </div>
                                                                    <p className='hide-text f-light'>{item.ProductName}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {item.Flavours === "Veg" ? (
                                                                    <img src={Veg} className="img-fluid" width={25} alt="veg" />
                                                                ) : (
                                                                    <img src={nonVeg} className="img-fluid" width={25} alt="non-veg" />
                                                                )}
                                                            </td>
                                                            <td><p className="f-light">{item?.Category?.CategoryTitle}</p></td>
                                                            <td><p className="f-light">{price}</p></td>
                                                            <td><p className="f-light">{discountPrice}</p></td>
                                                            <td>
                                                                <select
                                                                    value={selected}
                                                                    className='form-select'
                                                                    onChange={(e) => handleSizeChange(item._id, e.target.value)}
                                                                >
                                                                    {item.PackSizes?.map((pack, idx) => (
                                                                        <option key={idx} value={pack.WeightAndPack}>
                                                                            {pack.WeightAndPack}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td><p>{stock}</p></td>
                                                            <td><span className={`badge ${SizeAvailable ? 'badge-light-success' : 'badge-light-secondary'} badge-light-secondary`}>{SizeAvailable ? 'in stock' : 'Sold Out'}</span></td>

                                                            <td>
                                                                <div className="product-action">
                                                                    <Link to={`/products/edit?id=${item._id}`}>
                                                                        <svg><use href="../assets/svg/icon-sprite.svg#edit-content"></use></svg>
                                                                    </Link>
                                                                    <svg onClick={() => handleDelete(item._id)}><use href="../assets/svg/icon-sprite.svg#trash1"></use></svg>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr><td colSpan="10">No products found</td></tr>
                                            )}


                                        </tbody>
                                    </table>

                                    <div className="pagination mt-4 d-flex gap-2">
                                        {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (
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
            </div>
            
    </div >
    )
}

export default GetAllProduct