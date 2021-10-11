import React, { useState }  from 'react';
import '../../sass/ManageProjects.scss';
import EditableField from './editableField';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../../utils/globalSettings";


const EditProjectInfo  = ( props ) => {

  const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;

  //const [currentProjectData, setCurrentProjectData] = useState(props.projectToEdit);

  const updateProject = async (projectId, fieldName, fieldValue) => {

    // These field are arrays, but the form makes them comma separated strings, so this adds it back to db as an arrray.
    if (fieldName === 'partners' || fieldName === 'recruitingCategories') {  
      if (!Array.isArray(fieldValue)) {
        fieldValue = fieldValue
        .split(',')
        .filter(x => x !== "")
        .map(y => y.trim());
      }
    }
    
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


  // Add commas to arrays for display
  const partnerDataFormatted = props.projectToEdit.partners.join(", ");
  const recrutingDataFormatted = props.projectToEdit.recruitingCategories.join(", ");
  

  return (

    
    <div>
      <div className="project-list-heading">Project: {props.projectToEdit.name}</div>

      <div><button className="button-back" onClick={props.meetingSelectClickHandler}>Edit Meeting Times</button></div>
    
      <div>
        <EditableField 
          fieldData={props.projectToEdit.name} 
          fieldName="name" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="Name:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.description} 
          fieldName="description" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="textarea"
          fieldTitle="Description:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.location} 
          fieldName="location" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="Location:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.githubIdentifier} 
          fieldName="githubIdentifier" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="GitHub Identifier:"
        />
      </div> 
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.githubUrl} 
          fieldName="githubUrl" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="GitHib URL:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.slackUrl} 
          fieldName="slackUrl" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="Slack URL:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.googleDriveUrl} 
          fieldName="googleDriveUrl" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="Google Drive URL:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.googleDriveId} 
          fieldName="googleDriveId" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="Google Drive ID:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.hflaWebsiteUrl} 
          fieldName="hflaWebsiteUrl" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="HfLA Website URL:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.videoConferenceLink} 
          fieldName="videoConferenceLink" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="Video Converence Link:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={props.projectToEdit.lookingDescription} 
          fieldName="lookingDescription" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="Looking For Description:"
        />
      </div>
      <div className="editable-field-div">
        <EditableField 
          fieldData={partnerDataFormatted} 
          fieldName="partners" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="Partners (comma separated):"
        />
      </div> 
      <div className="editable-field-div">
        <EditableField 
          fieldData={recrutingDataFormatted} 
          fieldName="recruitingCategories" 
          updateProject={updateProject}
          renderUpdatedProj={props.renderUpdatedProj}
          projId={props.projectToEdit._id}
          fieldType="text"
          fieldTitle="Recruiting Categories (comma separated):"
        />
      </div> 
      
      
      <div><button className="button-back" onClick={props.goSelectProject}>Back to Select Project</button></div>
    </div>
  );
};

export default EditProjectInfo;
