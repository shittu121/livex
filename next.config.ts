import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "juvxffeuxkffkphelibs.supabase.co" },
      { protocol: "https", hostname: "zdixvddyaxevaczxetor.supabase.co" },
      { protocol: "https", hostname: "drzmmzsmxnxbvuwcngev.supabase.co" },
    ],
  },
};

export default nextConfig;
