import React, { useState } from 'react';
import '../../sass/ManageProjects.scss';


const EditableField  = (
    { projId, fieldData, fieldName, updateProject, setProjectToEdit }
) => {
  const [editable, setEditable] = useState(true)
  const [fieldValue, setFieldValue] = useState(fieldData)
  return (
    <div>
        { editable ? (
                <input 
                    type="text"
                    className="input section-name-input edit-section"
                    value={fieldValue}
                    onBlur={(e)=>{
                        updateProject(projId, fieldName, fieldValue).then(proj => {console.log(proj); setProjectToEdit(proj)})
                        setEditable(false)
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
            ) : (
                <h4 className="section-name">
                    {fieldData}
                </h4>
            )
            }
    </div>
  );
};

export default EditableField;
