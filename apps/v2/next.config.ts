import type { NextConfig } from "next";
import { config } from 'dotenv'
import path from 'path'

// Load root .env.local for shared vars, then local .env.local for app-specific vars
config({ path: path.resolve(__dirname, '../../.env.local'), override: false })
config({ path: path.resolve(__dirname, '.env.local'), override: false })

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
