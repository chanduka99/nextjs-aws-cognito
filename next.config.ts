import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti("./config/env");

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
