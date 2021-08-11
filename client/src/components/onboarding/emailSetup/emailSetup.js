import React from 'react';
import { useHistory } from 'react-router-dom';
import ProgressBar from '../../common/progressBar/progressBar';
import Button from '../../common/button/button';

const EmailSetup = () => {
  /**
   * 1st step of onboarding process
   */
  // *** This is a dummy page for this step
  const history = useHistory();
  return (
    <>
      <h3>Onboarding - 1st step</h3>
      <h4>Google Drive Set Up</h4>
      <div>(dummy page)</div>
      <Button
        type={'button'}
        content={'Move to the 2nd step'}
        className={'create-account-button'}
        onClick={() => history.push('/onboarding/code-of-conduct')}
      />
      <div style={{ marginBottom: '100px' }} />

      <ProgressBar total={6} active={1} />
    </>
  );
};

export default EmailSetup;
