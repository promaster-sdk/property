import * as React from 'react';
import {
    ExportImageFormat,
    AbstractImageBuilder,
    AbstractColors,
    AbstractPoint,
    AbstractFontWeight
} from "promaster-portable/lib/abstract_image";

interface IAbstractImageDemo1Props {
    exportImageFormat:ExportImageFormat
}

interface IAbstractImageDemo1State {
    abstractImage?:any,
    renderedSvg?:any,
    dxfDownloadUrl?:any,
    htmlSVG?:any
}

class AbstractImageDemo1 extends React.Component<IAbstractImageDemo1Props, IAbstractImageDemo1State> {

    constructor() {
        super();
        this._createImage = this._createImage.bind(this);
        this._renderToDxf = this._renderToDxf.bind(this);
        this._renderSVGTags = this._renderSVGTags.bind(this);
        this._renderDownloadLink = this._renderDownloadLink.bind(this);
    }

    render() {
        const hasCreatedImage =  this.state && this.state.abstractImage;
        return React.DOM.div({}, [
            React.DOM.button({
                    'style': {'margin': '10px'},
                    'onClick': this._createImage
                },
                "Create Image"),
            React.DOM.button({'onClick': this._renderToDxf, disabled: !hasCreatedImage}, "Save as DXF"),
            React.DOM.button({'onClick': this._renderSVGTags, disabled: !hasCreatedImage}, "Render SVG without react"),
            React.DOM.div({}, [this._renderDownloadLink()]),
            React.DOM.div({
                'style': {'backgroundColor': 'cornsilk'}
            }, this.state === null ? undefined : this.state.renderedSvg)
        ]);
    }

    _createImage() {
        let imageBuilder = new AbstractImageBuilder(200, 200, AbstractColors.Cyan);
        imageBuilder.addRectangle(
            10.0, 10.0, 100.0, 100.0, AbstractColors.Red, 1.0, AbstractColors.Blue);
        imageBuilder.addLine(10.0, 10.0, 100.0, 100.0, AbstractColors.Red, 1.0);
        imageBuilder.addPolygon([
            new AbstractPoint(10.0, 10.0),
            new AbstractPoint(100.0, 100.0),
            new AbstractPoint(50.0, 100.0)
        ], AbstractColors.Red, 1.0, null);

        imageBuilder.addEllipse(
            50.0, 50.0, 50.0, 90.0, AbstractColors.Brown, 3.0, null);
        imageBuilder.addText(100.0, 100.0, "Olle", "Helvetica", 11,
            AbstractColors.Black, AbstractFontWeight.Normal);


        let abstractImage = imageBuilder.build();

        let renderedImage = this.props.exportImageFormat("react_svg", 1, abstractImage);
        let svg = renderedImage.output;

        this.setState({abstractImage: abstractImage, renderedSvg: svg});
    }

    _renderToDxf() {
        let renderedImage = this.props.exportImageFormat("dxf2d", 1, this.state.abstractImage);
        let dxf = renderedImage.output;

        // Create a new blob from the data.
        let blob = new Blob([dxf], {type: 'text/plain', endings: 'native'});
        // Create a data:url which points to that data.
        let url = URL.createObjectURL(blob);

        console.log("Url: " + url);
        this.setState({dxfDownloadUrl: url});
    }

    _renderSVGTags() {
        const renderedImage = this.props.exportImageFormat("svg", 1, this.state.abstractImage);
        // console.log(renderedImage.output);
        const win = window.open("", "WINDOWID");
        const doc = win.document;
        doc.open("text/plain");
        doc.write(renderedImage.output);
        doc.close();
    }

    _renderDownloadLink() {
        console.log("State: " + this.state);

        if (this.state) {
            if (this.state.dxfDownloadUrl != null) {
                return React.DOM.a(
                    {'href': this.state.dxfDownloadUrl, 'download': 'abstract_image_demo1.dxf'},
                    'Download Now!');
            }
        }
    }
}

export const abstractImageDemo1 = React.createFactory(AbstractImageDemo1);

