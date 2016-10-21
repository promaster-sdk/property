"use strict";
// Returns a function of type ExportImageFormat that looks up and runs the specified ExportImage
// function in the specified a map, using format as key.
exports.mapExportImageFormat = function (exportFunctions) {
    return function (format, scale, root) {
        return exportFunctions.get(format)(root, scale);
    };
};
exports.mapMeasureImageFormat = function (measureFunctions) {
    return function (format, component) {
        return measureFunctions.get(format)(component);
    };
};
exports.mapImportImageFormat = function (importFunctions) {
    return function (format, data) {
        return importFunctions.get(format)(data);
    };
};
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
//# sourceMappingURL=functions.js.map