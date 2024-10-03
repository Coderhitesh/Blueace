import React from 'react'

const ImageUploader = ({ handleFileChange, title, multiple }) => {

    return (
        <div className="mb-3 mt-4">
            <label className="form-label f-w-600 mb-2">Upload {title}</label>
            <div className="dropzone card" onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }}>
                <div className="dz-message needsclick text-center p-4">
                    <i className="fa-solid fa-cloud-arrow-up mb-3"></i>
                    <h6>Drop files here or click to upload.</h6>
                    <span className="note needsclick">
                        (Supported formats: JPG, PNG. Maximum file size: 5MB.)
                    </span>
                </div>
            </div>
            <input
                type="file"
                id="fileInput"
                multiple
                className="form-control"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />
        </div>
    )
}

export default ImageUploader
