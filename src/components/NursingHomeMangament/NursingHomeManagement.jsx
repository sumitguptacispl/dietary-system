import { useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import NursingHomeDatatable from "./NursingHomeDatatable";

const NursingHomeManagement = () => {
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
                <NursingHomeDatatable/>
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}

export default NursingHomeManagement;