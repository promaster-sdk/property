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
    "promaster-react": {
      "main": "index.tsx",
      "defaultExtension": "tsx",
      "format": "system",
      "meta": {
        "*.tsx": {
          "loader": "ts"
        }
      }
    },
    "promaster-primitives": {
      "main": "lib/index.js",
      "format": "cjs"
    },
    "promaster-primitives2": {
      "main": "lib/index.js",
      "format": "system",
      "meta": {
        "*.json": {
          "format": "json"
        },
        "index.ts": {
          "format": "esm"
        },
        "lib/index.d.ts": {
          "format": "esm"
        },
        "lib/primitives.d.ts": {
          "format": "esm"
        },
        "lib/src/internal_utils/index.d.ts": {
          "format": "esm"
        },
        "lib/src/measure/index.d.ts": {
          "format": "esm"
        },
        "lib/src/measure/quantity/index.d.ts": {
          "format": "esm"
        },
        "lib/src/product_properties/index.d.ts": {
          "format": "esm"
        },
        "lib/src/property_filtering/ast/index.d.ts": {
          "format": "esm"
        },
        "lib/src/property_filtering/index.d.ts": {
          "format": "esm"
        },
        "primitives.ts": {
          "format": "esm"
        },
        "src/internal_utils/index.ts": {
          "format": "esm"
        },
        "src/measure/index.ts": {
          "format": "esm"
        },
        "src/measure/quantity/index.ts": {
          "format": "esm"
        },
        "src/product_properties/index.ts": {
          "format": "esm"
        },
        "src/property_filtering/ast/index.ts": {
          "format": "esm"
        },
        "src/property_filtering/index.ts": {
          "format": "esm"
        },
        "test/measure/amount_delta_temperature_test.ts": {
          "format": "esm"
        },
        "test/measure/units_test.ts": {
          "format": "esm"
        },
        "test/product_properties/*": {
          "format": "esm"
        },
        "test/property_filtering/pegjs/*": {
          "format": "esm"
        },
        "test/property_filtering/property_filter_benchmark.ts": {
          "format": "esm"
        }
      },
      "map": {
        "./lib": "./lib/index.js",
        "./lib/src/internal_utils": "./lib/src/internal_utils/index.js",
        "./lib/src/measure": "./lib/src/measure/index.js",
        "./lib/src/measure/quantity": "./lib/src/measure/quantity/index.js",
        "./lib/src/product_properties": "./lib/src/product_properties/index.js",
        "./lib/src/property_filtering": "./lib/src/property_filtering/index.js",
        "./lib/src/property_filtering/ast": "./lib/src/property_filtering/ast/index.js"
      }
    }
  },
  map: {
    "ts": "../node_modules/plugin-typescript/lib/",
    "typescript": "../node_modules/typescript/",
    "react": "../node_modules/react/dist/react.js",
    "react-dom": "../node_modules/react-dom/dist/react-dom.js",
    "app": "./app",
    "promaster-react": "../src",
    "promaster-primitives": "../node_modules/promaster-primitives",
    "invariant": "../node_modules/invariant"
  },
  typescriptOptions: {
    module: "system",
    noImplicitAny: true,
    jsx: "react"
  }
});
