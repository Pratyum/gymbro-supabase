/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'wlhvzoclxnlzjfwbibmw.supabase.co',
                port: '',
              },
        ]
    }
};

export default nextConfig;
