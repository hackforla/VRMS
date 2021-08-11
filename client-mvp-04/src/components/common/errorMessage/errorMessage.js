import React from 'react';

const ErrorMessage = ({ content }) => {
  return (
    <p data-testid="error-message" className="error-message">
      {content}
    </p>
  );
};

export default ErrorMessage;
