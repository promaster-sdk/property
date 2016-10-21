# NOTE

We have to manually make the commonjs module produced by PEG a ESM module by removing the IIFE and
replace this:

return {
	SyntaxError: peg$SyntaxError,
	parse:       peg$parse
};

with this:

export const SyntaxError = (message, expected, found, location) => peg$SyntaxError(message, expected, found, location);
export const parse = (input) => peg$parse(input);

See:
https://github.com/pegjs/pegjs/issues/42