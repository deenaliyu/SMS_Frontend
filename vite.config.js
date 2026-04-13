import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const proxyTarget = env.VITE_API_PROXY_TARGET || "";
  const keepApiPrefix = String(env.VITE_API_PROXY_KEEP_PREFIX || "false").toLowerCase() === "true";

  return {
    plugins: [react(), tailwindcss()],
    server: proxyTarget
      ? {
          proxy: {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => (keepApiPrefix ? path : path.replace(/^\/api/, "")),
            },
          },
        }
      : undefined,
  };
});
