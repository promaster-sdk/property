# NOTE

The generated parser it in it's on node_modules. Previously we renamed it to .ts and 
compiled it but that is not possible with noImplicitAny so now we treat it as a CommonJS 
module and put it in its own node_modules.