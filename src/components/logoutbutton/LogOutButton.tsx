import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../logoutbutton/LogOutButton.module.css";

const LogOutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <button className={styles.logoutButton} onClick={handleLogout}>
            Logga ut
        </button>
    );
};

export default LogOutButton;