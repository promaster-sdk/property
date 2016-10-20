SystemJS.config({
    baseURL: '../',
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
        "example/app": {
            "main": "app.tsx",
            "defaultExtension": "tsx",
            "format": "esm",
            "meta": {
                "*.tsx": {
                    "loader": "ts"
                },
                "*.ts": {
                    "loader": "ts"
                }
            }
        }
    },
    map: {
        "ts": "node_modules/plugin-typescript/lib/",
        "typescript": "node_modules/typescript/"
    }
});
