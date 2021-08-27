import React from "react";
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../utils/globalSettings";

const customHeader = REACT_APP_CUSTOM_REQUEST_HEADER;
const reactProxy = process.env.REACT_APP_PROXY;

const HealthCheck = () => {
  return (
    <div className="flex-container text-center">
        <h3 style={{"text-align": "center"}}>"I'm Alive!"</h3>
        <hr />
        <div>
          <div><strong>REACT_APP_CUSTOM_REQUEST_HEADER</strong>: {customHeader}</div>
          <div><strong>REACT_APP_PROXY</strong>: {reactProxy}</div>
        </div>
    </div>
  );
};

export default HealthCheck;
