import React from "react";

const ProjectInfo = ({ project }) => {
    // console.log('ATTENDEETABLE ATTENDEES', attendees);
    
    return (
        <div className="dashboard-header">
            <p className="dashboard-header-text-large">
                {project.projectId.name}
            </p>
        </div>
    );
};

export default ProjectInfo;