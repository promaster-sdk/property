/* eslint-disable @typescript-eslint/no-explicit-any */
// import {Parser} from "pegjs";

interface Parser {
  readonly parse: (input: any, options: any) => any;
  readonly SyntaxError: (message: any, expected: any, found: any, location: any) => any;
}

declare const parser: Parser;

export = parser;
