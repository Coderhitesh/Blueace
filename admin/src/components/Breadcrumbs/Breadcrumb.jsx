import React from 'react'

const Breadcrumb = ({ heading, subHeading, LastHeading }) => {
    return (
        <div className="container-fluid">
            <div className="page-title">
                <div className="row">
                    <div className="col-sm-6 col-12">
                        <h2>{heading}</h2>
                    </div>
                    <div className="col-sm-6 col-12">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/"><i className="iconly-Home icli svg-color"></i></a></li>
                            <li className="breadcrumb-item">{subHeading}</li>
                            <li className="breadcrumb-item active">{LastHeading}</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Breadcrumb
