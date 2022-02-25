import React from 'react';
import EditableField from './editableField';
import '../../sass/ManageProjects.scss';

// Need to hold user state to check which type of user they are and conditionally render editing fields in this component
// for user level block access to all except for the ones checked
const EditProject = ({
  projectToEdit,
  meetingSelectClickHandler,
  userAccessLevel,
  updateProject,
  goSelectProject,
}) => {
  // Add commas to arrays for display
  const partnerDataFormatted = projectToEdit.partners.join(', ');
  const recrutingDataFormatted = projectToEdit.recruitingCategories.join(', ');

  /* eslint-disable no-underscore-dangle */
  return (
    <div>
      <div className="project-list-heading">{`Project: ${projectToEdit.name}`}</div>
      <div>
        <button
          type="button"
          className="button-back"
          onClick={meetingSelectClickHandler}
        >
          Edit Meeting Times
        </button>
      </div>
      <EditableField
        fieldData={projectToEdit.name}
        fieldName="name"
        updateProject={updateProject}
        fieldTitle="Name:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.description}
        fieldName="description"
        updateProject={updateProject}
        fieldType="textarea"
        fieldTitle="Description:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.location}
        fieldName="location"
        updateProject={updateProject}
        fieldTitle="Location:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.githubIdentifier}
        fieldName="githubIdentifier"
        updateProject={updateProject}
        fieldTitle="GitHub Identifier:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.githubUrl}
        fieldName="githubUrl"
        updateProject={updateProject}
        fieldTitle="GitHib URL:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.slackUrl}
        fieldName="slackUrl"
        updateProject={updateProject}
        fieldTitle="Slack URL:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.googleDriveUrl}
        fieldName="googleDriveUrl"
        updateProject={updateProject}
        fieldTitle="Google Drive URL:"
        accessLevel={userAccessLevel}
        canEdit={['admin', 'user']}
      />
      <EditableField
        fieldData={projectToEdit.googleDriveId}
        fieldName="googleDriveId"
        updateProject={updateProject}
        fieldTitle="Google Drive ID:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.hflaWebsiteUrl}
        fieldName="hflaWebsiteUrl"
        updateProject={updateProject}
        fieldTitle="HfLA Website URL:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.videoConferenceLink}
        fieldName="videoConferenceLink"
        updateProject={updateProject}
        fieldTitle="Video Conference Link:"
        accessLevel={userAccessLevel}
        canEdit={['admin', 'user']}
      />
      <EditableField
        fieldData={projectToEdit.lookingDescription}
        fieldName="lookingDescription"
        updateProject={updateProject}
        fieldTitle="Looking For Description:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={partnerDataFormatted}
        fieldName="partners"
        updateProject={updateProject}
        fieldTitle="Partners (comma separated):"
        accessLevel={userAccessLevel}
        canEdit={['admin', 'user']}
      />
      <EditableField
        fieldData={recrutingDataFormatted}
        fieldName="recruitingCategories"
        updateProject={updateProject}
        fieldTitle="Recruiting Categories (comma separated):"
        accessLevel={userAccessLevel}
      />
      <button type="button" className="button-back" onClick={goSelectProject}>
        Back to Select Project
      </button>
    </div>
  );
  /* eslint-enable no-underscore-dangle */
};

export default EditProject;
