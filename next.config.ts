import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  // TEMPORAL: para ubicar el origen exacto del error ".map is not a function"
  // en producción — revertir una vez identificado (expone código fuente legible).
  productionBrowserSourceMaps: true,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
    qualities: [100, 75],
    formats: ["image/webp"],
  },
};

export default nextConfig;
