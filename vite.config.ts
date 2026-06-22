import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // pdf + ALL its transitive deps (fontkit, yoga-layout, crypto-js, etc.)
          if (
            id.includes("@react-pdf") ||
            id.includes("fontkit") ||
            id.includes("yoga-layout") ||
            id.includes("crypto-js") ||
            id.includes("browserify-zlib") ||
            id.includes("fflate") ||
            id.includes("jay-peg") ||
            id.includes("vite-compatible-readable-stream") ||
            id.includes("abs-svg-path") ||
            id.includes("normalize-svg-path") ||
            id.includes("parse-svg-path") ||
            id.includes("svg-arc-to-cubic-bezier") ||
            id.includes("color-string") ||
            id.includes("emoji-regex")
          ) return "pdf";
          if (id.includes("firebase")) return "firebase";
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("@tanstack")) return "query";
          if (id.includes("react-router") || id.includes("react-router-dom")) return "router";
          if (id.includes("groq-sdk") || id.includes("groq")) return "groq";
          if (id.includes("@emailjs")) return "emailjs";
          if (id.includes("sonner")) return "sonner";
          if (id.includes("react-dom")) return "react-dom";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
}));
