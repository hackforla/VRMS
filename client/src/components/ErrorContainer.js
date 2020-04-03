import React from 'react';
import cx from 'classnames';

import '../sass/ErrorContainer.scss';

export function ErrorContainer ({ className, ...props }) {
  return (
    <div className={cx('ErrorContainer', className)} {...props} />
  );
}