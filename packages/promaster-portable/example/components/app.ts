import {DOM, createFactory, Component} from "react";
import {abstractImageDemo1} from "./abstract_image_demo1";
import {
	ExportImage,
	ExportImageFormat,
	mapExportImageFormat,
	reactSvgExportImage,
	dxf2dExportImage,
	svgExportImage
} from "promaster-portable/lib/abstract_image";

class App extends Component<any, any> {

  render() {
		let exportImageFunctions = new Map<string, ExportImage>();
		exportImageFunctions.set('react_svg',reactSvgExportImage);
		exportImageFunctions.set('dxf2d',dxf2dExportImage);
		exportImageFunctions.set('svg',svgExportImage);
		let exportImageFormat:ExportImageFormat = mapExportImageFormat(exportImageFunctions);


		return DOM.div({}, [
			DOM.div({
				'style': {'margin': '10px'}
			}, DOM.b({}, "DEMO1:")),
			abstractImageDemo1({exportImageFormat:exportImageFormat})
		]);

  }
}

export const app = createFactory(App);
