# @promaster/uom

## Introduction

This is the unit of measure library.

## How to install

Once you have the [promaster npm registry](#npm-registry) setup and working, you can install the package using this command: `npm install --save @promaster/uom`.

## Usage

```ts
import { Amount, Units } from "@promaster/uom";

const amount = Amount.create(10, Units.Meter);
const inch = Amount.valueAs(Units.Inch, amount);
```

## Run-time requirements

This libarary is compiled to ES5 and does not require any polyfills. It does not use any ES6 specific API:s like `Map` or `Set`.

## Prior art

This library is inspired by [JSR-275](JSR-275.pdf).

According to http://kenai.com/projects/jsr-275/pages/HomeJSR-275 has been archived and moved to:

http://code.google.com/p/unitsofmeasure/

For more information check these links:

http://jscience.org/jsr-275/api/

http://jscience.org/api/javax/measure/unit/package-summary.html

http://kenai.com/projects/jsr-275/downloads/download/JSR-275.pdf

http://www.javaworld.com/javaworld/jw-10-2007/jw-10-jsr275.html

http://www.java2s.com/Open-Source/Java-Document/6.0-JDK-Modules/jsr-275/javax/measure/unit/ProductUnit.java.htm

A new library has been accepted as JSR-363:

http://www.baeldung.com/javax-measure
