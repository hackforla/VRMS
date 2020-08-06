import React from "react";

const eventOverview = props => {
  let eventsByType = [];
  for (let key in props.chartTypes) {
    eventsByType.push(key);
  }

  return (
    <div className="dashboard-header">
      <p className="dashboard-header-text-large">Events Overview</p>

      <form
        className="form-stats"
        autoComplete="off"
        onSubmit={e => e.preventDefault()}
      >
        <div className="stats-form-row">
          <div className="stats-form-input-text">
            <div className="stat-select">
              <label htmlFor="whichBrigade">Chart By Event Type:</label>
              <select
                name="whichBrigade"
                aria-label="topic"
                onChange={props.handleChartTypeChange}
                required
              >
                {eventsByType.map((eventByType, index) => {
                  return (
                    <option key={index} value={eventByType}>
                      {eventByType}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default eventOverview;
