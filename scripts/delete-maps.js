const shell = require("shelljs");
const glob = require("glob");

shell.rm("-f", "packages/*/lib/**/*.map");
glob("packages/*/lib/{*.d.ts,**/*.d.ts}", function(er, files) {
  shell.sed("-i", /^\/\/# sourceMappingURL=.*/, "", files);
});
