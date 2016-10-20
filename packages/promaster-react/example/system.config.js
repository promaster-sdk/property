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
    "react": "react/dist/react.js",
    "react-dom": "react-dom/dist/react-dom.js"
  }
});
