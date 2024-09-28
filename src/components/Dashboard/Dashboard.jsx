import { useEffect, useContext, useState  } from "react";
import { UserContext } from "../../context/UserContext";
import DataTable from "./DataTable";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";

const Dashboard = () => {
    const [loader, setLoader] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setLoader(false);
            navigate('/login');
        } else {
            setLoader(false);
        }
    }, [user, navigate ]);

    return (
        <>
            {loader ? <Loader/> : ''}
            {user ? (
                <DataTable />
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default Dashboard;
