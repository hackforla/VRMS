import React, { useState, useRef, useEffect } from 'react';
import '../../sass/ManageProjects.scss';



const EditableField  = (
    { projId, fieldData, fieldName, updateProject, renderUpdatedProj, fieldType, fieldTitle }
) => {
  const [fieldValue, setFieldValue] = useState(fieldData);
  const [editable, setEditable] = useState(false);
  const ref = useRef(); 

  // Update the displayed results to match the change just made to the db
  useEffect(() => {      
    if (editable) {
      ref.current.focus();
      setFieldValue(fieldData);
    } 
  },[editable]);

  return (
    <div>
      <div>{fieldTitle}<span className="project-edit-button" onClick={() => setEditable(true)} > [edit]</span></div>
      {editable ?
      
        (fieldType === "textarea") ?
          <textarea
            ref={ref}
            className="editable-field"
            onBlur={(e)=>{
              updateProject(projId, fieldName, fieldValue)
              .then(proj => {renderUpdatedProj(proj); setEditable(false)})
            }}
            onChange={e=>{
              setFieldValue(e.target.value)
              const input = e.target;
              const onEnterKey = (e) => {
                if (e.keyCode === 13) {
                  input.removeEventListener('keydown', onEnterKey)
                  input.blur();
                }
              }
              input.addEventListener('keydown', onEnterKey)
            }}
          >{fieldValue}</textarea>
        :
        <input 
          ref={ref}
          type="text"
          className="editable-field"
          value={fieldValue}
          onBlur={(e)=>{
            updateProject(projId, fieldName, fieldValue)
            .then(proj => {renderUpdatedProj(proj); setEditable(false)})
          }}
          onChange={e=>{
            setFieldValue(e.target.value)
            const input = e.target;
            const onEnterKey = (e) => {
              if (e.keyCode === 13) {
                input.removeEventListener('keydown', onEnterKey)
                input.blur();
              }
            }
            input.addEventListener('keydown', onEnterKey)
          }}
        />
      : <div className="section-content">{fieldData}</div>
      }  
    </div>
  );
};

export default EditableField;
