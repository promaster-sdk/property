import {AbstractSize, AbstractComponent, AbstractImageRoot} from "./model/index";
import {RenderedImage} from './model/rendered_image';

/*
 Example usage:

 At bootstrap, create a ExportImageFormat type function from the mapExportImageFormat function:

 let exportImageFunctions = new Map<string, ExportImage>();
 exportImageFunctions.set('react_svg',reactSvgExportImage);
 exportImageFunctions.set('dxf2d',dxf2dExportImage);
 let exportImageFormat:ExportImageFormat = mapExportImageFormat(exportImageFunctions);

 At usage, call the ExportImageFormat function:

 let renderedImage = exportImageFormat("dxf2d", abstractImage, 1);
 let dxf = renderedImage.output;

 */

// Function types
export type ExportImage = (root:AbstractImageRoot, scale:number) => RenderedImage;
export type MeasureImage = (component:AbstractComponent) => AbstractSize;
export type ImportImage = (data:any) => AbstractImageRoot;

export type ExportImageFormat = (format:string, scale:number, root:AbstractImageRoot) => RenderedImage;
export type MeasureImageFormat = (format:string, component:AbstractComponent) => AbstractSize;
export type ImportImageFormat = (format:string, data:any) => AbstractImageRoot;


// Returns a function of type ExportImageFormat that looks up and runs the specified ExportImage
// function in the specified a map, using format as key.
export const mapExportImageFormat = (exportFunctions:Map<string, ExportImage>) =>
	(format:string, scale:number, root:AbstractImageRoot):RenderedImage =>
		exportFunctions.get(format)(root, scale);

export const mapMeasureImageFormat = (measureFunctions:Map<string, MeasureImage>) =>
	(format:string, component:AbstractComponent):AbstractSize =>
		measureFunctions.get(format)(component);

export const mapImportImageFormat = (importFunctions:Map<string, ImportImage>) =>
	(format:string, data:any):AbstractImageRoot =>
		importFunctions.get(format)(data);


/*
 // Looks up and runs the specified ExportImage function in the specified a map, using format as key.
 // This function can be partially applied to create a function of type ExportImageFormat.
 export const mapExportImageFormat = (exportFunctions:Map<string, ExportImage>, format:string,
 root:AbstractImageRoot, scale:number):RenderedImage => exportFunctions.get(format)(root, scale);

 export const mapMeasureImageFormat = (measureFunctions:Map<string, MeasureImage>, format:string,
 component:AbstractComponent):AbstractSize =>
 measureFunctions.get(format)(component);

 export const mapImportImageFormat = (importFunctions:Map<string, ImportImage>, format:string,
 data:any):AbstractImageRoot =>
 importFunctions.get(format)(data);

 // Partially apply mapExportImageFormat() to create a function of type ExportImageFormat.
 export const applyMapExportImageFormat = (exportFunctions:Map<string, ExportImage>):ExportImageFormat =>
 (format:string, root:AbstractImageRoot, scale:number):RenderedImage =>
 mapExportImageFormat(exportFunctions, format, root, scale);

 // Partially apply mapMeasureImageFormat() to create a function of type MeasureImageFormat.
 export const applyMapMeasureImageFormat = (measureFunctions:Map<string, MeasureImage>):MeasureImageFormat =>
 (format:string, component:AbstractComponent):AbstractSize =>
 mapMeasureImageFormat(measureFunctions, format, component);

 // Partially apply mapImportImageFormat() to create a function of type ImportImageFormat.
 export const applyMapImportImageFormat = (importFunctions:Map<string, ImportImage>):ImportImageFormat =>
 ( format:string, data:any):AbstractImageRoot =>
 mapImportImageFormat(importFunctions, format, data);

 */