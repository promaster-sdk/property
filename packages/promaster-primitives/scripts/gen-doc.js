const jsdoc2md = require('jsdoc-to-markdown');
const fs = require("fs");
var path = require('path');
const rimfaf = require("rimraf");
const mkdirp = require("mkdirp");

const basePath = path.normalize(path.join(__dirname, ".."))
console.log("basePath", basePath);
const libPath = path.join(basePath, "lib");
console.log("libPath", libPath);
const filelist = walkSync(libPath);
//console.log("filelist", filelist);

//jsdoc2md.render({ files: 'lib/**/*.js' })
//  .then((data) => fs.writeFileSync("doc.md", data));
const docPath = path.join(basePath, "doc");
//const docPath = "doc";
console.log("docPath", docPath);
if(fs.existsSync(docPath))
  rimfaf.sync(docPath);
fs.mkdirSync(docPath);

for(let file of filelist) {
  //console.log("file", file);
  const source = fs.readFileSync(file, "utf8");
  //console.log("source", source);
  const data = jsdoc2md.renderSync({ files: file });
  if(data !== "") {
    const relativePath = path.relative(libPath, file);
    //console.log(relativePath);
    const outFile = path.join(docPath, relativePath.substring(0, relativePath.length - path.extname(relativePath).length)) + ".md";
    const outDir = path.dirname(outFile);
    console.log("outFile", outFile);
    //console.log("outDir", outDir);
    mkdirp.sync(outDir);
    fs.writeFileSync(outFile, data);
  }
}

console.log("DONE!");

// List all files in a directory in Node.js recursively in a synchronous fashion
function walkSync(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  for(let file of files) {
    if(!file.startsWith(".")) {
      const nextPath = path.join(dir, file);
      if (fs.statSync(nextPath).isDirectory()) {
        filelist = walkSync(nextPath, filelist);
      }
      else {
        if(file.endsWith(".js"))
          filelist.push(nextPath);
      }
    }
  }
  return filelist;
}
