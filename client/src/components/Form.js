import React from "react";

import "../sass/Form.scss";

/***********************************************
 * LABEL
 ***********************************************/
export function Label({ className, ...props }) {
  return <label className="Label isRadioParent" {...props} />;
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
        className="Input SupersetInput small inline"
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
        selected
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
