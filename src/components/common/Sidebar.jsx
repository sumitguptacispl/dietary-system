import { useContext } from 'react';
import { Link } from "react-router-dom";
import coverBG from "../../images/cover-2-lg.png";
import heartLogo from "../../images/heart.png";
import "../../styles/style.css";
import { UserContext } from "../../context/UserContext";

const Sidebar = () => {
    const { user } = useContext(UserContext);
    //const [isVisible, setIsVisible] = useState(false);
    /*const toggleDisplay = () => {
        setIsVisible((prevIsVisible) => !prevIsVisible);
    };*/
    return (
        <>
            <aside className="page-sidebar sidebaropen">
                <div className="page-logo">
                    <Link to="/dashboard">
                        Dietary System
                    </Link>
                    {window.innerWidth < 860 && (
                    <a href="#" className="btn btn-pills btn-danger" style={{ marginLeft: "15px" }} data-class="mobile-nav-on">
                        <i className="ni ni-minify-nav" style={{ marginLeft: "-15px" }}></i>
                    </a>
                    )}
                </div>
                <nav id="js-primary-nav" className="primary-nav" role="navigation">
                    <div className="info-card">
                        <img
                            src={heartLogo}
                            className="profile-image rounded-circle"
                            alt="School Logo"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = {heartLogo};
                            }}
                        />
                        <div className="info-card-text">
                            <a className="d-flex align-items-center text-white">
                            {user ? user.name : 'User'} 
                        </a>
                        </div>
                        <img src={coverBG} className="cover" alt="cover" />
                        <a href="#" className="pull-trigger-btn" data-action="toggle" data-class="list-filter-active" data-target=".page-sidebar" data-focus="nav_filter_input">
                            <i className="fal fa-angle-down"></i>
                        </a>
                    </div>
                    <ul id="js-nav-menu" className="nav-menu">
                        <li>
                            <Link to="/dashboard">
                                <i className="fal fa-home"></i>
                                <span className="nav-link-text">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fal fa-heart"></i>
                                <span className="nav-link-text">Dietary Management</span>
                                {/* <b className="collapse-sign"><em className={menu1 ? "fal fa-angle-up" : "fal fa-angle-down"}></em></b> */}
                            </Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fal fa-user"></i>
                                <span className="nav-link-text">User Management</span>
                                {/* <b className="collapse-sign"><em className={menu1 ? "fal fa-angle-up" : "fal fa-angle-down"}></em></b> */}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;