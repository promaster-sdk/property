SystemJS.config({
  baseURL: '../node_modules/',
  paths: {
    "app/": "./app/"
  },
  packages: {
    "ts": {
      "main": "plugin.js"
    },
    "typescript": {
      "main": "lib/typescript.js",
      "meta": {
        "lib/typescript.js": {
          "exports": "ts"
        }
      }
    },
    "app": {
      "main": "app.tsx",
      "defaultExtension": "tsx",
      "format": "esm",
      "meta": {
        "*.tsx": {
          "loader": "ts"
        }
      }
    }
  },
  map: {
    "ts": "plugin-typescript/lib/",
    "typescript": "typescript/",
    "react": "https://unpkg.com/react@15.3.2/dist/react.js",
    "react-dom": "https://unpkg.com/react-dom@15.3.2/dist/react-dom.js"
  }
});
