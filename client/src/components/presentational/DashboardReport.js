import React from "react";

const DashboardReport = (props) => {
  console.log(props.total);

  return (
    <div className="dashboard-report">
      <div className="stat-header">
        <p class="stat-header-text">Total Signins:{props.total.All}</p>
      </div>
      <div className="stat-number"></div>
    </div>
  );
};

export default DashboardReport;
