import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (data) => {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
