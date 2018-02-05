// import {Parser} from "pegjs";

// tslint:disable no-any

interface Parser {
  readonly parse: (input: any, options: any) => any;
  readonly SyntaxError: (
    message: any,
    expected: any,
    found: any,
    location: any
  ) => any;
}

declare const parser: Parser;

export = parser;
