import * as React from "react";
import { AbstractChart, AbstractImage } from "../../../src/index";
import * as PromasterReact from "../../../../promaster-react/src/index";

function getRange(
  series: AbstractChart.ChartLine[],
  axisSelector: (point: AbstractImage.Point) => number
): [number, number] {
  const axisValues = series.map(serie => serie.points.map(axisSelector)).reduce(
    (soFar, current) => {
      return [...soFar, ...current];
    },
    [] as ReadonlyArray<number>
  );
  return [Math.min(...axisValues), Math.max(...axisValues)];
}

export function AbstractChartExample(): JSX.Element {
  const series = [
    AbstractChart.createChartLine({
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 1.5 },
        { x: 4, y: 1 },
        { x: 5, y: 0 },
        { x: 6, y: 0 },
        { x: 7, y: 0 },
        { x: 8, y: 0 }
      ],
      color: AbstractImage.red,
      label: "How bad you feel",
      xAxis: "bottom",
      yAxis: "left"
    }),
    AbstractChart.createChartLine({
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 1 },
        { x: 4, y: 2 },
        { x: 5, y: 3 },
        { x: 6, y: 2.8 },
        { x: 7, y: 2 },
        { x: 8, y: 1.5 }
      ],
      color: AbstractImage.blue,
      label: "How bad you sound",
      xAxis: "bottom",
      yAxis: "left"
    })
  ];

  const [xMin, xMax] = getRange(series, point => point.x);
  const [yMin, yMax] = getRange(series, point => point.y);

  const chart = AbstractChart.createChart({
    chartLines: series,
    xAxisBottom: AbstractChart.createLinearAxis(xMin, xMax, "Days with cold"),
    yAxisLeft: AbstractChart.createLinearAxis(yMin, yMax + 1, "Badness"),
    labelLayout: "end"
  });

  const image = AbstractChart.renderChart(chart);

  return (
    <div>
      <h1>Line chart</h1>
      <p>
        Chart of <a href="https://www.xkcd.com/1612/">XKCD 1612</a>
      </p>
      <p>The worst part of colds</p>
      {PromasterReact.AbstractImageExporters.createReactSvg(image)}
    </div>
  );
}
