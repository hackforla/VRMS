import React from "react";
import "../sass/Headers.scss";

export function HeaderBarTextOnly({ className, children, ...props }) {
  return (
    <div className="HeaderBarTextOnly" {...props}>
      <p>{children}</p>
    </div>
  );
}
