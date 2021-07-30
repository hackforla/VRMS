import React from 'react';
import '../../sass/ManageProjects.scss';
import EditableField from './editableField';


const EditProjectInfo  = ( props ) => {

  const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

  const updateProject = async (projectId, fieldName, fieldValue) => {
    
    // Update database
    const url = `/api/projects/${projectId}`;
    const requestOptions = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "x-customrequired-header": headerToSend
        },
        body: JSON.stringify({ [fieldName]: fieldValue })
    };

    try {
        const response = await fetch(url, requestOptions); 
        const resJson = await response.json();
        return resJson;
    } catch (error) {
        console.log(`update user error: `, error);
        alert("Server not responding.  Please try again.");
    }
  };

  return (
    <div>
      <EditableField 
        fieldData={props.projectToEdit.name} 
        fieldName="name" 
        updateProject={updateProject}
        setProjectToEdit={props.setProjectToEdit}
        projId={props.projectToEdit._id}
      />
      <div>Project Info for {props.projectToEdit.name}</div>

      <div><button className="button-back" onClick={props.goSelectProject}>Back to Select Project</button></div>
    </div>
  );
};

export default EditProjectInfo;
