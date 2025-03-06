import React from 'react';
import { Link } from 'react-router-dom';

const Table = ({
    headers,
    elements,
    productLength,
    productsPerPage,
    currentPage,
    paginate,
    href,
    text,
    errorMsg,
    handleOpen,
    ExcelText,
    excelHref,
    EmployeeOrderText,
    EmployeeOrderHref,
    AMCOrderText,
    AMCOrderHref,
}) => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="list-product-header">
                                <div>
                                    {EmployeeOrderText && (
                                        <Link className="btn btn-primary" to={EmployeeOrderHref}>
                                            {EmployeeOrderText}
                                        </Link>
                                    )}
                                    {AMCOrderText && (
                                        <Link className="btn btn-primary" to={AMCOrderHref}>
                                            {AMCOrderText}
                                        </Link>
                                    )}
                                    {ExcelText && (
                                        <Link className="btn btn-primary" to={excelHref}>
                                            {ExcelText}
                                        </Link>
                                    )}
                                    {text && (
                                    <Link className="btn btn-primary" to={href}>
                                        <i className="fa-solid fa-plus"></i>{text}
                                    </Link>
                                    )}
                                </div>
                            </div>
                            <div className="list-product table-responsive">
                                <table className="table table-striped table-bordered" id="project-status">
                                    <thead>
                                        <tr>
                                            {headers.map((header, index) => (
                                                <th key={index}>
                                                    <span className="f-light hide f-w-600">{header}</span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elements}
                                    </tbody>
                                </table>

                            </div>
                            <div className="pagination mt-4 d-flex gap-2">
                                {Array.from({ length: Math.ceil(productLength / productsPerPage) }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginate(i + 1)}
                                        className={`btn btn-primary page-link ${currentPage === i + 1 ? 'btn-danger' : ''}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;
