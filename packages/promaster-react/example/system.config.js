SystemJS.config({
  baseURL: '.',
  transpiler: "ts",
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
    },
    "promaster-react": {
      "main": "index.tsx",
      "defaultExtension": "tsx",
      "format": "esm",
      "meta": {
        "*.tsx": {
          "loader": "ts"
        }
      }
    },
    "promaster-primitives": {
      "main": "lib/index",
      "format": "commonjs"
    }
  },
  map: {
    "ts": "../node_modules/plugin-typescript/lib/",
    "typescript": "../node_modules/typescript/",
    "react": "../node_modules/react/dist/react.js",
    "react-dom": "../node_modules/react-dom/dist/react-dom.js",
    "app": "./app",
    "promaster-react": "../src",
    "promaster-primitives": "../node_modules/promaster-primitives/",
    "invariant": "../node_modules/invariant"
  },
  typescriptOptions: {
    module: "system",
    noImplicitAny: true,
    jsx: "react"
  }
});
