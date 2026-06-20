import createNextIntlPlugin from 'next-intl/plugin';
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
