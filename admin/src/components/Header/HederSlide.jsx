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
                        </Link>
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
                            {/* <i class="fa-solid fa-arrow-right"></i> */}
                        </Link>
                        {activeMenu === 'Service' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/service/category">Manage Category</Link></li>
                                <li><Link to="">Manage Service</Link></li>
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
                            {/* <i class="fa-solid fa-arrow-right"></i> */}
                        </Link>
                        {activeMenu === 'home-layout' && (
                            <ul className="sidebar-submenu">
                                <li><Link to="/home-banner/manage">Manage Home Banner</Link></li>
                                <li><Link to="/offer-banner/manage">Manage Offer Banner</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </aside>

    );
};

export default HederSlide;
