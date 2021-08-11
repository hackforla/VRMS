import React from 'react';
import './title.scss';

const Title = () => {
  return (
    <div data-testid="title" className="title-container">
      <h1 className="title-short">VRMS</h1>
      <h2 className="title-long">Volunteer Relationship Management System</h2>
    </div>
  );
};

export default Title;
