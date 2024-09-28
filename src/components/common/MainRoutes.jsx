import { Routes, Route } from "react-router-dom";
import { UserProvider } from "../../context/UserContext";
import FrontLayout from "./FrontLayout";
import Login from "../authentication/Login";
import AdminLayout from "./AdminLayout";
import Dashboard from "../Dashboard/Dashboard";
import Registration from "../authentication/Registration";


function MainRoutes() {
    return (
        <UserProvider>
            <Routes>
                <Route element={<FrontLayout />}>
                    <Route path="/" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<AdminLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </UserProvider>
    );
};

export default MainRoutes;