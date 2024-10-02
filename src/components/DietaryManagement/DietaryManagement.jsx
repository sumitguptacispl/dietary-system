import { useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import DietaryDataTable from "./DietryDataTable";

const DietaryManagement = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <>
            {user ? (
                <DietaryDataTable/>
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}

export default DietaryManagement;