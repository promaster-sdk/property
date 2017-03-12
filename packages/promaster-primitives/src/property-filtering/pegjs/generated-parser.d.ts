// import {Parser} from "pegjs";

interface Parser {
    parse: (input: any, options: any) => any,
    SyntaxError: (message: any, expected: any, found: any, location: any) => any,
}

declare const parser: Parser;

export = parser;
