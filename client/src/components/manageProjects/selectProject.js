import React from 'react';
import '../../sass/ManageProjects.scss'

const SelectProject  = ( props ) => { 

  // If access level is 'admin', display all active projects.
  // If access level is 'user' display user managed projects.
  let managedProjects = []; 
  switch (props.accessLevel) {
    case 'admin':
      managedProjects = props.projects.filter (projects => projects.projectStatus === 'Active')
      .sort((a,b) => a.name.localeCompare(b.name))
      .map((p) => <div onClick={props.projectSelectClickHandler(p)}>{p.name}</div>)
      ;
      break;
    case 'user':
      managedProjects = props.projects.filter((projects) =>
      props.user?.managedProjects.includes(projects._id)
      )
      .sort((a,b) => a.name.localeCompare(b.name))
      .map((p) => <div onClick={props.projectSelectClickHandler(p)}>{p.name}</div>)
      ;
      break;
    default:
      // Do nothing.
  }

    return (
      <div className='container--ManageProjects'>

        <h3>Manage Projects</h3>
        <div className='project-sub-heading'>Select project to edit</div>
        {<ul className='project-list'>
            {managedProjects.map((result,index) => {
            return (
                <li className='project-list-item' key={index}>{result}</li>
            )})}
        </ul>}
      </div>
    );
};

export default SelectProject; 
