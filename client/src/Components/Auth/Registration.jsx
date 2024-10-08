import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Registration() {
  useEffect(()=>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
},[])
  return (
    <>
      {/* ======================= Registration Detail ======================== */}
      <section className="gray">
        <div className="container">
          <div className="row align-items-start justify-content-center">
            <div className="col-xl-6 col-lg-8 col-md-12">
              <div className="signup-screen-wrap">
                <div className="signup-screen-single light">
                  <div className="text-center mb-4">
                    <h4 className="m-0 ft-medium">Create An Account</h4>
                  </div>
                  
                  <form className="submit-form">
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <input type="text" className="form-control rounded" placeholder="Enter Your Name" />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input type="email" className="form-control rounded" placeholder="Enter Your Email" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <input type="number" className="form-control rounded" placeholder="Enter Your Number" />
                    </div>                   
                    <div className="form-group">
                      <input type="password" className="form-control rounded" placeholder="Password" />
                    </div>
                    
                    <div className="form-group">
                      <button type="submit" className="btn btn-md full-width theme-bg text-light rounded ft-medium">Sign Up</button>
                    </div>
                    
                    <div className="form-group text-center mb-0">
                      <p className="extra">Or Signup with</p>
                      <div className="option-log">
                        <div className="single-log-opt">
                          <Link to={""} className="log-btn">
                            <img src="assets/img/c-1.png" className="img-fluid" alt="" />Login with Google
                          </Link>
                        </div>
                        <div className="single-log-opt">
                          <Link to={""} className="log-btn">
                            <img src="assets/img/facebook.png" className="img-fluid" alt="" />Login with Facebook
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group text-center mt-4 mb-0">
                      <p className="mb-0">Have You Already An account? <Link to={'/sign-in'} className="ft-medium text-success">Sign In</Link></p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======================= Registration End ======================== */}
    </>
  );
}

export default Registration;
