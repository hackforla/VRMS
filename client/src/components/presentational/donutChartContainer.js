import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DonutChartContainer = props => {
  const ref = useRef(props.donutRef);
  const pieData = [];
  console.log("UNIQUE LOCATIONS", props.uniqueLocations);
  for (let keys in props.uniqueLocations) {
    let newValue = props.uniqueLocations[keys].length;
    pieData.push({ value: newValue, color: "#2A768A" });
  }
  console.log("PIE DATA", pieData);
  const createPie = d3
    .pie()
    .value(d => d.value)
    .sort(null);

  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);

  const format = d3.format(".2f");

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
  }, [props.uniqueLocations]);

  return (
    <div className="dashboard-stats">
      <div className="dashboard-stat-container">
        <div className="stat-header">
          <p className="stat-header-text">{props.chartName}:</p>
        </div>
        <div className="stat-number">
          <p>{props.chartNumber}</p>
        </div>
      </div>

      <div className="dashboard-chart-container">
        <div className="donut-container">
          <svg className="donut" width={160} height={160}>
            <g ref={ref} transform={`translate(${80} ${80})`} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DonutChartContainer;
