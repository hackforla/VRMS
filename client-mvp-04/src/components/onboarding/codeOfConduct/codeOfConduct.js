import React, { useState } from 'react';
import './codeOfConduct.scss';
import ProgressBar from '../../common/progressBar/progressBar';

const CodeOfConduct = () => {
  // 2nd step of onboarding process

  const [textContent, setTextContent] = useState('');

  return (
    <>
      <div className="code-of-conduct">
        <div className="code-of-conduct-content custom-scroll-bar">
          <h5>Code of conduct</h5>
          <div>{textContent}</div>
        </div>
      </div>

      <ProgressBar total={6} active={2} />
    </>
  );
};

export default CodeOfConduct;
