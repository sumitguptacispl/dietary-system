import { useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import userIcon from "../../images/userIcon.jpg";
import { UserContext } from "../../context/UserContext";
import 'antd/dist/reset.css';
import { SuccessNotificationMsg } from "../../hooks/NotificationHelper";

const AdminLayout = () => {
    const { user } = useContext(UserContext);
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => {
    if (window.innerWidth > 860 && isSidebarOpen) {
        return true;
    }
    setSidebarOpen(!isSidebarOpen);
};

const handleLogout = () => {
    logout();
    SuccessNotificationMsg("Success", "Logged out successfully");
    navigate('/login');
};

return (
    <div className="page-wrapper mod-nav-link">
        <div className="page-inner">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
            <div className="page-content-wrapper">
                <header className="page-header">
                    {window.innerWidth < 860 ?
                        <div className="hidden-lg-up">
                            <a href="#" onClick={toggleSidebar} className="header-btn btn waves-effect waves-themed" data-action="toggle" data-class="mobile-nav-on">
                                <i className="ni ni-menu"></i>
                            </a>
                        </div>
                        :
                        <div className="hidden-md-down position-relative">
                            <a href="#" onClick={toggleSidebar} className="header-btn btn js-waves-off" data-action="toggle" data-class="nav-function-hidden" title="Hide Navigation">
                                <i className="ni ni-menu"></i>
                            </a>
                        </div>
                    }
                    <div className="ml-auto d-flex">
                        <div>
                            <a
                                href="#"
                                data-toggle="dropdown"
                                title={user ? user.name : 'User'}
                                className="header-icon d-flex align-items-center justify-content-center ml-2 "
                            >
                                <img
                                    src={userIcon}
                                    className="profile-image rounded-circle"
                                    alt="User"
                                />
                            </a>
                            <div className="dropdown-menu dropdown-menu-animated dropdown-lg">
                                <div className="dropdown-header bg-trans-gradient d-flex flex-row py-4 rounded-top">
                                    <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                                        <span className="mr-2">
                                            <img
                                                src={userIcon}
                                                className="rounded-circle profile-image"
                                                alt="Sumit Gupta"
                                            />
                                        </span>
                                        <div className="info-card-text">
                                            <div className="fs-lg break-text">
                                                {user ? user.name : 'User'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown-divider m-0"></div>
                                    {/* <ChangePassword /> */}
                                <div className="dropdown-divider m-0"></div>
                                <span
                                    // onClick={logout}
                                    className="dropdown-item fw-500 pt-3 pb-3"
                                >
                                    <span onClick={handleLogout} >Logout</span>
                                    <span className="float-right fw-n">
                                        Phone: {user ? user.phone : '1234567890'}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </header>
                <main id="js-page-content" role="main" className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    </div>
  );
};

export default AdminLayout;