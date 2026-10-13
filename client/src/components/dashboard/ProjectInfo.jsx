import React from "react";

const ProjectInfo = ({ project }) => {
    return (
        <div className="dashboard-header">
            <p className="dashboard-header-text-small">
                {project.projectId.name}
            </p>
            <p className="dashboard-header-text-medium">
                Project Leader Dashboard
            </p>
        </div>
    );
};

export default ProjectInfo;