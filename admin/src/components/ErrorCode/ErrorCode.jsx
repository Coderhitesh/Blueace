import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, FileText, Tag, Info } from 'lucide-react';

const ErrorCode = () => {
  const { id } = useParams();
      const [errorCode, setErrorCode] = useState([]);
      const [loading, setLoading] = useState(true);
  
      const handleFetchData = async () => {
          try {
              const response = await fetch(`https://www.api.blueaceindia.com/api/v1/get-order-by-id/${id}`);
              const data = await response.json();
              setErrorCode(data.data.errorCode);
              setLoading(false);
          } catch (error) {
              console.log("Internal server error", error);
              setLoading(false);
          }
      };
  
      useEffect(() => {
          handleFetchData();
      }, [id]);
  
      if (errorCode.length === 0) {
          return <>
              <div className="alert alert-warning text-center mt-4">
                  <h5>No error codes have been updated by the vendor or employee yet.</h5>
                  <p>Once an error code is updated, it will appear here.</p>
              </div>
  
          </>
      }
  
      if (loading) {
          return (
              <div className="min-vh-100 d-flex align-items-center justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                  </div>
              </div>
          );
      }
  
      return (
          <div className="min-vh-100 bg-light py-5">
              <div className="container">
                  <div className="row justify-content-center">
                      <div className="col-12 col-lg-10">
                          {/* Header Card */}
                          <div className="card shadow-sm mb-4">
                              <div className="card-body p-4">
                                  <div className="d-flex align-items-center">
                                      <AlertCircle className="text-primary me-3" size={32} />
                                      <div>
                                          <h1 className="h3 mb-1">Error Code Details</h1>
                                          <p className="text-muted mb-0">Comprehensive error information and troubleshooting</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
  
                          {/* Error Code Cards */}
                          <div className="row g-4">
                              {Array.isArray(errorCode) && errorCode.map((error, index) => (
                                  <div key={error._id} className="col-12">
                                      <div className="card shadow-sm">
                                          <div className="card-body p-4">
                                              {/* Device Type Header */}
                                              <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                                  <Info className="text-primary me-2" size={24} />
                                                  <h3 className="h5 mb-0">{error.Heading.title}</h3>
                                              </div>
  
                                              {/* Error Code and Description */}
                                              <div className="mb-4">
                                                  <div className="d-flex align-items-center mb-3">
                                                      <Tag className="text-primary me-3" size={20} />
                                                      <div className="bg-primary bg-opacity-10 px-3 py-2 rounded-3">
                                                          <span style={{color:'white'}} className="fw-bold">Error Code: {error.code}</span>
                                                      </div>
                                                  </div>
                                                  <div className="ms-4">
                                                      <div className="d-flex align-items-center mb-2">
                                                          <FileText className="text-primary me-2" size={20} />
                                                          <h4 className="h6 mb-0">Description</h4>
                                                      </div>
                                                      <p className="text-secondary mb-0 ms-4">
                                                          {error.description}
                                                      </p>
                                                  </div>
                                              </div>
  
                                              {/* Notes Section */}
                                              {error.note && error.note.length > 0 && (
                                                  <div className="bg-light rounded-3 p-4">
                                                      <div className="d-flex align-items-center mb-3">
                                                          <AlertCircle className="text-primary me-2" size={20} />
                                                          <h4 style={{color:'black'}} className="h6 mb-0">Troubleshooting Notes</h4>
                                                      </div>
                                                      <ul className="list-group list-group-flush">
                                                          {error.note.map((note, noteIndex) => (
                                                              <li key={noteIndex} className="list-group-item bg-transparent border-0 px-0 py-2">
                                                                  <div className="d-flex">
                                                                      <span className="text-primary me-2">•</span>
                                                                      <span className="text-secondary">{note}</span>
                                                                  </div>
                                                              </li>
                                                          ))}
                                                      </ul>
                                                  </div>
                                              )}
  
                                              {/* Reference ID */}
                                              <div className="mt-4 text-end">
                                                  <small className="text-muted">
                                                      Reference ID: {error._id}
                                                  </small>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

export default ErrorCode
