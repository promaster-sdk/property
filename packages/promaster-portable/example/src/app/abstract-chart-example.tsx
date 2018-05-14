import * as React from "react";
import { AbstractChart, AbstractImage } from "../../../src/index";
import * as PromasterReact from "../../../../promaster-react/src/index";

function getLineRange(
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

function generateLineChart(): AbstractChart.Chart {
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

  const [xMin, xMax] = getLineRange(series, point => point.x);
  const [yMin, yMax] = getLineRange(series, point => point.y);

  const chart = AbstractChart.createChart({
    chartLines: series,
    xAxisBottom: AbstractChart.createLinearAxis(xMin, xMax, "Days with cold"),
    yAxisLeft: AbstractChart.createLinearAxis(yMin, yMax + 1, "Badness"),
    labelLayout: "center"
  });

  return chart;
}

function getStackRange(
  points: ReadonlyArray<AbstractChart.StackPoints>,
  axisSelector: (point: AbstractChart.StackPoints) => ReadonlyArray<number>
): [number, number] {
  const axisValues = points
    .map(axisSelector)
    .map(stackedValues => {
      let sum = 0;
      return stackedValues.map(value => {
        sum += value;
        return sum;
      });
    })
    .reduce(
      (soFar, current) => {
        return [...soFar, ...current];
      },
      [] as ReadonlyArray<number>
    );
  return [Math.min(...axisValues), Math.max(...axisValues)];
}

function generateStackedChart(): AbstractChart.Chart {
  const stack = AbstractChart.createChartStack({
    points: [
      { x: 0, ys: [0, 0] },
      { x: 1, ys: [2, 0] },
      { x: 2, ys: [4, 0] },
      { x: 3, ys: [1.5, 1] },
      { x: 4, ys: [1, 2] },
      { x: 5, ys: [0, 3] },
      { x: 6, ys: [0, 2.8] },
      { x: 7, ys: [0, 2] },
      { x: 8, ys: [0, 1.5] }
    ],
    xAxis: "bottom",
    yAxis: "left",
    config: [
      AbstractChart.createChartStackConfig({
        color: AbstractImage.red,
        label: "How bad you feel"
      }),
      AbstractChart.createChartStackConfig({
        color: AbstractImage.blue,
        label: "How bad you sound"
      })
    ]
  });

  const [xMin, xMax] = getStackRange(stack.points, point => [point.x]);
  const [yMin, yMax] = getStackRange(stack.points, point => point.ys);

  const chart = AbstractChart.createChart({
    chartStack: stack,
    xAxisBottom: AbstractChart.createLinearAxis(xMin, xMax, "Days with cold"),
    yAxisLeft: AbstractChart.createLinearAxis(yMin, yMax + 1, "Badness"),
    labelLayout: "center"
  });

  return chart;
}

export function AbstractChartExample(): JSX.Element {
  return (
    <div>
      <h1>Line chart</h1>
      <p>
        Chart of <a href="https://www.xkcd.com/1612/">XKCD 1612</a>
      </p>
      <p>The worst part of colds</p>
      {PromasterReact.AbstractImageExporters.createReactSvg(
        AbstractChart.renderChart(generateLineChart())
      )}
      <h1>Stacked chart</h1>
      <p>Stacked version of above XKCD line graph.</p>
      {PromasterReact.AbstractImageExporters.createReactSvg(
        AbstractChart.renderChart(generateStackedChart())
      )}
    </div>
  );
}
