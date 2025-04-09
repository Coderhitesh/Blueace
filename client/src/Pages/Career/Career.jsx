import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Career() {
    const [allJob, setAllJob] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(6);

    const handleFetchJob = async () => {
        try {
            const { data } = await axios.get('https://api.blueaceindia.com/api/v1/careers');
            setAllJob(data.data);
        } catch (error) {
            console.log("internal server error", error);
        }
    }

    useEffect(() => {
        handleFetchJob();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, []);

    const handleApply = () => {
        window.location.href = 'tel:9311539090';
    }

    // Get current jobs
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = allJob.slice(indexOfFirstJob, indexOfLastJob);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(allJob.length / jobsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold" style={{ color: '#2d3436' }}>
                        Join Our Team
                    </h1>
                    <p className="lead text-muted">
                        Discover Your Next Career Opportunity
                    </p>
                </div>

                <div className="row g-4 mb-5">
                    {currentJobs.map((job) => (
                        <div key={job._id} className="col-12">
                            <div className="card border-0 rounded-4 overflow-hidden hover-shadow-lg"
                                style={{ transition: 'all 0.3s ease' }}>
                                <div className="card-body p-4">
                                    <div className="row align-items-center">
                                        <div className="col-lg-12">
                                            <div className="d-flex align-items-center mb-3">
                                                <h3 className="h4 fw-bold mb-0" style={{ color: '#2d3436' }}>
                                                    {job.title}
                                                </h3>
                                                <span className="badge bg-primary bg-gradient ms-3 px-3 py-2 rounded-pill">
                                                    {job.noOfVacancy} {job.noOfVacancy > 1 ? 'Openings' : 'Opening'}
                                                </span>
                                            </div>

                                            <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
                                                {job.description}
                                            </p>

                                            <div className="mb-4">
                                                <h5 className="fw-bold mb-3" style={{ color: '#2d3436' }}>
                                                    Key Requirements
                                                </h5>
                                                <div className="row g-3">
                                                    {job.points.map((point, index) => (
                                                        <div key={index} className="col-md-6">
                                                            <div className="d-flex align-items-center p-3 rounded-3"
                                                                style={{ background: 'rgba(52, 152, 219, 0.1)' }}>
                                                                <i className="bi bi-check-circle-fill me-2"
                                                                    style={{ color: '#3498db' }}></i>
                                                                <span>{point}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleApply}
                                                className="btn btn-primary btn-lg px-3 py-2 rounded-pill shadow-sm"
                                                style={{
                                                    background: 'linear-gradient(45deg, #3498db, #2980b9)',
                                                    border: 'none',
                                                    transition: 'transform 0.2s ease'
                                                }}
                                                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                            >
                                                Apply Now
                                                <i className="bi bi-arrow-right ms-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <nav className="d-flex justify-content-center">
                    <ul className="pagination pagination-lg">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage - 1)}
                                style={{ border: 'none', fontSize: '17px', background: 'transparent', padding: '5px 10px' }}
                            >
                                Previous
                            </button>
                        </li>
                        {pageNumbers.map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                <button
                                    onClick={() => paginate(number)}
                                    className="page-link"
                                    style={{
                                        border: 'none',
                                        background: currentPage === number ? 'linear-gradient(45deg, #3498db, #2980b9)' : 'transparent',
                                        color: currentPage === number ? 'white' : '#2d3436',
                                        padding: '5px 10px',
                                        fontSize: '17px'
                                    }}
                                >
                                    {number}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage + 1)}
                                style={{ border: 'none', background: 'transparent', padding: '5px 10px', fontSize: '17px' }}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Career;