import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // local dev server
  },
  preview: {
    port: 4173, // preview mode
  },
  build: {
    outDir: "dist", // Vercel will serve this
  },
  define: {
    "process.env": {}, // fix potential env issue when deploying
  },
});
