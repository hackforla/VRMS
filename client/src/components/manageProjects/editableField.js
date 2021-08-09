import React, { useState } from 'react';
import '../../sass/ManageProjects.scss';


const EditableField  = (
    { projId, fieldData, fieldName, updateProject, setProjectToEdit }
) => {
  const [fieldValue, setFieldValue] = useState(fieldData);

  return (
    <div>
      <input 
        type="text"
        className="editable-field"
        value={fieldValue}
        onBlur={(e)=>{
          updateProject(projId, fieldName, fieldValue)
          //.then(proj => {setProjectToEdit(proj)})
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
    </div>
  );
};

export default EditableField;
