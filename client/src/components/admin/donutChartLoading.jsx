import React from "react";
import Loading from "../../svg/22.gif";

import "../../sass/Dashboard.scss";

const DonutChartLoading = (props) => (
  <div className="dashboard-stats">
    <div className="dashboard-stat-container">
      <div className="stat-header">
        <p className="stat-header-text"></p>
      </div>
      <div className="stat-number"></div>
    </div>
    <div className="dashboard-chart-container">
      <img src={Loading} alt="Logo" />
    </div>
  </div>
);

export default DonutChartLoading;
