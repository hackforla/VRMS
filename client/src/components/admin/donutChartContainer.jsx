import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import "../../sass/Dashboard.scss";

const DonutChartContainer = (props) => {
  const ref = useRef(null);
  const pieData = [];
  const pieNames = [];
  let count = 0;
  let total = 0;
  const chartColors = [
    '#3f7589',
    '#172d47',
    '#bd3346',
    '#999999',
    '#d9d9d9',
    '#c88a95',
  ];

  for (let key in props.data) {
    let newValue = props.data[key];
    let color = chartColors[count];
    count++;
    total += newValue;
    pieData.push({ value: newValue, color: color });
    pieNames.push(
      <div className="key-info-container" key={count}>
        <div
          className="key-color"
          style={{ backgroundColor: `${color}` }}
        >
        </div>
        <div className="key-location">
          <p>
            {key}: {newValue}
          </p>
        </div>
      </div>
    );
  }
  total = Math.round(100 * total) / 100;

  
  useEffect(() => {
    const createPie = d3
      .pie(pieData)
      .value((d) => d.value)
      .sort(null);
  
    const createArc = d3.arc().innerRadius(40).outerRadius(80);
    
    const data = createPie(pieData);

    const group = d3.select(ref.current);
    const groupWithData = group.selectAll("g.arc").data(data);

    groupWithData.exit().remove();

    const groupWithUpdate = groupWithData
      .enter()
      .append("g")
      .attr("class", "arc");

    const path = groupWithUpdate
      .append("path")
      .merge(groupWithData.select("path.arc"));

    path
      .attr("class", "arc")
      .attr("d", createArc)
      .attr("fill", (d, i) => {
        const { data } = d;
        return data.color;
      });
  }, [props, pieData]);

  return (
    <div className="dashboard-stats">
      <div className="dashboard-stat-container">
        <div className="stat-header">
          <p className="stat-header-text">{props.chartName}:</p>
        </div>
        <div className="stat-number">{total}</div>
      </div>
      <div className="dashboard-chart-container">
        <div className="donut-container">
          <svg className="donut" width={160} height={160}>
            <g ref={ref} transform={`translate(${80} ${80})`} />
          </svg>
        </div>
        <div className="key-wrapper">
          <div className="key-container">{pieNames}</div>
        </div>
      </div>
    </div>
  );
};

export default DonutChartContainer;
