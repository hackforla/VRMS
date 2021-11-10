import React, { useState, useEffect } from 'react';
import '../../sass/ManageProjects.scss';


const CreateNewEvent  = ( { 
  handleEventCreate 
} ) => {

  const [displayForm, setDisplayForm] = useState(false);

  const handleFormDisplay = () => {
    setDisplayForm(true);
  }
  const cancelFormDisplay = () => {
    setDisplayForm(false);
  }

  const handleCreateClick = () => {
    setDisplayForm(false);
    handleEventCreate();
  }

  const handleFormSubmit = (event) => {
    console.log('form event: ', event);
  }

  if (displayForm){
    return (
      <div className="display-events">
        <div>
          <div>
            <h3>Create New Meeting</h3>
            <form onSubmit={handleFormSubmit}>
              <input
                placeholder='meeting description...'
              />
              <button type="submit">Add New Event</button>
            </form>

          </div>
          <div><span className="project-edit-button" onClick={() => {handleCreateClick()}} >[Create Event]</span></div>
          </div>
        <div><span className="project-edit-button" onClick={() => {cancelFormDisplay()}} >[Cancel]</span></div>
      </div>
    ) 
  } else {
    return (
      <div className="display-events">
        <span className="project-edit-button" onClick={() => {handleFormDisplay()}} >[Create New Event]</span>
      </div>
    )
  }
};

export default CreateNewEvent;