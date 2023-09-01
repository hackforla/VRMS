import React from 'react';
import ProjectForm from '../ProjectForm';
import { simpleInputs } from '../data';

function addProject() {
  return (
    <div>
      <ProjectForm
        arr={simpleInputs}
        formData={null}
        handleChange={null}
        isEdit={false}
      />
    </div>
  );
}

export default addProject;
