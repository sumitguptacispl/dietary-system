import { useState, useEffect } from "react";
import UserDataTable from "./UserDataTable";
import { apiPost } from "../../hooks/Api";
import { ErrorNotificationMsg } from "../../hooks/NotificationHelper";

const UserManagement = () => {
    const [userList, setUserList ] = useState([]);
    async function getUserList(){
        try {
            const response = await apiPost('/get-user-list', {});
            if(response.status === true) {
                setUserList(response.data);
            }
        } catch {
            ErrorNotificationMsg("Something went wrong!!");
        }
    }
    useEffect(() => {
        getUserList();
    }, []);

    return (
        <>
            <UserDataTable data={userList}/>
        </>
    )
}

export default UserManagement;