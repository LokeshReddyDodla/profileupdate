import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/v1": "https://api.aihealth.clinic",
      "/profile-update-agent": "https://api.aihealth.clinic",
      "/patient-onboarding-agent": "https://api.aihealth.clinic",
      "/patient": "https://api.aihealth.clinic",
    },
  },
});
