
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "mobx": async () => {
          let pkg = await import("__mf__virtual/microfronts_mf_2_host__prebuild__mobx__prebuild__.js");
            return pkg;
        }
      ,
        "mobx-react": async () => {
          let pkg = await import("__mf__virtual/microfronts_mf_2_host__prebuild__mobx_mf_2_react__prebuild__.js");
            return pkg;
        }
      ,
        "mobx-react-lite": async () => {
          let pkg = await import("__mf__virtual/microfronts_mf_2_host__prebuild__mobx_mf_2_react_mf_2_lite__prebuild__.js");
            return pkg;
        }
      ,
        "react": async () => {
          let pkg = await import("__mf__virtual/microfronts_mf_2_host__prebuild__react__prebuild__.js");
            return pkg;
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/microfronts_mf_2_host__prebuild__react_mf_2_dom__prebuild__.js");
            return pkg;
        }
      ,
        "rvm-toolkit": async () => {
          let pkg = await import("__mf__virtual/microfronts_mf_2_host__prebuild__rvm_mf_2_toolkit__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "mobx": {
            name: "mobx",
            version: "6.15.0",
            scope: ["default"],
            loaded: false,
            from: "microfronts-host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"mobx"}' must be provided by host`);
              }
              usedShared["mobx"].loaded = true
              const {"mobx": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^6.15.0",
              
            }
          }
        ,
          "mobx-react": {
            name: "mobx-react",
            version: "9.2.1",
            scope: ["default"],
            loaded: false,
            from: "microfronts-host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"mobx-react"}' must be provided by host`);
              }
              usedShared["mobx-react"].loaded = true
              const {"mobx-react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^9.2.1",
              
            }
          }
        ,
          "mobx-react-lite": {
            name: "mobx-react-lite",
            version: "4.1.1",
            scope: ["default"],
            loaded: false,
            from: "microfronts-host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"mobx-react-lite"}' must be provided by host`);
              }
              usedShared["mobx-react-lite"].loaded = true
              const {"mobx-react-lite": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^4.1.1",
              
            }
          }
        ,
          "react": {
            name: "react",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "microfronts-host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react"}' must be provided by host`);
              }
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.3.1",
              
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "microfronts-host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-dom"}' must be provided by host`);
              }
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.3.1",
              
            }
          }
        ,
          "rvm-toolkit": {
            name: "rvm-toolkit",
            version: "1.0.7",
            scope: ["default"],
            loaded: false,
            from: "microfronts-host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"rvm-toolkit"}' must be provided by host`);
              }
              usedShared["rvm-toolkit"].loaded = true
              const {"rvm-toolkit": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.0.7",
              
            }
          }
        
    }
      const usedRemotes = [
                {
                  entryGlobalName: "mf5ka",
                  name: "mf5ka",
                  type: "module",
                  entry: "./microfront/5ka-microfront/remoteEntry.js",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "mfauchan",
                  name: "mfauchan",
                  type: "module",
                  entry: "./microfront/auchan-microfront/remoteEntry.js",
                  shareScope: "default",
                }
          
      ]
      export {
        usedShared,
        usedRemotes
      }
      