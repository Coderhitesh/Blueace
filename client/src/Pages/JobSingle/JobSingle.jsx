import React, { useEffect } from 'react';

function JobSingle() {
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior:'smooth'
        })
    },[])
    return (
        <>
            {/* ============================ Job Details Start ================================== */}
            <section className="middle">
                <div className="container">
                    <div className="row">

                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">

                            <div className="d-block mb-4">
                                <button className="btn btn-md gray ft-medium rounded">
                                    <i className="ti-back-left mr-1"></i>Back
                                </button>
                            </div>

                            <div className="d-block mb-4">
                                <div className="svd-01 d-flex align-items-center">
                                    <div className="jbd-flex d-flex align-items-center justify-content-start">
                                        <div className="jbd-01-thumb">
                                            <img src="assets/img/c-1.png" className="img-fluid" width="90" alt="Company Logo" />
                                        </div>
                                    </div>
                                    <div className="jbd-01-caption ps-3">
                                        <div className="tbd-title">
                                            <div className="ft-medium medium"><span>InfosysX</span></div>
                                            <h4 className="mb-3 ft-medium fs-lg">
                                                Senior UI/UX Web Designer in USA
                                                <img src="assets/img/verify.svg" className="ms-1" width="12" alt="Verified" />
                                            </h4>
                                        </div>
                                        <div className="jbd-list mb-2">
                                            <span className="px-2 py-1 rounded theme-cl theme-bg-light me-2">
                                                <i className="lni lni-briefcase me-1"></i>Full Time
                                            </span>
                                            <span><i className="lni lni-map-marker mr-1"></i>Sastri Nagar, New Delhi</span>
                                            <span className="px-2 py-1 rounded text-warning bg-light-warning ms-2">
                                                <i className="lni lni-star me-1"></i>Featured
                                            </span>
                                            <span className="rounded ms-2">
                                                <i className="lni lni-money-protection me-1"></i>$85k - 100k PA.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded mb-4">
                                <div className="jbd-01">

                                    <div className="jbd-details mb-4">
                                        <h5 className="ft-medium fs-md">Job description</h5>
                                        <p>
                                            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
                                            sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                                            voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
                                            laboriosam, nisi ut aliquid ex ea commodi consequatur.
                                        </p>
                                        <p>
                                            Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut
                                            et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur.
                                        </p>
                                    </div>

                                    <div className="jbd-details mb-3">
                                        <h5>Requirements:</h5>
                                        <div className="position-relative row">
                                            <div className="col-lg-12 col-md-12 col-12">
                                                {[
                                                    'Strong core PHP Hands on experience.',
                                                    'Strong Expertise in CodeIgniter Framework.',
                                                    'Understanding of MVC design pattern.',
                                                    'Expertise in PHP, MVC Frameworks and good technology exposure of Codeigniter.',
                                                    'Basic understanding of front-end technologies, such as JavaScript, HTML5, and CSS3',
                                                    'Good knowledge of relational databases, version control tools and of developing web services.',
                                                    'Proficient understanding of code versioning tools, such as Git.'
                                                ].map((item, index) => (
                                                    <div className="mb-2 mr-4 ml-lg-0 mr-lg-4" key={index}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="rounded-circle bg-light-danger theme-cl p-1 small d-flex align-items-center justify-content-center">
                                                                <i className="fas fa-check small"></i>
                                                            </div>
                                                            <h6 className="mb-0 ms-3 text-muted fs-sm">{item}</h6>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="jbd-details mb-4">
                                        <h5 className="ft-medium fs-md">Skills Required</h5>
                                        <div className="klop-dfgy">
                                            <div className="details ft-medium">
                                                <label className="text-muted">Role</label><span className="text-dark">Database Architect / Designer</span>
                                            </div>
                                            <div className="details ft-medium">
                                                <label className="text-muted">Industry Type</label><span className="text-dark">Advertising & Marketing</span>
                                            </div>
                                            <div className="details ft-medium">
                                                <label className="text-muted">Functional Area</label><span className="text-dark">Engineering - Software</span>
                                            </div>
                                            <div className="details ft-medium">
                                                <label className="text-muted">Employment Type</label><span className="text-dark">Full Time, Permanent</span>
                                            </div>
                                            <div className="details ft-medium">
                                                <label className="text-muted">Role Category</label><span className="text-dark">DBA / Data warehousing</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="jbd-details mb-1">
                                        <h5 className="ft-medium fs-md">Key Skills</h5>
                                        <ul className="p-0 lkoi-skill text-left">
                                            {[
                                                'Joomla', 'WordPress', 'Javascript', 'PHP', 'HTML5',
                                                'MS SQL', 'SQL Development', 'Dynamod', 'Database'
                                            ].map((skill, index) => (
                                                <li key={index}><span>{skill}</span></li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>

                                <div className="jbd-02 mt-4">
                                    <div className="jbd-02-flex d-flex align-items-center justify-content-between">
                                        <div className="jbl_button mb-2">
                                            <a href="#" className="btn btn-md rounded gray fs-sm ft-medium me-2">Save This Job</a>
                                            <a href="#" className="btn btn-md rounded theme-bg text-light fs-sm ft-medium">Apply Job</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Sidebar */}
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                            {/* Author Box */}
                            <div className="jb-apply-form bg-white rounded py-4 px-4 border mb-4">

                                <div className="Goodup-agent-blocks">
                                    <div className="Goodup-agent-thumb">
                                        <img src="assets/img/t-1.png" width="90" className="img-fluid circle" alt="Agent" />
                                    </div>
                                    <div className="Goodup-agent-caption">
                                        <h4 className="ft-medium mb-0">Thomas R. Graves</h4>
                                        <span className="agd-location">
                                            <i className="lni lni-map-marker me-1"></i>San Francisco
                                        </span>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>

                                <div className="Goodup-iuky">
                                    <ul>
                                        <li>140+<span>Listings</span></li>
                                        <li><div className="text-success">4.7</div><span>Ratings</span></li>
                                        <li>80K<span>Followers</span></li>
                                    </ul>
                                </div>

                                <div className="agent-cnt-info">
                                    <div className="row g-4">
                                        <div className="col-6">
                                            <a href="javascript:void(0);" className="adv-btn full-width">Follow Now</a>
                                        </div>
                                        <div className="col-6">
                                            <a href="javascript:void(0);" className="adv-btn full-width">Send Message</a>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <a href="javascript:void(0);" className="adv-btn full-width theme-bg text-light">View Profile</a>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* <!-- Business Inof --> */}
							<div className="jb-apply-form bg-white rounded py-4 px-4 border mb-4">
								<div className="uli-list-info">
									<ul>
										
										<li>
											<div className="list-uiyt">
												<div className="list-iobk"><i className="fas fa-globe"></i></div>
												<div className="list-uiyt-capt"><h5>Live Site</h5><p>https://hoverbusinessservices.com/</p></div>
											</div>
										</li>
										
										<li>
											<div className="list-uiyt">
												<div className="list-iobk"><i className="fas fa-envelope"></i></div>
												<div className="list-uiyt-capt"><h5>Drop a Mail</h5><p>support@Hover.com</p></div>
											</div>
										</li>
										
										<li>
											<div className="list-uiyt">
												<div className="list-iobk"><i className="fas fa-phone"></i></div>
												<div className="list-uiyt-capt"><h5>Call Us</h5><p>(210) 659 584 756</p></div>
											</div>
										</li>
										<li>
											<div className="list-uiyt">
												<div className="list-iobk"><i className="fas fa-map-marker-alt"></i></div>
												<div className="list-uiyt-capt"><h5>Get Directions</h5><p>2919 N Flores St San Antonio, TX 78212</p></div>
											</div>
										</li>
										
									</ul>
								</div>
							</div>

                        </div>

                    </div>
                </div>
            </section>
            {/* ============================ Job Details End ================================== */}
        </>
    );
}

export default JobSingle;
