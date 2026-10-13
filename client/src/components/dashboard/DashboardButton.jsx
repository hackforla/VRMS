import React from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";

const DashboardButton = (props) => {
    return (
        <button className={styles.dashboardButton} onClick={props.clicked}>
            {props.children}
        </button>
    );
};

export default DashboardButton;
