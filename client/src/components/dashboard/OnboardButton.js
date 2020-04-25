import React from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const OnboardButton = ({ type }) => {
    // let style = "";
    // switch (type) {
    //     case "github":
    //         style = styles.onboardButton;
    //     default:
    // }
    let icon = {};
    switch (type) {
        case "github":
            icon = { prefix: "fab", iconName: "github" };
            break;
        case "google-drive":
            icon = { prefix: "fab", iconName: "google-drive" };
            break;
        case "google-sheets":
            icon = { prefix: "fas", iconName: "table" };
            break;
        default:
            icon = {};
    }
    return (
        <div className={styles.onboardButton}>
            <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        </div>
    );
};

export default OnboardButton;
