import React from 'react';
import cx from 'classnames';

import '../sass/Form.scss';

/***********************************************
 * LABEL
 ***********************************************/
export function Label ({ className, ...props }) {
  return (
    <label className={cx(`Label ${props.isRadioParent && 'isRadioParent'}`, className)} {...props} />
  );
}

/***********************************************
 * INPUT TYPES
 ***********************************************/
export const Input = React.forwardRef(({ className, ...props }, ref) => {
  if (props.type === "radio") {
    return (
      <input className={cx('Radio ', className)} type={props.type} ref={ref} {...props} />
    );
  }

  return (
    <input className={cx('Input SupersetInput', className)} type={props.type} ref={ref} {...props} />
  );
})

export function Textarea({ className, ...props }) {
  return (
    <textarea className={cx('Textarea SupersetInput', className)} {...props} />
  )
}

export const Select = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <select className={cx('Select SupersetInput', className)} type={props.type} ref={ref} {...props} />
  );
})

export const Option = React.forwardRef(({ className, ...props}, ref) => {
  return (
    <option className={cx('Option', className)} type={props.type} ref={ref} {...props} />
  );
})

export const OptionPlaceholder = React.forwardRef(({ className, ...props}, ref) => {
  return (
    <option className={cx('OptionPlaceholder', className)} type={props.type} ref={ref} {...props} disabled selected value="" />
  );
})

/***********************************************
 * BUTTONS
 ***********************************************/
export const PrimaryButton = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button className={cx('PrimaryButton', className)} ref={ref} {...props} />
  );
})

export const SecondaryButton = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button className={cx('SecondaryButton', className)} ref={ref} {...props} />
  );
})

export const AuxiliaryButton = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button className={cx('AuxiliaryButton', className)} type="button" ref={ref} {...props} />
  );
})