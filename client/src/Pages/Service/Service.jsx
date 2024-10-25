import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Service() {
    const [allService, setAllService] = useState([]);
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Adjust items per page as needed

    const fetchAllService = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/get-all-service');
            setAllService(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };


    const fetchSubCategory = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/get-all-service-category');
            setAllSubCategory(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllService();
        fetchSubCategory();
    }, []);

    const handleSubCategoryChange = (subCategoryId) => {
        if (selectedSubCategories.includes(subCategoryId)) {
            setSelectedSubCategories(selectedSubCategories.filter(id => id !== subCategoryId));
        } else {
            setSelectedSubCategories([...selectedSubCategories, subCategoryId]);
        }
    };

    const filteredServices = selectedSubCategories.length > 0
        ? allService.filter(service => selectedSubCategories.includes(service.subCategoryId._id))
        : allService;

    // Pagination Logic
    const indexOfLastService = currentPage * itemsPerPage;
    const indexOfFirstService = indexOfLastService - itemsPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    // Handle Page Change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <section className="gray py-5">
                <div className="container">
                    <div className="row">

                        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                            <div className="bg-white rounded mb-4">

                                <div className="sidebar_header d-flex align-items-center justify-content-between px-4 py-3 br-bottom">
                                    <h4 className="ft-medium fs-lg mb-0">Search Filter</h4>
                                    <div className="ssh-header">
                                        <a href="javascript:void(0);" onClick={()=>setSelectedSubCategories([])} className="clear_all ft-medium text-muted">Clear All</a>
                                        <a href="#search_open" data-bs-toggle="collapse" aria-expanded="false" role="button" className="collapsed _filter-ico ml-2">
                                            <i className="lni lni-text-align-right"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="sidebar-widgets collapse miz_show" id="search_open" data-bs-parent="#search_open">
                                    <div className="search-inner">

                                        <div className="side-filter-box">
                                            <div className="side-filter-box-body">
                                                <div className="inner_widget_link">
                                                    <h6 className="ft-medium">Category</h6>
                                                    <ul className="no-ul-list filter-list">
                                                        {allSubCategory && allSubCategory.map((item, index) => (
                                                            <li key={index}>
                                                                <input
                                                                    id={`subcategory-${item._id}`}
                                                                    className="checkbox-custom"
                                                                    name="subCategory"
                                                                    type="checkbox"
                                                                    checked={selectedSubCategories.includes(item._id)}
                                                                    onChange={() => handleSubCategoryChange(item._id)}
                                                                />
                                                                <label htmlFor={`subcategory-${item._id}`} className="checkbox-custom-label">
                                                                    {item.name}
                                                                </label>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12">
                            <div className="row gx-3">
                                {currentServices && currentServices.map((item, index) => (
                                    <div key={index} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                                        <div className="Goodup-grid-wrap">
                                            <div className="Goodup-grid-upper">
                                                <div className="Goodup-grid-thumb">
                                                    <Link to={`/service/${item.name}`} className="d-block text-center m-auto">
                                                        <img src={item.serviceImage?.url} className="img-fluid" alt="" />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="Goodup-grid-fl-wrap">
                                                <div className="Goodup-caption px-3 py-2">
                                                    <div className="Goodup-author">
                                                        <Link to={`/service/${item.name}`}>
                                                            <img src="assets/img/t-1.png" className="img-fluid circle" alt="" />
                                                        </Link>
                                                    </div>
                                                    <div className="Goodup-cates">
                                                        <Link to={`/service/${item.name}`}>{item.subCategoryId?.name}</Link>
                                                    </div>
                                                    <h4 className="mb-0 ft-medium medium">
                                                        <Link to={`/service/${item.name}`} className="text-dark fs-md">
                                                            {item.name}
                                                            <span className="verified-badge"><i className="fas fa-check-circle"></i></span>
                                                        </Link>
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <ul className="pagination">
                                        {[...Array(totalPages)].map((_, index) => (
                                            <li key={index} className="page-item">
                                                <a 
                                                    className={`page-link ${index + 1 === currentPage ? 'active' : ''}`} 
                                                    href="#"
                                                    onClick={() => paginate(index + 1)}
                                                >
                                                    {index + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

export default Service;
