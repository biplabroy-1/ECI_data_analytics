import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:5000/api/:path*" // Flask (local)
            : "https://your-flask-service.onrender.com/api/:path*", // Flask (prod)
      },
    ];
  },
};

export default nextConfig;
