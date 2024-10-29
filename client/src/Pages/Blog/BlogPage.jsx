import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
import './blog.css'

function BlogPage() {
    const [allBlog, setAllBlog] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchAllBlog = async (page) => {
        try {
            const res = await axios.get(`https://api.blueace.co.in/api/v1/get-all-blogs?page=${page}&limit=6`);
            setAllBlog(res.data.data);
            setTotalPages(res.data.totalPages);  // Set total pages based on the backend response
        } catch (error) {
            console.log("Internal server error in getting all blogs");
        }
    };

    useEffect(() => {
        fetchAllBlog(currentPage);
    }, [currentPage]);

    // Function to handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            {/* <div className="bg-dark py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/" className="text-light">Home</a></li>
                                    <li className="breadcrumb-item active theme-cl" aria-current="page">Blog Page</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div> */}
            <div style={{backgroundColor:'#00225F'}} class=" py-3">
				<div class="container">
					<div class="row">
						<div class="colxl-12 col-lg-12 col-md-12">
							<nav aria-label="breadcrumb">
								<ol class="breadcrumb mb-0">
									<li class="breadcrumb-item"><Link to={'/'} style={{color:'white'}}>Home</Link></li>
									<li class="breadcrumb-item"  style={{color:'white'}}>/</li>
									<li class="breadcrumb-item active" style={{color:'white'}} aria-current="page">Blogs</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>
			</div>
            <section className="middle">
                <div className="container">

                    <div className="row justify-content-center">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="sec_title position-relative text-center mb-5">
                                <h6 className="theme-cl mb-0">Latest Updates</h6>
                                <h2 className="ft-bold">View Recent Updates</h2>
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        {
                            allBlog && allBlog.map((item, index) => (
                                <div key={index} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                                    <div className="gup_blg_grid_box">
                                        <div className="gup_blg_grid_thumb">
                                            <Link to={`/blog/${item._id}`}><img src={item.smallImage?.url} className="img-fluid" alt={item.title} /></Link>
                                        </div>
                                        <div className="gup_blg_grid_caption">
                                            {/* <div className="blg_tag"><span>Marketing</span></div> */}
                                            <div className="blg_title"><h4><Link to={`/blog/${item._id}`}>{item.title}</Link></h4></div>
                                            <div className="blg_desc"><p  dangerouslySetInnerHTML={{ __html: item.content || 'No description available.' }}></p></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }


                    </div>

                    <div className="row justify-content-center">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="position-relative text-center">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        className={`btn ${currentPage === index + 1 ? 'gray' : 'gray-outline'} rounded ft-medium mx-1`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}

export default BlogPage;
