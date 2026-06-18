// Form.jsx contains several unused components, including abstractions for button and form elements.
// They are not currently being used in the codebase.

import React from "react";

import "../sass/Form.scss";

/***********************************************
 * LABEL
 ***********************************************/
export function Label({ className, isRadioParent, ...props }) {
  return <label className={`Label ${isRadioParent && 'isRadioParent'}`} {...props} />;
}

/***********************************************
 * INPUT TYPES
 ***********************************************/
export const Input = React.forwardRef(({ className, ...props }, ref) => {
  if (props.type === "radio") {
    return <input className="Radio " type={props.type} ref={ref} {...props} />;
  } else {
    return (
      <input
        className={`Input SupersetInput inline ${props.size !== 'large' && 'small'}`}
        type={props.type}
        ref={ref}
        {...props}
      />
    );
  }
});

export function Textarea({ className, ...props }) {
  return <textarea className="Textarea SupersetInput" {...props} />;
}

export const Select = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <select
      className="Select SupersetInput small"
      type={props.type}
      ref={ref}
      {...props}
    />
  );
});

export const Option = React.forwardRef(({ className, ...props }, ref) => {
  return <option className="Option" type={props.type} ref={ref} {...props} />;
});

export const OptionPlaceholder = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <option
        className="OptionPlaceholder"
        type={props.type}
        ref={ref}
        {...props}
        disabled
        value=""
      />
    );
  }
);

/***********************************************
 * BUTTONS
 ***********************************************/

export const SecondaryButton = React.forwardRef(
  ({ className, ...props }, ref) => {
    return <button className="SecondaryButton center" ref={ref} {...props} />;
  }
);

export const AuxiliaryButton = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <button
        className="AuxiliaryButton inline"
        type="button"
        ref={ref}
        {...props}
      />
    );
  }
);
