import React from 'react';
import './notifications.scss';
import Button from '../common/button/button';

const Notifications = () => {
  // While API for notifications is not implemented, uses mock data
  const dateValue1 = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
  });
  const dateValue2 = '7 - 8pm'; //mock time
  const notifications = {
    projectName: 'VRMS',
    meetingName: 'Weekly Meeting',
    startTime: dateValue1,
    endTime: dateValue2,
  };

  return (
    <>
      <h3>Notifications</h3>
      <div className="notifications">
        <div className="project-data">
          <div>{`${notifications.projectName} ${notifications.meetingName}`}</div>
          <div>{`${notifications.startTime} ${notifications.endTime}`}</div>
        </div>
        <Button content={'CHECK IN'} className={'btn-accent'} />
      </div>
    </>
  );
};

export default Notifications;
