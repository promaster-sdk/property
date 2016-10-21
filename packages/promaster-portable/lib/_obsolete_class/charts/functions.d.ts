import { AbstractImageRoot } from "../abstract_image";
import { IAxis, ChartCurve, ChartPoint, ChartArea } from "./types";
export declare type ChartGenerator = (width: number, height: number, marginX: number, marginY: number, xAxis: IAxis, yAxis: IAxis, curves: Array<ChartCurve>, dutyPoints: Array<ChartPoint>, areas: Array<ChartArea>) => AbstractImageRoot;
export declare const generateChart: ChartGenerator;
