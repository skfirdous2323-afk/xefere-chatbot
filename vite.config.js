import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["xefere-chatbot.onrender.com"], // ✅ allow your Render domain
    port: 5173,
    host: true,
  },
});

