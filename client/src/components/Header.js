import React from 'react';
import cx from 'classnames';
import '../sass/Headers.scss';

export function HeaderBarTextOnly ({ className, children, ...props }) {
  return (
    <div className={cx('HeaderBarTextOnly', className)} {...props}>
      <p>{children}</p>
    </div>
  );
}
