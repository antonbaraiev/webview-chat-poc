import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
    },
    plugins: [react()],
    define: {
      global: "window",
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".json"],
      alias: {
        util: "rollup-plugin-node-polyfills/polyfills/util",
        assert: "rollup-plugin-node-polyfills/polyfills/assert",
        os: "rollup-plugin-node-polyfills/polyfills/os",
        buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
        process: "rollup-plugin-node-polyfills/polyfills/process-es6",
        fs: "rollup-plugin-node-polyfills/polyfills/empty",
        net: "rollup-plugin-node-polyfills/polyfills/empty",
        perf_hooks: "rollup-plugin-node-polyfills/polyfills/empty",
        path: "rollup-plugin-node-polyfills/polyfills/path",
        child_process: "rollup-plugin-node-polyfills/polyfills/empty",
      },
    },
  };
});
