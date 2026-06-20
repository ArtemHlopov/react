import createNextIntlPlugin from 'next-intl/plugin';
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  turbopack: {},
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
