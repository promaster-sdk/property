import {AbstractImageRoot} from "../abstract_image";
import {IAxis, ChartCurve, ChartPoint, ChartArea} from "./types";
import * as impl from "./impl/charts";

export type ChartGenerator = (width:number, height:number, marginX:number, marginY:number, xAxis:IAxis, yAxis:IAxis, curves:Array<ChartCurve>,
											 dutyPoints:Array<ChartPoint>, areas:Array<ChartArea>) =>AbstractImageRoot ;

export const generateChart = impl.generateChart;