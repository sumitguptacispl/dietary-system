import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

import 'antd/dist/reset.css';
import "../../css/page-login-alt.css";

const FrontLayout = () => {
    return (
    <div className="login-page">
        <div className="blankpage-form-field">
            <div className="page-logo m-0 w-100 align-items-center justify-content-center rounded border-bottom-left-radius-0 border-bottom-right-radius-0 px-4">
                <Link 
                    to="#" 
                    className="page-logo-link press-scale-down d-flex align-items-center"
                    style={{ fontSize: '24px', fontWeight: 'bold' }}
                >Dietary System
                </Link>
            </div>
            <Outlet />
        </div>
    </div>
  );
}

export default FrontLayout;
