import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/v1": "http://localhost:8000",
      "/profile-update-agent": "http://localhost:8000",
      "/patient-onboarding-agent": "http://localhost:8000",
      "/patient": "http://localhost:8000",
    },
  },
});
