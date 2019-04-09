/**
 * Uglify files, overwriting the same file name.
 */
const UglifyJS = require("uglify-js");
const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const glob = require("glob")

async function uglifyFiles(files) {
  for (filepath of files) {
    // console.log(filepath);
    const content = await readFileAsync(filepath, "utf8");
    const result = UglifyJS.minify(content);
    if (result.error) {
      throw result.error;
    }
    await writeFileAsync(filepath, result.code);
  }
}

const globString = process.argv[2];
// options is optional
glob(globString, function (er, files) {
  uglifyFiles(files);
})

