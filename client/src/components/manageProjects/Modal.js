import React from 'react';

const Modal = (props) => {
  console.log(props);
  return (
    <div>
      {' '}
      This is Modal <button onClick={props.handleClose}>close</button>
    </div>
  );
};

export default Modal;
