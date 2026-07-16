import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "Career Genie",
        short_name: "CareerGenie",
        description: "AI-powered career guidance: resume building, interview prep, mentorship, and career exploration.",
        theme_color: "#BE460E",
        background_color: "#F6F3EF",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.hostname.includes("firebaseio.com") ||
              url.hostname.includes("firestore.googleapis.com") ||
              url.hostname.includes("identitytoolkit.googleapis.com") ||
              url.pathname.startsWith("/api/"),
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ].filter(Boolean),
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
