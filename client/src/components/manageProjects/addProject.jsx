import React from 'react';
import ProjectForm from '../ProjectForm';
import { simpleInputs } from '../data';

function addProject({auth}) {
  return (
    <div>
      <ProjectForm
        arr={simpleInputs}
        formData={null}
        handleChange={null}
        isEdit={false}
        auth={auth}
      />
    </div>
  );
}

export default addProject;
