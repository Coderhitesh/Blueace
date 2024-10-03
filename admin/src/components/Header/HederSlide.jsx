import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HederSlide = () => {
    // State to manage the visibility of submenus
    const [activeMenu, setActiveMenu] = useState(null);

    // Function to handle submenu toggle
    const handleMenuClick = (menuId) => {
        setActiveMenu(activeMenu === menuId ? null : menuId);
    };

    return (

        <aside className="page-sidebar">
            <div className="left-arrow" id="left-arrow">
                <i data-feather="arrow-left"></i>
            </div>
            <div className="main-sidebar" id="main-sidebar">
                <ul className="sidebar-menu" id="simple-bar">
                    <li className="sidebar-main-title">
                        <div>
                            <h5 className="lan-1 f-w-700 sidebar-title">General</h5>
                        </div>
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link className="sidebar-link" to="/">
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Home-dashboard"></use>
                            </svg>
                            <h6>Dashboards</h6>
                            <span className="badge">3</span>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('products')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Info-circle"></use>
                            </svg>
                            <h6 className="f-w-600">Products</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'products' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/products/manage">Manage Product</Link></li>
                                <li><Link to="/products/create">Create Product</Link></li>
                                {/* <li><Link to="/products/top">Top Product</Link></li> */}
                            </ul>
                        )}
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('Service')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Info-circle"></use>
                            </svg>
                            <h6 className="f-w-600">Service</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'Service' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/Service/manage">Manage Service</Link></li>
                                <li><Link to="/Service/create">Create Service</Link></li>
                                {/* <li><Link to="/Service/top">Top Service</Link></li> */}
                            </ul>
                        )}
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('category')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Pie"></use>
                            </svg>
                            <h6 className="lan-2">Category</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'category' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/category/manage">Manage Category</Link></li>
                                <li><Link to="/category/create">Create Category</Link></li>
                                {/* <li><Link to="/category/top">Top Category</Link></li> */}
                            </ul>
                        )}
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('vouchers')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Pie"></use>
                            </svg>
                            <h6 className="lan-2">Vouchers</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'vouchers' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/vouchers/manage">Manage Voucher</Link></li>
                                <li><Link to="/vouchers/create">Create Voucher</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('orders')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Info-circle"></use>
                            </svg>
                            <h6 className="f-w-600">Order</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'orders' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/orders/manage">Manage Orders</Link></li>
                                <li><Link to="/orders/delivered">Delivered Orders</Link></li>
                                <li><Link to="/orders/cancelled">Cancelled Orders</Link></li>
                            </ul>
                        )}
                    </li>
                    
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('Appoinments')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Pie"></use>
                            </svg>
                            <h6 className="lan-2">Appoinments</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'Appoinments' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/Appoinments/manage">Manage Appoinments</Link></li>
                                <li><Link to="/Appoinments/create">Create Appoinments</Link></li>
                                <li><Link to="/Appoinments/top">Past Appoinments</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('doctors')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Pie"></use>
                            </svg>
                            <h6 className="lan-2">Doctors</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'doctors' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/doctors/manage">Manage Doctors</Link></li>
                                <li><Link to="/doctors/create">Create Doctors</Link></li>
                                <li><Link to="/doctors/top">Top Doctors</Link></li>
                            </ul>
                        )}
                    </li>
                   
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('Pets')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Pie"></use>
                            </svg>
                            <h6 className="lan-2">Pets</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'Pets' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/Pets/manage">Manage Pets</Link></li>
                                <li><Link to="/Pets/create">Create Pets</Link></li>
                                <li><Link to="/Pets/top">Past Pets</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('branches')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Pie"></use>
                            </svg>
                            <h6 className="lan-2">Branches</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'branches' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/branches/manage">Manage Branches</Link></li>
                                <li><Link to="/branches/create">Create Branches</Link></li>
                                <li><Link to="/branches/top">Top Branches</Link></li>
                            </ul>
                        )}
                    </li>

                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link
                            className="sidebar-link"
                            to="#"
                            onClick={() => handleMenuClick('home-layout')}>
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Pie"></use>
                            </svg>
                            <h6 className="lan-2">Home Layout</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                        {activeMenu === 'home-layout' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/home-banner/manage">Manage Home Banner</Link></li>
                                <li><Link to="/offer-banner/manage">Manage Offer Banner</Link></li>
                                <li><Link to="/doctor-banner/manage">Manage Doctor Banner</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link className="sidebar-link" to="/cart">
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Pie"></use>
                            </svg>
                            <h6 className="lan-2">Order In Cart</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link className="sidebar-link" to="/settings">
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Pie"></use>
                            </svg>
                            <h6 className="lan-2">Settings</h6>
                            <i className="iconly-Arrow-Right-2 icli"></i>
                        </Link>
                    </li>
                    <li className="sidebar-main-title">
                        <div>
                            <h5 className="lan-1 f-w-700 sidebar-title">Pages</h5>
                        </div>
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link className="sidebar-link" to="/privacy">
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Wallet"></use>
                            </svg>
                            <h6 className="f-w-600">Privacy Page</h6>
                        </Link>
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link className="sidebar-link" to="/disclaimer">
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Paper-plus"></use>
                            </svg>
                            <h6 className="f-w-600">Disclaimer Page</h6>
                        </Link>
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link className="sidebar-link" to="/cookies">
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Play"></use>
                            </svg>
                            <h6 className="f-w-600">Cookies Page</h6>
                        </Link>
                    </li>
                    <li className="sidebar-list">
                        <i className="fa-solid fa-thumbtack"></i>
                        <Link className="sidebar-link" to="/refund">
                            <svg className="stroke-icon">
                                <use href="../assets/svg/iconly-sprite.svg#Star-kit"></use>
                            </svg>
                            <h6 className="f-w-600">Return And Refund Page</h6>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>

    );
};

export default HederSlide;
