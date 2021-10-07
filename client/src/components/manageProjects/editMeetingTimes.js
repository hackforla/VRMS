import React, { useState }  from 'react';
import '../../sass/ManageProjects.scss';
// import EditableField from './editableField';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../../utils/globalSettings";

const EditMeetingTimes  = (props) => {

  return (
    <div>
	    <div className="project-list-heading">Project: {props.projectToEdit.name}</div>

      <div><button className="button-back" onClick={props.goSelectProject}>Back to Select Project</button></div>
      <div><button className="button-back" onClick={props.goSelectProject}>Back to Select Project</button></div>
    </div>
  );

};

export default EditMeetingTimes;