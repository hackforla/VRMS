import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import "../../sass/Dashboard.scss";

const DonutChartContainer = (props) => {
  const ref = useRef(null);
  const pieData = [];
  const pieNames = [];
  let count = 0;
  let total = 0;
  for (let keys in props.data) {
    count++;
    let newValue = props.data[keys];
    let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    total += newValue;
    pieData.push({ value: newValue, color: randomColor });
    pieNames.push(
      <div className="key-info-container" key={count}>
        <div
          className="key-color"
          style={{ backgroundColor: `${randomColor}` }}
        ></div>
        <div className="key-location">
          <p>
            {keys}: {newValue}
          </p>
        </div>
      </div>
    );
  }
  total = Math.round(100 * total) / 100;
  console.log("TOTAL", total);
  const createPie = d3
    .pie(pieData)
    .value((d) => d.value)
    .sort(null);

  const createArc = d3.arc().innerRadius(40).outerRadius(80);

  useEffect(() => {
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
  }, [props]);

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
