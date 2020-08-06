import React from "react";

const eventOverview = props => {
  let brigades = [];
  for (let keys in props.uniqueLocations) {
    brigades.push(keys);
  }

  return (
    <div className="dashboard-header">
      <p className="dashboard-header-text-large">HackforLA Overview</p>

      <form
        className="form-stats"
        autoComplete="off"
        onSubmit={e => e.preventDefault()}
      >
        <div className="stats-form-row">
          <div className="stats-form-input-text">
            <div className="stat-select">
              <label htmlFor="whichBrigade">Location:</label>
              <select
                name="whichBrigade"
                aria-label="topic"
                onChange={props.handleBrigadeChange}
                required
              >
                {brigades.map((brigade, index) => {
                  return (
                    <option key={index} value={brigade}>
                      {brigade}
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
