"use strict";
function createImage(imageResource, width, height) {
    if (imageResource == null)
        throw new Error("imageResource");
    if (isNaN(width))
        throw new Error("width");
    if (isNaN(height))
        throw new Error("height");
    return {
        type: "Image",
        imageResource: imageResource,
        width: width,
        height: height,
    };
}
exports.createImage = createImage;
//# sourceMappingURL=image.js.map