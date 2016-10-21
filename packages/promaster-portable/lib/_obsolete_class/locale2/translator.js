"use strict";
// A function that does translations by looking up them in the supplied map.
// This function can be partially applied with a map to create a Translator function.
exports.mapTranslator = function (translations, textKey, params) {
    if (!translations.has(textKey))
        return "{" + textKey + "}";
    var translation = translations[textKey];
    if (params != null) {
        Array.from(params.keys()).forEach(function (k) {
            translation = translation.replaceAll('{' + k + '}', params[k]);
        });
    }
    return translation;
};
// Partially apply the mapTranslator function so it becomes a Translator function
// Maybe this should not be a part of this library, instead the application could do this
// in its own code....
exports.applyMapTranslator = function (translations) {
    return function (textKey, params) {
        if (params === void 0) { params = null; }
        return exports.mapTranslator(translations, textKey, params);
    };
};
exports.createTranslator = exports.applyMapTranslator;
//# sourceMappingURL=translator.js.map