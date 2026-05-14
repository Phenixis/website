import type { NextConfig } from "next";
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(__dirname, '../../.env.local'), override: false })

const nextConfig: NextConfig = {};

export default nextConfig;
