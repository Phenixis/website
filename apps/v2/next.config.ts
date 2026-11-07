import type { NextConfig } from "next";
import { config } from 'dotenv'
import path from 'path'

// Load root .env.local for shared vars, then local .env.local for app-specific vars
config({ path: path.resolve(__dirname, '../../.env.local'), override: false, quiet: true })
config({ path: path.resolve(__dirname, '.env.local'), override: false, quiet: true })

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client"],
  allowedDevOrigins: ["mdserv-1.tail46603a.ts.net", "192.168.1.21"],
};

export default nextConfig;
