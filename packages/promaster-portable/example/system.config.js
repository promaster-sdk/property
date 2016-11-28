SystemJS.config({
  baseURL: ".",
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
    "promaster-portable": {
      "main": "index.ts",
      "defaultExtension": "ts",
      "format": "system",
      "meta": {
        "*.ts": {
          "loader": "ts"
        }
      }
    },
    "@promaster/promaster-primitives": {
      "main": "lib/index.js",
      "format": "cjs"
    },
  },
  map: {
    "ts": "../node_modules/plugin-typescript/lib/",
    "typescript": "../node_modules/typescript/",
    "react": "../node_modules/react/dist/react.js",
    "react-dom": "../node_modules/react-dom/dist/react-dom.js",
    "app": "./app",
    "@promaster/promaster-primitives": "../node_modules/@promaster/promaster-primitives",
    "promaster-portable": "../src"
  },
  typescriptOptions: {
    module: "system",
    noImplicitAny: true,
    jsx: "react"
  }
});
