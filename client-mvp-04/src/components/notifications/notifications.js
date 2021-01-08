import React from 'react';
import './notifications.scss';
import Button from '../common/button/button';
import { useHistory } from 'react-router-dom';

const Notifications = () => {
  const history = useHistory();

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
      <h3 className="notifications-header">Notifications</h3>
      <div className="notifications">
        <div className="event-data">
          <div>{`${notifications.projectName} ${notifications.meetingName}`}</div>
          <div>{`${notifications.startTime} ${notifications.endTime}`}</div>
        </div>
        <Button
          content={'CHECK IN'}
          className={'btn-accent checkin-btn'}
          onClick={() => history.push('/page')}
        />
      </div>
    </>
  );
};

export default Notifications;
