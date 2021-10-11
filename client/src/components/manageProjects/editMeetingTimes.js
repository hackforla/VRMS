import React, { useState, useEffect }  from 'react';
import '../../sass/ManageProjects.scss';
// import EditableField from './editableField';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../../utils/globalSettings";

const EditMeetingTimes  = (props) => {

  const [rEvents, setREvents] = useState([]);

  const thisProjectRecurringEvents = (projectToEditID) => { 
 
    setREvents(props.recurringEvents.filter(e => (e?.project._id === projectToEditID)));

  }

  useEffect(() => {
    thisProjectRecurringEvents(props.projectToEdit._id);
}, [])

  return (
    <div>
	    <div className="project-list-heading">Project: {props.projectToEdit.name}</div>

      {rEvents.map(rEvent => (
        <div>
          <div>Description: {rEvent.description}</div>
          <div>Day: {rEvent.date}</div>
          <div>Start Time: {rEvent.startTime} </div>
          <div>End Time: {rEvent.endTime} </div>
        </div>
      ))}

      <div><button className="button-back" onClick={props.goEditProject}>Back to Edit Project</button></div>
      <div><button className="button-back" onClick={props.goSelectProject}>Back to Select Project</button></div>
    </div>
  );

};

export default EditMeetingTimes;