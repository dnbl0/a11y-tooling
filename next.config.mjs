/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Playwright + Prisma must stay server-side (native deps).
  serverExternalPackages: ["playwright", "@prisma/client"],
  // React Spectrum ships ESM + CSS side-effect imports; transpiling its
  // packages keeps Next's bundler happy across the App Router boundary.
  transpilePackages: [
    "@adobe/react-spectrum",
    "@react-spectrum/charts",
    "@spectrum-icons/workflow",
    "@react-aria/utils",
    "@react-stately/utils",
  ],
};

export default nextConfig;
