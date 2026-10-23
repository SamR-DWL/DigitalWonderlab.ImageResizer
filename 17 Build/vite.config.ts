import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts", 
            formats: ["es"],
        },
        outDir: "./../App_Plugins/DWL.ImageResizer", 
        emptyOutDir: false,
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco/], // ignore the Umbraco Backoffice package in the build
        },
    },
    base: "/App_Plugins/DWL.ImageResizer/", // the base path of the app in the browser (used for assets)
});