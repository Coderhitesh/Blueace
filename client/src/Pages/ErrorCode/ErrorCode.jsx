import React, { useEffect, useState } from 'react';
import { AlertCircle, ChevronDown, FileText, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

function ErrorCode() {
  const { id } = useParams();
  const [allError, setAllError] = useState([]);
  const [selectedHeading, setSelectedHeading] = useState('');
  const [selectedErrors, setSelectedErrors] = useState([]); // This will hold multiple selected error codes
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetching all error codes from the API
  const handleFetchError = async () => {
    try {
      const response = await fetch('http://localhost:7987/api/v1/get-all-error-code');
      const data = await response.json();
      setAllError(data.data);
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  useEffect(() => {
    handleFetchError();
  }, []);

  const uniqueHeadings = [...new Set(allError.map(error => error.Heading.title))];
  const filteredErrors = allError.filter(error => error.Heading.title === selectedHeading);

  // Adding an error code to the selected errors list
  const handleAddError = (error) => {
    if (!selectedErrors.find(e => e._id === error._id)) {
      setSelectedErrors([...selectedErrors, error]);
    }
  };

  // Removing an error code from the selected errors list
  const handleRemoveError = (errorId) => {
    setSelectedErrors(selectedErrors.filter(error => error._id !== errorId));
  };

  // Submit selected error codes
  const handleSubmitError = async () => {
    setIsSubmitting(true);
    try {
      const errorCodes = selectedErrors.map(error => error._id);
      await fetch(`http://localhost:7987/api/v1/update-error-code-order/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errorCode: errorCodes }),
      });
      setIsSubmitting(false);
      toast.success('Error codes updated successfully');
    } catch (error) {
      console.log("Internal server error", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <AlertCircle className="text-primary me-2" size={24} />
                  <h1 className="h3 mb-0">Error Code Management</h1>
                </div>

                <div className="row g-4">
                  {/* Device Type Dropdown */}
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label className="form-label">Select Device Type</label>
                      <div className="dropdown-container">
                        <select
                          className="form-select"
                          value={selectedHeading}
                          onChange={(e) => {
                            setSelectedHeading(e.target.value);
                            // setSelectedErrors([]); // Reset selected errors when changing the heading
                          }}
                        >
                          <option value="">Choose device type...</option>
                          {uniqueHeadings.map((heading) => (
                            <option key={heading} value={heading}>
                              {heading}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="icon" size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Error Code Dropdown */}
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label className="form-label">Select Error Code</label>
                      <div className="dropdown-container">
                        <select
                          className="form-select"
                          onChange={(e) => {
                            const error = filteredErrors.find(err => err._id === e.target.value);
                            handleAddError(error);
                          }}
                          disabled={!selectedHeading}
                        >
                          <option value="">Choose error code...</option>
                          {filteredErrors.map((error) => (
                            <option key={error._id} value={error._id}>
                              {error.code} - {error.description}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="icon" size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Errors List */}
                {selectedErrors.length > 0 && (
                  <div className="mt-4">
                    <h5>Selected Error Codes</h5>
                    <ul className="list-group">
                      {selectedErrors.map((error) => (
                        <li key={error._id} className="list-group-item d-flex justify-content-between align-items-center">
                          {error.code} - {error.description}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveError(error._id)}
                          >
                            <XCircle size={18} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmitError}
                  disabled={isSubmitting || selectedErrors.length === 0}
                  className="btn btn-primary w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Submit Error Codes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorCode;
