export type Translator = (textKey:string, params?:Map<string, string>) => string;

// A function that does translations by looking up them in the supplied map.
// This function can be partially applied with a map to create a Translator function.
export const mapTranslator = (translations:Map<string, string>, textKey:string, params?:Map<string, string>) => {

	if (!translations.has(textKey))
		return "{" + textKey + "}";
	var translation = translations[textKey];
	if (params != null) {
		Array.from(params.keys()).forEach((k) => {
			translation = translation.replaceAll('{' + k + '}', params[k]);
		});
	}
	return translation;

};

// Partially apply the mapTranslator function so it becomes a Translator function
// Maybe this should not be a part of this library, instead the application could do this
// in its own code....
export const applyMapTranslator = (translations:Map<string, string>):Translator =>
	(textKey:string, params:Map<string, string> = null):string => mapTranslator(translations, textKey, params);

export const createTranslator = applyMapTranslator;
