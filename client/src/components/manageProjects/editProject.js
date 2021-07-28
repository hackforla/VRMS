import React from 'react';
import '../../sass/ManageProjects.scss';

const EditProjectInfo  = ( props ) => {
  
  //const projectRecurringEvents = props.recurringEvents.filter (rEvents => rEvents.project._id === props.projectToEdit._id );


  return (
    <div>
      <div>Project Info for {props.projectToEdit.name}</div>

        
        {/* This is saved for later.  
        <div className='project-sub-heading'>Team Meetings
          {<ul className='project-list'>
              {projectRecurringEvents.map((result,index) => {
              return (
                  <li className='project-list-item' key={index}>{result.project.name}</li>
              )})}
          </ul>}
        </div> */}

      <div><button className="button-back" onClick={props.goSelectProject}>Back to Select Project</button></div>
    </div>
  );
};

export default EditProjectInfo;
