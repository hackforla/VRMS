import React, { useState }  from 'react';
import '../../sass/ManageProjects.scss';
import EditableField from './editableField';


const EditProjectInfo  = ( props ) => {

  const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

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
        console.log('resJson: ', resJson);

        return resJson;
    } catch (error) {
        console.log(`update user error: `, error);
        alert("Server not responding.  Please try again.");
    }
  };

  console.log('pte: ', props.projectToEdit);

  return (
    <div>
      <div className="project-list-heading">Project Info for: {props.projectToEdit.name}</div>
      <div className="editable-field-div">Name: 
        <EditableField 
          fieldData={props.projectToEdit.name} 
          fieldName="name" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">Description: 
        <EditableField 
          fieldData={props.projectToEdit.description} 
          fieldName="description" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">Location: 
        <EditableField 
          fieldData={props.projectToEdit.location} 
          fieldName="location" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">GitHub Identifier: 
        <EditableField 
          fieldData={props.projectToEdit.githubIdentifier} 
          fieldName="githubIdentifier" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div> 
      <div className="editable-field-div">GitHib URL: 
        <EditableField 
          fieldData={props.projectToEdit.githubUrl} 
          fieldName="githubUrl" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">Slack URL: 
        <EditableField 
          fieldData={props.projectToEdit.slackUrl} 
          fieldName="slackUrl" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">Google Drive URL: 
        <EditableField 
          fieldData={props.projectToEdit.googleDriveUrl} 
          fieldName="googleDriveUrl" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">Google Drive ID: 
        <EditableField 
          fieldData={props.projectToEdit.googleDriveId} 
          fieldName="googleDriveId" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">HfLA Website URL: 
        <EditableField 
          fieldData={props.projectToEdit.hflaWebsiteUrl} 
          fieldName="hflaWebsiteUrl" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">Video Converence Link: 
        <EditableField 
          fieldData={props.projectToEdit.videoConferenceLink} 
          fieldName="videoConferenceLink" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">Looking For Description: 
        <EditableField 
          fieldData={props.projectToEdit.lookingDescription} 
          fieldName="lookingDescription" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div>
      <div className="editable-field-div">Partners (comma separated): 
        <EditableField 
          fieldData={props.projectToEdit.partners} 
          fieldName="partners" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div> 
      <div className="editable-field-div">Recruiting Categories (comma separated): 
        <EditableField 
          fieldData={props.projectToEdit.recruitingCategories} 
          fieldName="recruitingCategories" 
          updateProject={updateProject}
          setProjectToEdit={props.setProjectToEdit}
          projId={props.projectToEdit._id}
        />
      </div> 
      
      
      <div><button className="button-back" onClick={props.goSelectProject}>Back to Select Project</button></div>
    </div>
  );
};

export default EditProjectInfo;
